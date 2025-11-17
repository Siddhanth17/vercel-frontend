import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './VoiceAssistant.css';

const VoiceAssistant = ({ onBookingRequest, onSearchRequest }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [voiceResponse, setVoiceResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const { user } = useContext(AuthContext);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    loadSupportedLanguages();
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const loadSupportedLanguages = async () => {
    try {
      const response = await axios.get('/voice/languages');
      setSupportedLanguages(response.data.data);
    } catch (error) {
      console.error('Error loading languages:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        addToConversation('system', 'Listening... Speak now');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  };

  const getLanguageCode = (langCode) => {
    const languageCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'or': 'or-IN',
      'pa': 'pa-IN'
    };
    return languageCodes[langCode] || 'en-US';
  };

  const startListening = () => {
    if (!user) {
      toast.error('Please login to use voice assistant');
      return;
    }

    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async (command) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    addToConversation('user', command);

    try {
      const response = await axios.post('/voice/process', {
        transcript: command,
        language: selectedLanguage
      });

      const { recognized, data, voiceResponse: responseText } = response.data.data;

      if (recognized) {
        addToConversation('assistant', responseText);
        
        // Handle different actions
        switch (data.action) {
          case 'show_booking_form':
            if (onBookingRequest) {
              onBookingRequest(data.prefilled);
            }
            break;
          case 'show_search_results':
            if (onSearchRequest) {
              onSearchRequest(data.searchParams);
            }
            break;
          case 'check_pnr_status':
            // Handle PNR status check
            break;
          default:
            break;
        }

        // Speak the response
        speakText(responseText);
      } else {
        const message = response.data.data.message;
        addToConversation('assistant', message);
        speakText(message);
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      const errorMessage = 'Sorry, I could not process your request. Please try again.';
      addToConversation('assistant', errorMessage);
      speakText(errorMessage);
      toast.error('Voice processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text) => {
    if (synthRef.current && text) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a voice for the selected language
      const voices = synthRef.current.getVoices();
      const voice = voices.find(v => v.lang.startsWith(selectedLanguage)) || voices[0];
      if (voice) {
        utterance.voice = voice;
      }

      synthRef.current.speak(utterance);
    }
  };

  const addToConversation = (sender, message) => {
    setConversationHistory(prev => [...prev, {
      id: Date.now(),
      sender,
      message,
      timestamp: new Date()
    }]);
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setTranscript('');
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(langCode);
    }
    toast.success(`Language changed to ${supportedLanguages.find(l => l.code === langCode)?.name}`);
  };

  return (
    <div className="voice-assistant">
      <div className="voice-header">
        <h2>🎤 AI Voice Assistant</h2>
        <p>Speak naturally to book tickets, search trains, and more</p>
      </div>

      <div className="language-selector">
        <label>Select Language:</label>
        <select 
          value={selectedLanguage} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-select"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>

      <div className="voice-controls">
        <div className="microphone-section">
          <button
            className={`mic-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            <div className="mic-icon">
              {isListening ? '🔴' : '🎤'}
            </div>
            <div className="mic-status">
              {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Click to Speak'}
            </div>
          </button>
        </div>

        {transcript && (
          <div className="transcript-display">
            <h4>You said:</h4>
            <p>"{transcript}"</p>
          </div>
        )}
      </div>

      <div className="conversation-panel">
        <div className="conversation-header">
          <h3>Conversation</h3>
          <button onClick={clearConversation} className="clear-btn">
            Clear
          </button>
        </div>
        
        <div className="conversation-history">
          {conversationHistory.length === 0 ? (
            <div className="empty-conversation">
              <p>Start a conversation by clicking the microphone and speaking!</p>
              <div className="example-commands">
                <h4>Try saying:</h4>
                <ul>
                  <li>"Book a ticket from Delhi to Mumbai"</li>
                  <li>"Search trains for tomorrow"</li>
                  <li>"Check my booking status"</li>
                  <li>"Find trains from Bangalore to Chennai"</li>
                </ul>
              </div>
            </div>
          ) : (
            conversationHistory.map(item => (
              <div key={item.id} className={`conversation-item ${item.sender}`}>
                <div className="message-header">
                  <span className="sender-icon">
                    {item.sender === 'user' ? '👤' : item.sender === 'assistant' ? '🤖' : '⚙️'}
                  </span>
                  <span className="sender-name">
                    {item.sender === 'user' ? 'You' : item.sender === 'assistant' ? 'Assistant' : 'System'}
                  </span>
                  <span className="timestamp">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-content">
                  {item.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="voice-features">
        <div className="feature-item">
          <span className="feature-icon">🌍</span>
          <div className="feature-text">
            <h4>Multi-Language Support</h4>
            <p>Speak in your preferred language including regional Indian languages</p>
          </div>
        </div>
        
        <div className="feature-item">
          <span className="feature-icon">⏰</span>
          <div className="feature-text">
            <h4>No Time Limits</h4>
            <p>Take your time - perfect for senior citizens and careful speakers</p>
          </div>
        </div>
        
        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <div className="feature-text">
            <h4>Smart Understanding</h4>
            <p>AI understands natural speech patterns and booking intents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;