import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './SeatFinderPage.css';

const SeatFinderPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    pnr: '',
    trainNumber: '',
    station: ''
  });
  const [seatInfo, setSeatInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const stations = [
    'New Delhi Railway Station',
    'Mumbai Central',
    'Bangalore City Junction',
    'Chennai Central',
    'Kolkata Howrah',
    'Hyderabad Deccan'
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to use seat finder');
      navigate('/login');
      return;
    }

    if (!searchData.pnr && !searchData.trainNumber) {
      toast.error('Please enter PNR or Train Number');
      return;
    }

    if (!searchData.station) {
      toast.error('Please select a station');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock seat information
      setSeatInfo({
        coach: 'B1',
        seatNumber: '25, 26',
        platform: '12',
        coachPosition: '7th coach from engine',
        directions: [
          'Enter from Platform 12 main entrance',
          'Walk towards the engine direction for 200 meters',
          'Look for Coach B1 (7th coach from engine)',
          'Your seats 25, 26 are in the middle section of the coach',
          'Seats are on the right side (window seats)'
        ],
        amenities: ['Charging Point', 'Reading Light', 'AC Vent'],
        estimatedWalkTime: '3-4 minutes'
      });
      
      toast.success('Seat location found! 🎯');
    } catch (error) {
      toast.error('Failed to find seat information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seat-finder-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🗺️ Seat Finder</h1>
          <p>Get turn-by-turn navigation to your exact seat at the station</p>
        </div>

        <div className="finder-content">
          <div className="search-section">
            <div className="search-card">
              <h2>🔍 Find Your Seat</h2>
              
              <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                  <label>📋 PNR Number</label>
                  <input
                    type="text"
                    value={searchData.pnr}
                    onChange={(e) => setSearchData({...searchData, pnr: e.target.value})}
                    placeholder="Enter your PNR number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>🚂 Train Number (Alternative)</label>
                  <input
                    type="text"
                    value={searchData.trainNumber}
                    onChange={(e) => setSearchData({...searchData, trainNumber: e.target.value})}
                    placeholder="Enter train number if no PNR"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>🚉 Station</label>
                  <select 
                    value={searchData.station} 
                    onChange={(e) => setSearchData({...searchData, station: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Select your station</option>
                    {stations.map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Finding Seat...' : 'Find My Seat'}
                </button>
              </form>
            </div>
          </div>

          {seatInfo && (
            <div className="seat-info-section">
              <div className="seat-info-card">
                <h2>🎯 Your Seat Location</h2>
                
                <div className="seat-details">
                  <div className="detail-item">
                    <span className="detail-icon">🚂</span>
                    <div>
                      <strong>Coach:</strong> {seatInfo.coach}
                      <p>{seatInfo.coachPosition}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">💺</span>
                    <div>
                      <strong>Seat Numbers:</strong> {seatInfo.seatNumber}
                      <p>Window seats on the right side</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🚉</span>
                    <div>
                      <strong>Platform:</strong> {seatInfo.platform}
                      <p>Estimated walk time: {seatInfo.estimatedWalkTime}</p>
                    </div>
                  </div>
                </div>

                <div className="directions-section">
                  <h3>🧭 Step-by-Step Directions</h3>
                  <div className="directions-list">
                    {seatInfo.directions.map((direction, index) => (
                      <div key={index} className="direction-step">
                        <span className="step-number">{index + 1}</span>
                        <p>{direction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="amenities-section">
                  <h3>✨ Seat Amenities</h3>
                  <div className="amenities-list">
                    {seatInfo.amenities.map(amenity => (
                      <span key={amenity} className="amenity-tag">
                        ✅ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="features-section">
          <h3>🌟 Seat Finder Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h4>Precise Location</h4>
              <p>Get exact coach and seat position with platform details</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🧭</span>
              <h4>Turn-by-Turn Navigation</h4>
              <p>Step-by-step directions from platform entrance to your seat</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">⏱️</span>
              <h4>Time Estimation</h4>
              <p>Know how long it takes to reach your seat</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h4>Mobile Friendly</h4>
              <p>Access directions on your phone while walking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatFinderPage;