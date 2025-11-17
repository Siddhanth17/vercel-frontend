import React from 'react';
import VoiceAssistant from '../components/features/VoiceAssistant';
import { useNavigate } from 'react-router-dom';
import './VoiceAssistantPage.css';

const VoiceAssistantPage = () => {
  const navigate = useNavigate();

  const handleBookingRequest = (prefilled) => {
    const params = new URLSearchParams(prefilled).toString();
    navigate(`/book-ticket?${params}`);
  };

  const handleSearchRequest = (searchParams) => {
    const params = new URLSearchParams(searchParams).toString();
    navigate(`/book-ticket?${params}`);
  };

  return (
    <div className="voice-assistant-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🎤 AI Voice Assistant</h1>
          <p>Book tickets, search trains, and manage your journey using voice commands</p>
        </div>
        
        <VoiceAssistant 
          onBookingRequest={handleBookingRequest}
          onSearchRequest={handleSearchRequest}
        />
        
        <div className="voice-features-info">
          <div className="feature-grid">
            <div className="feature-item">
              <h3>🌍 Multi-Language Support</h3>
              <p>Speak in English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, or Punjabi</p>
            </div>
            
            <div className="feature-item">
              <h3>⏰ No Time Limits</h3>
              <p>Take your time to speak. Perfect for senior citizens and careful speakers</p>
            </div>
            
            <div className="feature-item">
              <h3>🎯 Smart Understanding</h3>
              <p>AI understands natural speech patterns and booking intents</p>
            </div>
            
            <div className="feature-item">
              <h3>🔊 Voice Feedback</h3>
              <p>Get audio responses and confirmations in your preferred language</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;