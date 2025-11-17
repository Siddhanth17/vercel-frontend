import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingTrain from '../common/LoadingTrain';
import './AuthForms.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
    if (result.success) {
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  };

  if (loading) {
    return <LoadingTrain message="Logging you in..." fullScreen />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🚂</span>
              <h1>Welcome Back!</h1>
            </div>
            <p>Sign in to your railway booking account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span>🎤</span>
              <span>Voice Booking</span>
            </div>
            <div className="feature-item">
              <span>🗺️</span>
              <span>Seat Navigation</span>
            </div>
            <div className="feature-item">
              <span>🏆</span>
              <span>Reward Points</span>
            </div>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="train-scene">
            <div className="animated-train">🚂</div>
            <div className="train-track"></div>
            <div className="background-elements">
              <div className="cloud cloud-1">☁️</div>
              <div className="cloud cloud-2">☁️</div>
              <div className="mountain">🏔️</div>
            </div>
          </div>
          <div className="illustration-text">
            <h3>Your Journey Awaits!</h3>
            <p>Experience the future of railway travel with AI-powered booking and integrated services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;