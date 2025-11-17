import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const pnr = searchParams.get('pnr') || 'DEMO' + Date.now();

  useEffect(() => {
    // Confetti or celebration animation could go here
    document.title = 'Booking Confirmed - Railway Booking';
  }, []);

  return (
    <div className="booking-success-page">
      <div className="success-container">
        <div className="success-animation">
          <div className="success-icon">🎉</div>
          <div className="train-celebration">🚂</div>
        </div>
        
        <div className="success-content">
          <h1>Booking Confirmed!</h1>
          <p>Your train ticket has been successfully booked.</p>
          
          <div className="booking-details">
            <div className="pnr-display">
              <span className="pnr-label">PNR Number:</span>
              <span className="pnr-number">{pnr}</span>
            </div>
            
            <div className="success-message">
              <p>✅ Payment processed successfully</p>
              <p>📧 Confirmation email sent</p>
              <p>📱 SMS notification sent</p>
            </div>
          </div>
          
          <div className="success-actions">
            <Link to="/dashboard" className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to="/book-ticket" className="btn btn-secondary">
              Book Another Ticket
            </Link>
          </div>
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>🎫 Save your PNR number for future reference</li>
              <li>🗺️ Use our Seat Finder for navigation at the station</li>
              <li>🍽️ Pre-order food for your journey</li>
              <li>🚗 Book a cab for pickup/drop service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;