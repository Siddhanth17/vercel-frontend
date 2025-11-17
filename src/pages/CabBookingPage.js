import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BookingContext } from '../contexts/BookingContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingTrain from '../components/common/LoadingTrain';
import './CabBookingPage.css';

const CabBookingPage = () => {
  const { user } = useContext(AuthContext);
  const { addCabBooking } = useContext(BookingContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState('location'); // location, cabs, booking
  const [locationData, setLocationData] = useState({
    pickup: '',
    drop: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });
  const [selectedCab, setSelectedCab] = useState(null);

  const cabOptions = [
    {
      id: 'uber-mini',
      provider: 'Uber',
      type: 'Mini',
      emoji: '🚗',
      price: 120,
      eta: '3 mins',
      capacity: '4 seats',
      features: ['AC', 'Music']
    },
    {
      id: 'uber-go',
      provider: 'Uber',
      type: 'Go',
      emoji: '🚙',
      price: 150,
      eta: '5 mins',
      capacity: '4 seats',
      features: ['AC', 'Music', 'Premium']
    },
    {
      id: 'uber-xl',
      provider: 'Uber',
      type: 'XL',
      emoji: '🚐',
      price: 200,
      eta: '7 mins',
      capacity: '6 seats',
      features: ['AC', 'Music', 'Extra Space']
    },
    {
      id: 'ola-micro',
      provider: 'Ola',
      type: 'Micro',
      emoji: '🚗',
      price: 110,
      eta: '4 mins',
      capacity: '4 seats',
      features: ['AC']
    },
    {
      id: 'ola-mini',
      provider: 'Ola',
      type: 'Mini',
      emoji: '🚙',
      price: 140,
      eta: '6 mins',
      capacity: '4 seats',
      features: ['AC', 'Music']
    },
    {
      id: 'ola-prime',
      provider: 'Ola',
      type: 'Prime',
      emoji: '🚘',
      price: 180,
      eta: '8 mins',
      capacity: '4 seats',
      features: ['AC', 'Music', 'Premium', 'WiFi']
    }
  ];

  const bikeOptions = [
    {
      id: 'rapido-bike',
      provider: 'Rapido',
      type: 'Bike',
      emoji: '🏍️',
      price: 45,
      eta: '2 mins',
      capacity: '1 passenger',
      features: ['Helmet', 'Fast']
    },
    {
      id: 'rapido-auto',
      provider: 'Rapido',
      type: 'Auto',
      emoji: '🛺',
      price: 80,
      eta: '4 mins',
      capacity: '3 passengers',
      features: ['Covered', 'Affordable']
    }
  ];

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (!locationData.pickup || !locationData.drop) {
      toast.error('Please enter both pickup and drop locations');
      return;
    }
    if (locationData.pickup === locationData.drop) {
      toast.error('Pickup and drop locations cannot be the same');
      return;
    }
    setBookingStep('cabs');
  };

  const handleCabSelect = (cab) => {
    setSelectedCab(cab);
    setBookingStep('booking');
  };

  const handleBookCab = async () => {
    if (!user) {
      toast.error('Please login to book a cab');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to booking context
      addCabBooking({
        provider: selectedCab.provider,
        type: selectedCab.type,
        price: selectedCab.price,
        pickup: locationData.pickup,
        drop: locationData.drop,
        date: locationData.date,
        time: locationData.time
      });
      
      toast.success(`${selectedCab.provider} ${selectedCab.type} booked successfully! 🎉`);
      
      // Redirect to success page or dashboard
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
    return <LoadingTrain message="Booking your cab..." fullScreen />;
  }

  return (
    <div className="cab-booking-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🚗 Book a Cab</h1>
          <p>Quick and reliable cab booking for your journey</p>
        </div>

        {bookingStep === 'location' && (
          <div className="location-form-section">
            <div className="form-card">
              <h2>📍 Where are you going?</h2>
              
              <form onSubmit={handleLocationSubmit} className="location-form">
                <div className="form-group">
                  <label>🔵 Pickup Location</label>
                  <input
                    type="text"
                    value={locationData.pickup}
                    onChange={(e) => setLocationData({...locationData, pickup: e.target.value})}
                    placeholder="Enter pickup location"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🔴 Drop Location</label>
                  <input
                    type="text"
                    value={locationData.drop}
                    onChange={(e) => setLocationData({...locationData, drop: e.target.value})}
                    placeholder="Enter drop location"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>📅 Date</label>
                    <input
                      type="date"
                      value={locationData.date}
                      onChange={(e) => setLocationData({...locationData, date: e.target.value})}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>🕐 Time</label>
                    <input
                      type="time"
                      value={locationData.time}
                      onChange={(e) => setLocationData({...locationData, time: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Find Cabs
                </button>
              </form>
            </div>
          </div>
        )}

        {bookingStep === 'cabs' && (
          <div className="cabs-selection-section">
            <div className="trip-summary">
              <h3>🗺️ Trip Summary</h3>
              <p><strong>From:</strong> {locationData.pickup}</p>
              <p><strong>To:</strong> {locationData.drop}</p>
              <p><strong>When:</strong> {locationData.date} at {locationData.time}</p>
              <button 
                onClick={() => setBookingStep('location')} 
                className="btn btn-secondary btn-small"
              >
                Edit
              </button>
            </div>

            <div className="cabs-grid">
              <div className="cab-section">
                <h3>🚗 Cars</h3>
                <div className="cab-options">
                  {cabOptions.map(cab => (
                    <div key={cab.id} className="cab-card" onClick={() => handleCabSelect(cab)}>
                      <div className="cab-header">
                        <span className="cab-emoji">{cab.emoji}</span>
                        <div className="cab-info">
                          <h4>{cab.provider} {cab.type}</h4>
                          <p>{cab.capacity} • {cab.eta} away</p>
                        </div>
                        <div className="cab-price">
                          <span>₹{cab.price}</span>
                        </div>
                      </div>
                      <div className="cab-features">
                        {cab.features.map(feature => (
                          <span key={feature} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bike-section">
                <h3>🏍️ Bikes & Autos</h3>
                <div className="cab-options">
                  {bikeOptions.map(bike => (
                    <div key={bike.id} className="cab-card" onClick={() => handleCabSelect(bike)}>
                      <div className="cab-header">
                        <span className="cab-emoji">{bike.emoji}</span>
                        <div className="cab-info">
                          <h4>{bike.provider} {bike.type}</h4>
                          <p>{bike.capacity} • {bike.eta} away</p>
                        </div>
                        <div className="cab-price">
                          <span>₹{bike.price}</span>
                        </div>
                      </div>
                      <div className="cab-features">
                        {bike.features.map(feature => (
                          <span key={feature} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {bookingStep === 'booking' && selectedCab && (
          <div className="booking-confirmation-section">
            <div className="confirmation-card">
              <h2>🎯 Confirm Your Booking</h2>
              
              <div className="selected-cab">
                <div className="cab-details">
                  <span className="cab-emoji-large">{selectedCab.emoji}</span>
                  <div className="cab-info">
                    <h3>{selectedCab.provider} {selectedCab.type}</h3>
                    <p>{selectedCab.capacity} • Arriving in {selectedCab.eta}</p>
                  </div>
                  <div className="cab-price-large">
                    <span>₹{selectedCab.price}</span>
                  </div>
                </div>
              </div>

              <div className="trip-details">
                <div className="detail-item">
                  <span>🔵 Pickup:</span>
                  <span>{locationData.pickup}</span>
                </div>
                <div className="detail-item">
                  <span>🔴 Drop:</span>
                  <span>{locationData.drop}</span>
                </div>
                <div className="detail-item">
                  <span>📅 Date & Time:</span>
                  <span>{locationData.date} at {locationData.time}</span>
                </div>
                <div className="detail-item">
                  <span>💰 Total Fare:</span>
                  <span>₹{selectedCab.price}</span>
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  onClick={() => setBookingStep('cabs')} 
                  className="btn btn-secondary"
                >
                  Back to Options
                </button>
                <button 
                  onClick={handleBookCab} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CabBookingPage;