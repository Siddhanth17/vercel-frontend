import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Enhanced Railway Booking</h3>
            <p>
              Experience the future of railway travel with AI-powered booking, 
              voice assistance, and integrated services for a seamless journey.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/book-ticket">Book Ticket</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/voice-assistant">Voice Assistant</Link></li>
              <li><Link to="/seat-finder">Seat Finder</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link to="/cab-booking">Cab Booking</Link></li>
              <li><Link to="/porter-service">Porter Service</Link></li>
              <li><Link to="/food-ordering">Food Ordering</Link></li>
              <li><a href="#rewards">Cleanliness Rewards</a></li>
              <li><a href="#support">24/7 Support</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p>📞 1800-XXX-XXXX (Toll Free)</p>
              <p>📧 support@railwaybooking.com</p>
              <p>📍 Railway Bhawan, New Delhi</p>
              <p>🕒 24/7 Customer Support</p>
            </div>
            <div className="app-links">
              <h4>Download Our App</h4>
              <div className="app-buttons">
                <a href="#" className="app-button">📱 iOS App</a>
                <a href="#" className="app-button">🤖 Android App</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Enhanced Railway Booking Platform. All rights reserved.</p>
            <div className="footer-features">
              <span>🎤 Voice Booking</span>
              <span>🗺️ Seat Navigation</span>
              <span>🚗 Cab Integration</span>
              <span>🍽️ Food Delivery</span>
              <span>🏆 Rewards System</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;