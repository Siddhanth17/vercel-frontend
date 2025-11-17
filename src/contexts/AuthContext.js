import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://vercel-backend-psi-three.vercel.app/api';

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error.message);
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Backend server might not be running on port 5000');
    }
    return Promise.reject(error);
  }
);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on app start
  useEffect(() => {
    console.log('AuthContext useEffect - Token:', token ? 'exists' : 'none');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load user profile
  const loadUser = async () => {
    try {
      console.log('Loading user profile...');
      const response = await axios.get('/auth/profile');
      console.log('User loaded successfully:', response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('Load user error:', error);
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        console.log('Network/CORS error - Backend might not be running');
        toast.error('Unable to connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response?.status === 401) {
        console.log('Token invalid, logging out');
        logout();
      } else {
        console.log('Other error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', userData);
      const response = await axios.post('/auth/register', userData);
      
      console.log('Registration response:', response.data);
      const { token: newToken, user: newUser } = response.data.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success('Registration successful! Welcome aboard! 🚂');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed - Please check if backend is running';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', credentials);
      const response = await axios.post('/auth/login', credentials);
      
      console.log('Login response:', response.data);
      const { token: newToken, user: newUser } = response.data.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success(`Welcome back, ${newUser.name}! 🎉`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed - Please check if backend is running';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session if needed
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      
      // Clear all user-specific data from localStorage
      if (user?.id) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`railwayPro_${user.id}_`)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put('/auth/profile', profileData);
      
      setUser(response.data.data);
      toast.success('Profile updated successfully! ✅');
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await axios.put('/auth/change-password', passwordData);
      
      toast.success('Password changed successfully! 🔒');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/forgot-password', { email });
      
      toast.success('Password reset instructions sent to your email! 📧');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetToken, newPassword) => {
    try {
      setLoading(true);
      const response = await axios.put(`/auth/reset-password/${resetToken}`, {
        newPassword
      });
      
      const { token: newToken, user: newUser } = response.data.data;
      
      // Store token and login user
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success('Password reset successful! You are now logged in. 🎉');
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Get user statistics
  const getUserStats = async () => {
    try {
      const response = await axios.get('/auth/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load statistics';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getUserStats,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;