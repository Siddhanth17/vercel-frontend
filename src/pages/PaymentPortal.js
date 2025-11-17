import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { BookingContext } from '../contexts/BookingContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingTrain from '../components/common/LoadingTrain';
import './PaymentPortal.css';

const PaymentPortal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addTrainBooking } = useContext(BookingContext);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [booking, setBooking] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) {
      return;
    }

    // Check if we have basic payment parameters
    if (!amount) {
      toast.error('Invalid payment request - missing amount');
      navigate('/book-ticket');
      return;
    }

    // If user is not logged in after loading is complete, redirect to login
    if (!user) {
      toast.info('Please login to continue with booking');
      // Store the current URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      navigate('/login');
      return;
    }

    // If we have bookingId, load booking details
    if (bookingId) {
      loadBookingDetails();
    } else {
      // Create a mock booking from URL parameters for demo
      const mockBooking = {
        trainName: searchParams.get('trainName') || 'Selected Train',
        trainNumber: searchParams.get('trainNumber') || 'TRAIN001',
        from: { stationName: searchParams.get('from') || 'Origin' },
        to: { stationName: searchParams.get('to') || 'Destination' },
        journeyDate: searchParams.get('date') || new Date().toISOString(),
        class: { name: searchParams.get('class') || 'General' },
        passengers: [{ name: 'Passenger 1' }],
        pnr: 'DEMO' + Date.now(),
        totalPrice: parseInt(amount) || 100
      };
      setBooking(mockBooking);
    }
  }, [bookingId, amount, user, authLoading, navigate, searchParams]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load booking details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Limit CVV to 4 digits
    if (name === 'cvv' && value.length > 4) return;

    // Limit expiry month to 2 digits
    if (name === 'expiryMonth' && (value.length > 2 || parseInt(value) > 12)) return;

    // Limit expiry year to 4 digits
    if (name === 'expiryYear' && value.length > 4) return;

    setCardForm(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/payment/initiate', {
        bookingId,
        paymentMethod
      });
      
      setPaymentId(response.data.data.paymentId);
      return response.data.data;
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();

    // Validate card form
    if (!cardForm.cardNumber || !cardForm.expiryMonth || !cardForm.expiryYear || 
        !cardForm.cvv || !cardForm.cardholderName) {
      toast.error('Please fill all card details');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate payment processing for demo
      toast.loading('Processing payment...', { duration: 2000 });
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success (90% success rate)
      const paymentSuccess = Math.random() > 0.1;
      
      if (paymentSuccess) {
        // Add train booking to context
        addTrainBooking({
          trainName: booking.trainName,
          trainNumber: booking.trainNumber,
          from: booking.from.stationName,
          to: booking.to.stationName,
          journeyDate: booking.journeyDate,
          class: booking.class.name,
          passengers: booking.passengers.length,
          pnr: booking.pnr,
          totalPrice: parseInt(amount),
          status: 'Confirmed',
          paymentMethod: 'Credit Card'
        });
        
        toast.success('Payment successful! 🎉');
        
        // Redirect to success page
        setTimeout(() => {
          navigate(`/booking-success?pnr=${booking.pnr}&amount=${amount}`);
        }, 1500);
      } else {
        toast.error('Payment failed. Please try again.');
      }

    } catch (error) {
      console.error('Card payment error:', error);
      const message = error.response?.data?.message || 'Payment failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    setShowUPIModal(true);
  };

  const closeUPIModal = () => {
    setShowUPIModal(false);
  };

  // Show loading while auth is loading or while loading payment details
  if (authLoading || (loading && !booking)) {
    return <LoadingTrain message="Loading payment details..." fullScreen />;
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="payment-portal">
      <div className="page-container">
        <div className="page-header">
          <h1>💳 Payment Portal</h1>
          <p>Secure payment processing for your train booking</p>
        </div>
        
        <div className="payment-content">
          <div className="payment-form-section">
            <div className="form-card">
              <h2>Choose Payment Method</h2>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span className="method-icon">💳</span>
                  <span>Credit/Debit Card</span>
                  <span className="method-status">Available</span>
                </div>
                
                <div 
                  className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <span className="method-icon">📱</span>
                  <span>UPI Payment</span>
                  <span className="method-status under-development">Under Development</span>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleCardPayment} className="card-form">
                  <h3>💳 Card Details</h3>
                  
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardForm.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={cardForm.cardholderName}
                      onChange={handleCardInputChange}
                      placeholder="Name as on card"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Month</label>
                      <input
                        type="number"
                        name="expiryMonth"
                        value={cardForm.expiryMonth}
                        onChange={handleCardInputChange}
                        placeholder="MM"
                        min="1"
                        max="12"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Expiry Year</label>
                      <input
                        type="number"
                        name="expiryYear"
                        value={cardForm.expiryYear}
                        onChange={handleCardInputChange}
                        placeholder="YYYY"
                        min={new Date().getFullYear()}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full payment-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay ₹${amount}`}
                  </button>
                </form>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-section">
                  <h3>📱 UPI Payment</h3>
                  <p>Pay using your UPI ID or scan QR code</p>
                  
                  <button 
                    onClick={handleUPIPayment}
                    className="btn btn-primary btn-full payment-btn"
                  >
                    Pay with UPI - ₹{amount}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="payment-sidebar">
            <div className="booking-summary">
              <h3>📋 Booking Summary</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <span>Train:</span>
                  <span>{booking.trainName} ({booking.trainNumber})</span>
                </div>
                <div className="summary-item">
                  <span>Route:</span>
                  <span>{booking.from.stationName} → {booking.to.stationName}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{new Date(booking.journeyDate).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span>Class:</span>
                  <span>{booking.class.name}</span>
                </div>
                <div className="summary-item">
                  <span>Passengers:</span>
                  <span>{booking.passengers.length}</span>
                </div>
                <div className="summary-item">
                  <span>PNR:</span>
                  <span className="pnr">{booking.pnr}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>₹{booking.totalPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="security-info">
              <h3>🔒 Secure Payment</h3>
              <p>Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.</p>
              <div className="security-features">
                <div className="security-item">
                  <span>🛡️</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="security-item">
                  <span>🔐</span>
                  <span>PCI Compliant</span>
                </div>
                <div className="security-item">
                  <span>✅</span>
                  <span>Verified Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Modal */}
      {showUPIModal && (
        <div className="modal-overlay" onClick={closeUPIModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚧 Feature Under Development</h3>
              <button className="modal-close" onClick={closeUPIModal}>×</button>
            </div>
            <div className="modal-body">
              <p>UPI payment feature is currently under development.</p>
              <p>Please use Credit/Debit Card payment for now.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeUPIModal}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <LoadingTrain message="Processing your payment..." fullScreen />
      )}
    </div>
  );
};

export default PaymentPortal;