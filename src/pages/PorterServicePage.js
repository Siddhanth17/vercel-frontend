import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BookingContext } from '../contexts/BookingContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingTrain from '../components/common/LoadingTrain';
import './PorterServicePage.css';

const PorterServicePage = () => {
  const { user } = useContext(AuthContext);
  const { addPorterService } = useContext(BookingContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedPorter, setSelectedPorter] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    luggageCount: 1,
    serviceType: 'platform',
    specialInstructions: '',
    contactNumber: user?.phone || ''
  });

  const stations = [
    'New Delhi Railway Station',
    'Mumbai Central',
    'Bangalore City Junction',
    'Chennai Central',
    'Kolkata Howrah',
    'Hyderabad Deccan',
    'Pune Junction',
    'Ahmedabad Junction',
    'Jaipur Junction',
    'Lucknow Charbagh'
  ];

  const porters = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      rating: 4.8,
      experience: '8 years',
      languages: ['Hindi', 'English'],
      specialties: ['Heavy Luggage', 'Senior Citizens'],
      baseRate: 50,
      platformRate: 30,
      image: '👨‍💼',
      reviews: 245,
      availability: 'Available Now'
    },
    {
      id: 2,
      name: 'Suresh Patel',
      rating: 4.9,
      experience: '12 years',
      languages: ['Hindi', 'Gujarati', 'English'],
      specialties: ['Quick Service', 'Multiple Bags'],
      baseRate: 60,
      platformRate: 35,
      image: '👨‍🔧',
      reviews: 312,
      availability: 'Available Now'
    },
    {
      id: 3,
      name: 'Mohan Singh',
      rating: 4.7,
      experience: '6 years',
      languages: ['Hindi', 'Punjabi'],
      specialties: ['Fragile Items', 'Long Distance'],
      baseRate: 45,
      platformRate: 28,
      image: '👨‍💼',
      reviews: 189,
      availability: 'Available in 10 mins'
    },
    {
      id: 4,
      name: 'Abdul Rahman',
      rating: 4.9,
      experience: '15 years',
      languages: ['Hindi', 'Urdu', 'English'],
      specialties: ['VIP Service', 'Heavy Luggage'],
      baseRate: 70,
      platformRate: 40,
      image: '👨‍💼',
      reviews: 428,
      availability: 'Available Now'
    }
  ];

  const serviceTypes = [
    {
      id: 'platform',
      name: 'Platform Assistance',
      description: 'Help with luggage on platform only',
      icon: '🚉',
      multiplier: 1
    },
    {
      id: 'coach',
      name: 'Coach to Coach',
      description: 'Carry luggage from one coach to another',
      icon: '🚂',
      multiplier: 1.5
    },
    {
      id: 'exit',
      name: 'Platform to Exit',
      description: 'Carry luggage from platform to station exit',
      icon: '🚪',
      multiplier: 2
    },
    {
      id: 'taxi',
      name: 'Exit to Taxi/Auto',
      description: 'Carry luggage to taxi stand or auto stand',
      icon: '🚕',
      multiplier: 2.5
    }
  ];

  const calculatePrice = (porter, serviceType, luggageCount) => {
    const basePrice = serviceType === 'platform' ? porter.platformRate : porter.baseRate;
    const serviceMultiplier = serviceTypes.find(s => s.id === serviceType)?.multiplier || 1;
    return Math.round(basePrice * serviceMultiplier * luggageCount);
  };

  const handlePorterSelect = (porter) => {
    setSelectedPorter(porter);
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      toast.error('Please login to book porter service');
      navigate('/login');
      return;
    }

    if (!selectedStation) {
      toast.error('Please select a station');
      return;
    }

    if (!selectedPorter) {
      toast.error('Please select a porter');
      return;
    }

    if (!bookingDetails.contactNumber) {
      toast.error('Please provide your contact number');
      return;
    }

    setLoading(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalPrice = calculatePrice(selectedPorter, bookingDetails.serviceType, bookingDetails.luggageCount);
      
      // Add to booking context
      addPorterService({
        porterName: selectedPorter.name,
        serviceType: bookingDetails.serviceType,
        station: selectedStation,
        luggageCount: bookingDetails.luggageCount,
        totalPrice: totalPrice
      });
      
      toast.success(`Porter service booked successfully! Total: ₹${totalPrice} 🎉`);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingTrain message="Booking porter service..." fullScreen />;
  }

  return (
    <div className="porter-service-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🎒 Porter Service</h1>
          <p>Professional luggage assistance at railway stations</p>
        </div>

        <div className="service-content">
          <div className="booking-form-section">
            <div className="form-card">
              <h2>📍 Service Details</h2>
              
              <div className="form-group">
                <label>🚉 Select Station</label>
                <select 
                  value={selectedStation} 
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Choose your station</option>
                  {stations.map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>🎒 Number of Luggage Items</label>
                <select 
                  value={bookingDetails.luggageCount} 
                  onChange={(e) => setBookingDetails({...bookingDetails, luggageCount: parseInt(e.target.value)})}
                  className="form-select"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'item' : 'items'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>🔧 Service Type</label>
                <div className="service-types">
                  {serviceTypes.map(service => (
                    <div 
                      key={service.id}
                      className={`service-type ${bookingDetails.serviceType === service.id ? 'selected' : ''}`}
                      onClick={() => setBookingDetails({...bookingDetails, serviceType: service.id})}
                    >
                      <span className="service-icon">{service.icon}</span>
                      <div className="service-info">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>📱 Contact Number</label>
                <input
                  type="tel"
                  value={bookingDetails.contactNumber}
                  onChange={(e) => setBookingDetails({...bookingDetails, contactNumber: e.target.value})}
                  placeholder="Enter your mobile number"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>📝 Special Instructions (Optional)</label>
                <textarea
                  value={bookingDetails.specialInstructions}
                  onChange={(e) => setBookingDetails({...bookingDetails, specialInstructions: e.target.value})}
                  placeholder="Any special requirements or instructions..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="porters-section">
            <h2>👨‍💼 Available Porters</h2>
            {!selectedStation ? (
              <div className="no-station">
                <p>Please select a station to see available porters</p>
              </div>
            ) : (
              <div className="porters-grid">
                {porters.map(porter => (
                  <div 
                    key={porter.id} 
                    className={`porter-card ${selectedPorter?.id === porter.id ? 'selected' : ''}`}
                    onClick={() => handlePorterSelect(porter)}
                  >
                    <div className="porter-header">
                      <span className="porter-image">{porter.image}</span>
                      <div className="porter-info">
                        <h3>{porter.name}</h3>
                        <div className="porter-rating">
                          <span className="stars">⭐ {porter.rating}</span>
                          <span className="reviews">({porter.reviews} reviews)</span>
                        </div>
                        <p className="experience">{porter.experience} experience</p>
                      </div>
                      <div className="porter-price">
                        <span className="price">
                          ₹{calculatePrice(porter, bookingDetails.serviceType, bookingDetails.luggageCount)}
                        </span>
                        <span className="availability">{porter.availability}</span>
                      </div>
                    </div>

                    <div className="porter-details">
                      <div className="languages">
                        <strong>Languages:</strong> {porter.languages.join(', ')}
                      </div>
                      <div className="specialties">
                        <strong>Specialties:</strong>
                        <div className="specialty-tags">
                          {porter.specialties.map(specialty => (
                            <span key={specialty} className="specialty-tag">{specialty}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedPorter?.id === porter.id && (
                      <div className="selected-indicator">
                        <span>✅ Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedPorter && (
              <div className="booking-summary">
                <h3>📋 Booking Summary</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span>Porter:</span>
                    <span>{selectedPorter.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Station:</span>
                    <span>{selectedStation}</span>
                  </div>
                  <div className="summary-item">
                    <span>Service:</span>
                    <span>{serviceTypes.find(s => s.id === bookingDetails.serviceType)?.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Luggage:</span>
                    <span>{bookingDetails.luggageCount} items</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{calculatePrice(selectedPorter, bookingDetails.serviceType, bookingDetails.luggageCount)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleBookingSubmit}
                  className="book-porter-btn"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Porter Service'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="service-info">
          <div className="info-card">
            <h3>ℹ️ How Porter Service Works</h3>
            <div className="info-steps">
              <div className="step">
                <span className="step-number">1</span>
                <p>Select your station and service type</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Choose from available porters</p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Porter will contact you and assist with luggage</p>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <p>Pay the porter directly after service</p>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>💡 Service Features</h3>
            <div className="features-list">
              <div className="feature">
                <span>✅</span>
                <span>Verified and experienced porters</span>
              </div>
              <div className="feature">
                <span>✅</span>
                <span>Fixed transparent pricing</span>
              </div>
              <div className="feature">
                <span>✅</span>
                <span>Real-time porter tracking</span>
              </div>
              <div className="feature">
                <span>✅</span>
                <span>24/7 customer support</span>
              </div>
              <div className="feature">
                <span>✅</span>
                <span>Insurance coverage for luggage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PorterServicePage;