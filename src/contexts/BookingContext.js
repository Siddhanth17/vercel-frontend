import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const BookingContext = createContext();

// Helper functions for localStorage
const getStorageKey = (userId, type) => `railwayPro_${userId}_${type}`;

const saveToStorage = (userId, type, data) => {
  if (userId) {
    try {
      localStorage.setItem(getStorageKey(userId, type), JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

const loadFromStorage = (userId, type, defaultValue = []) => {
  if (!userId) return defaultValue;
  try {
    const stored = localStorage.getItem(getStorageKey(userId, type));
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const BookingProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [recentBookings, setRecentBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [upcomingJourneys, setUpcomingJourneys] = useState([]);
  const [dashboardVersion, setDashboardVersion] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Call this after any booking/cab/food/porter action
  const refreshDashboard = () => setDashboardVersion((v) => v + 1);

  // Add a new train booking
  const addTrainBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      type: "train",
      ...bookingData,
      createdAt: new Date().toISOString(),
      userId: user?.id,
    };

    const updatedBookings = [newBooking, ...recentBookings.slice(0, 9)]; // Keep last 10
    setRecentBookings(updatedBookings);
    saveToStorage(user?.id, 'recentBookings', updatedBookings);

    // If it's a future journey, add to upcoming journeys
    const journeyDate = new Date(bookingData.journeyDate);
    const today = new Date();
    if (journeyDate > today) {
      const updatedJourneys = [newBooking, ...upcomingJourneys].sort(
        (a, b) => new Date(a.journeyDate) - new Date(b.journeyDate)
      );
      setUpcomingJourneys(updatedJourneys);
      saveToStorage(user?.id, 'upcomingJourneys', updatedJourneys);
    }

    // Add payment record
    addPaymentRecord({
      description: `Train Booking - ${bookingData.from} to ${bookingData.to}`,
      amount: bookingData.totalPrice,
      type: "train",
      paymentMethod: bookingData.paymentMethod || "Credit Card",
    });
    refreshDashboard();
  };

  // Add a new payment record
  const addPaymentRecord = (paymentData) => {
    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
      transactionId: `TXN${Date.now()}`,
      ...paymentData,
      userId: user?.id,
    };

    const updatedPayments = [newPayment, ...paymentHistory.slice(0, 19)]; // Keep last 20
    setPaymentHistory(updatedPayments);
    saveToStorage(user?.id, 'paymentHistory', updatedPayments);
    refreshDashboard();
  };

  // Add cab booking
  const addCabBooking = (cabData) => {
    addPaymentRecord({
      description: `Cab Booking - ${cabData.provider} ${cabData.type}`,
      amount: cabData.price,
      type: "cab",
      paymentMethod: "Credit Card",
    });
    refreshDashboard();
  };

  // Add food order
  const addFoodOrder = (orderData) => {
    addPaymentRecord({
      description: `Food Order - ${orderData.items.length} items`,
      amount: orderData.totalAmount,
      type: "food",
      paymentMethod: "UPI",
    });
    refreshDashboard();
  };

  // Add porter service
  const addPorterService = (porterData) => {
    addPaymentRecord({
      description: `Porter Service - ${porterData.serviceType}`,
      amount: porterData.totalPrice,
      type: "porter",
      paymentMethod: "Cash",
    });
    refreshDashboard();
  };

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user && !isDataLoaded) {
      // Load existing data from localStorage
      const storedBookings = loadFromStorage(user.id, 'recentBookings', []);
      const storedPayments = loadFromStorage(user.id, 'paymentHistory', []);
      const storedJourneys = loadFromStorage(user.id, 'upcomingJourneys', []);

      // If no stored data, initialize with mock data
      if (storedBookings.length === 0 && storedPayments.length === 0) {
        const mockBookings = [
          {
            id: 1,
            type: "train",
            trainName: "Rajdhani Express",
            trainNumber: "12951",
            from: "New Delhi",
            to: "Mumbai Central",
            journeyDate: "2024-01-15",
            status: "Confirmed",
            pnr: "PNR1234567890",
            totalPrice: 1250,
            createdAt: "2024-01-10T10:00:00Z",
            userId: user.id,
          },
        ];

        const mockPayments = [
          {
            id: 1,
            date: "2024-01-15",
            description: "Train Booking - Delhi to Mumbai",
            amount: 1250,
            status: "Completed",
            paymentMethod: "Credit Card",
            transactionId: "TXN123456789",
            type: "train",
            userId: user.id,
          },
          {
            id: 2,
            date: "2024-01-10",
            description: "Food Order - Chicken Biryani",
            amount: 280,
            status: "Completed",
            paymentMethod: "UPI",
            transactionId: "TXN123456788",
            type: "food",
            userId: user.id,
          },
        ];

        const mockJourneys = [
          {
            id: 1,
            trainName: "Rajdhani Express",
            trainNumber: "12951",
            from: "New Delhi",
            to: "Mumbai Central",
            journeyDate: "2024-02-15",
            time: "16:55",
            class: "AC 2 Tier",
            pnr: "PNR1234567890",
            status: "Confirmed",
            seatNumber: "B1-25, 26",
            platform: "12",
            duration: "15h 50m",
            userId: user.id,
          },
        ];

        setRecentBookings(mockBookings);
        setPaymentHistory(mockPayments);
        setUpcomingJourneys(mockJourneys);
        
        // Save mock data to localStorage
        saveToStorage(user.id, 'recentBookings', mockBookings);
        saveToStorage(user.id, 'paymentHistory', mockPayments);
        saveToStorage(user.id, 'upcomingJourneys', mockJourneys);
      } else {
        // Load existing data
        setRecentBookings(storedBookings);
        setPaymentHistory(storedPayments);
        setUpcomingJourneys(storedJourneys);
      }
      
      setIsDataLoaded(true);
    } else if (!user) {
      // Clear data when user logs out
      setRecentBookings([]);
      setPaymentHistory([]);
      setUpcomingJourneys([]);
      setIsDataLoaded(false);
    }
  }, [user, isDataLoaded]);

  // Clear data when user logs out
  useEffect(() => {
    if (!user && isDataLoaded) {
      setRecentBookings([]);
      setPaymentHistory([]);
      setUpcomingJourneys([]);
      setIsDataLoaded(false);
    }
  }, [user, isDataLoaded]);

  // Clear all user data (for logout or data reset)
  const clearUserData = () => {
    if (user?.id) {
      try {
        localStorage.removeItem(getStorageKey(user.id, 'recentBookings'));
        localStorage.removeItem(getStorageKey(user.id, 'paymentHistory'));
        localStorage.removeItem(getStorageKey(user.id, 'upcomingJourneys'));
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
    setRecentBookings([]);
    setPaymentHistory([]);
    setUpcomingJourneys([]);
    setIsDataLoaded(false);
    refreshDashboard();
  };

  const value = {
    recentBookings,
    paymentHistory,
    upcomingJourneys,
    addTrainBooking,
    addPaymentRecord,
    addCabBooking,
    addFoodOrder,
    addPorterService,
    clearUserData,
    dashboardVersion,
    refreshDashboard,
    isDataLoaded,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export default BookingProvider;
