import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Context Providers
import AuthProvider from './contexts/AuthContext';
import BookingProvider from './contexts/BookingContext';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import BookTicketPage from './pages/BookTicketPage';
import PaymentPortal from './pages/PaymentPortal';
import UserDashboard from './pages/UserDashboard';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Feature Pages
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import BookingSuccess from './pages/BookingSuccess';
import CabBookingPage from './pages/CabBookingPage';
import FoodOrderingPage from './pages/FoodOrderingPage';
import PorterServicePage from './pages/PorterServicePage';
import SeatFinderPage from './pages/SeatFinderPage';

// Styles
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/book-ticket" element={<BookTicketPage />} />
                <Route path="/payment" element={<PaymentPortal />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/cab-booking" element={<CabBookingPage />} />
                <Route path="/food-ordering" element={<FoodOrderingPage />} />
                <Route path="/porter-service" element={<PorterServicePage />} />
                <Route path="/seat-finder" element={<SeatFinderPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;