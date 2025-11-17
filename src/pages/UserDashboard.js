import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { BookingContext } from "../contexts/BookingContext";
import VoiceAssistant from "../components/features/VoiceAssistant";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingTrain from "../components/common/LoadingTrain";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user, getUserStats } = useContext(AuthContext);
  const { recentBookings, paymentHistory, upcomingJourneys, dashboardVersion, isDataLoaded } =
    useContext(BookingContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [rewardPoints, setRewardPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // Add dashboardVersion as dependency so dashboard reloads when it changes
  }, [user, dashboardVersion]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load reward points
      const rewardsResponse = await axios.get("/services/rewards/points");
      setRewardPoints(rewardsResponse.data.data);

      // Load user stats
      const statsResult = await getUserStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceBookingRequest = (prefilled) => {
    // Navigate to booking page with prefilled data
    const params = new URLSearchParams(prefilled).toString();
    window.location.href = `/book-ticket?${params}`;
  };

  const handleVoiceSearchRequest = (searchParams) => {
    // Navigate to booking page with search params
    const params = new URLSearchParams(searchParams).toString();
    window.location.href = `/book-ticket?${params}`;
  };

  if (loading || !isDataLoaded) {
    return <LoadingTrain message="Loading your dashboard..." fullScreen />;
  }

  if (!user) {
    return (
      <div className="user-dashboard">
        <div className="page-container">
          <div className="auth-required">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your dashboard.</p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="page-container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="welcome-badge">
              <span className="badge-text">Executive Dashboard</span>
            </div>
            <h1>Welcome back, {user.name}</h1>
            <p>
              Comprehensive railway management platform with advanced analytics
              and AI-powered insights
            </p>
          </div>
          <div className="quick-actions">
            <Link to="/book-ticket" className="btn btn-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
              </svg>
              New Booking
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <rect x="7" y="7" width="3" height="9" />
              <rect x="14" y="7" width="3" height="5" />
            </svg>
            Analytics Overview
          </button>
          <button
            className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
            </svg>
            Booking Management
          </button>
          <button
            className={`tab-button ${activeTab === "rewards" ? "active" : ""}`}
            onClick={() => setActiveTab("rewards")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Rewards Program
          </button>
          <button
            className={`tab-button ${activeTab === "voice" ? "active" : ""}`}
            onClick={() => setActiveTab("voice")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v4" />
              <path d="M8 23h8" />
            </svg>
            AI Assistant
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Account Profile
          </button>
          <button
            className={`tab-button ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Platform Services
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                      <circle cx="12" cy="5" r="2"/>
                      <path d="M12 7v4"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>
                      {recentBookings.filter((b) => b.type === "train").length}
                    </h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                      <circle cx="12" cy="5" r="2"/>
                      <path d="M12 7v4"/>
                      <line x1="8" y1="21" x2="8" y2="17"/>
                      <line x1="16" y1="21" x2="16" y2="17"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{upcomingJourneys.length}</h3>
                    <p>Upcoming Journeys</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{user.rewardPoints}</h3>
                    <p>Reward Points</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>
                      ₹
                      {paymentHistory.reduce(
                        (total, payment) => total + payment.amount,
                        0
                      )}
                    </h3>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                {recentBookings.length === 0 && paymentHistory.length === 0 ? (
                  <div className="empty-state">
                    <p>No activity yet. Start your journey!</p>
                    <Link to="/book-ticket" className="btn btn-primary">
                      Book Your First Ticket
                    </Link>
                  </div>
                ) : (
                  <div className="activity-list">
                    {/* Show recent train bookings */}
                    {recentBookings
                      .filter((b) => b.type === "train")
                      .slice(0, 2)
                      .map((booking) => (
                        <div
                          key={booking.pnr || booking.id}
                          className="activity-item booking-item"
                        >
                          <div className="activity-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                              <circle cx="12" cy="5" r="2"/>
                              <path d="M12 7v4"/>
                            </svg>
                          </div>
                          <div className="activity-info">
                            <h4>{booking.trainName}</h4>
                            <p>
                              {booking.from} → {booking.to}
                            </p>
                            <span className="activity-date">
                              {new Date(
                                booking.journeyDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="activity-status">
                            <span
                              className={`status ${booking.status.toLowerCase()}`}
                            >
                              {booking.status}
                            </span>
                            <span className="pnr">PNR: {booking.pnr}</span>
                          </div>
                        </div>
                      ))}

                    {/* Show recent payments */}
                    {paymentHistory.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="activity-item payment-item"
                      >
                        <div className="activity-icon">
                          {payment.type === "train" && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                              <circle cx="12" cy="5" r="2"/>
                              <path d="M12 7v4"/>
                            </svg>
                          )}
                          {payment.type === "food" && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                              <path d="M7 2v20"/>
                              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
                            </svg>
                          )}
                          {payment.type === "cab" && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-.8-1.2-1.3-2.1-1.3H7.7c-.9 0-1.7.5-2.1 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                              <circle cx="7" cy="17" r="2"/>
                              <path d="M9 17h6"/>
                              <circle cx="17" cy="17" r="2"/>
                            </svg>
                          )}
                          {payment.type === "porter" && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                          )}
                        </div>
                        <div className="activity-info">
                          <h4>{payment.description}</h4>
                          <p>{payment.paymentMethod}</p>
                          <span className="activity-date">
                            {new Date(payment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="activity-status">
                          <span className="amount">₹{payment.amount}</span>
                          <span
                            className={`status ${payment.status.toLowerCase()}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bookings-tab">
              <div className="tab-header">
                <h3>My Bookings</h3>
                <Link to="/book-ticket" className="btn btn-primary">
                  New Booking
                </Link>
              </div>

              {recentBookings.filter((b) => b.type === "train").length === 0 ? (
                <div className="empty-state">
                  <h4>No bookings found</h4>
                  <p>
                    You haven't made any bookings yet. Book your first ticket to
                    get started!
                  </p>
                  <Link to="/book-ticket" className="btn btn-primary">
                    Book Now
                  </Link>
                </div>
              ) : (
                <div className="bookings-grid">
                  {recentBookings
                    .filter((b) => b.type === "train")
                    .map((booking) => (
                      <div
                        key={booking.pnr || booking.id}
                        className="booking-card"
                      >
                        <div className="booking-header">
                          <h4>{booking.trainName}</h4>
                          <span
                            className={`status ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="booking-details">
                          <div className="route">
                            <span>{booking.from}</span>
                            <span className="arrow">→</span>
                            <span>{booking.to}</span>
                          </div>
                          <div className="journey-info">
                            <span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>{" "}
                              {new Date(
                                booking.journeyDate
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                                <circle cx="12" cy="5" r="2"/>
                                <path d="M12 7v4"/>
                              </svg> {booking.class}
                            </span>
                            <span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg> {booking.passengers} passengers
                            </span>
                          </div>
                          <div className="booking-footer">
                            <span className="pnr">PNR: {booking.pnr}</span>
                            <span className="amount">
                              ₹{booking.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="rewards-tab">
              <div className="rewards-header">
                <div className="points-display">
                  <h2>{user.rewardPoints}</h2>
                  <p>Reward Points</p>
                </div>
                <div className="tier-info">
                  <span className="tier-badge">
                    {rewardPoints?.tier || "Bronze"}
                  </span>
                  {rewardPoints?.nextTierAt && (
                    <p>
                      {rewardPoints.nextTierAt - user.rewardPoints} points to
                      next tier
                    </p>
                  )}
                </div>
              </div>

              <div className="rewards-section">
                <h3>How to Earn Points</h3>
                <div className="earning-methods">
                  <div className="method-item">
                    <span className="method-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18l-9-9v18"/>
                        <path d="M12 3v18"/>
                      </svg>
                    </span>
                    <div className="method-info">
                      <h4>Keep Seats Clean</h4>
                      <p>Earn 10-30 points for maintaining seat cleanliness</p>
                    </div>
                  </div>
                  <div className="method-item">
                    <span className="method-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                        <circle cx="12" cy="5" r="2"/>
                        <path d="M12 7v4"/>
                      </svg>
                    </span>
                    <div className="method-info">
                      <h4>Book Tickets</h4>
                      <p>Earn 5% of booking amount as reward points</p>
                    </div>
                  </div>
                  <div className="method-item">
                    <span className="method-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </span>
                    <div className="method-info">
                      <h4>Rate Services</h4>
                      <p>Earn bonus points for rating our services</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rewards-section">
                <h3>Redeem Points</h3>
                <div className="rewards-grid">
                  {rewardPoints?.redeemableRewards?.map((reward) => (
                    <div
                      key={reward.id}
                      className={`reward-card ${
                        reward.available ? "available" : "unavailable"
                      }`}
                    >
                      <h4>{reward.name}</h4>
                      <p>{reward.pointsRequired} points</p>
                      <button
                        className="btn btn-secondary"
                        disabled={!reward.available}
                      >
                        {reward.available ? "Redeem" : "Not Enough Points"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="voice-tab">
              <VoiceAssistant
                onBookingRequest={handleVoiceBookingRequest}
                onSearchRequest={handleVoiceSearchRequest}
              />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-tab">
              <div className="profile-sections">
                <div className="profile-info-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Personal Information
                  </h3>
                  <div className="profile-card">
                    <div className="profile-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="profile-details">
                      <h4>{user.name}</h4>
                      <p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {user.email}
                      </p>
                      <p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        {user.phone || "Not provided"}
                      </p>
                      <p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Member since{" "}
                        {new Date(
                          user.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {user.rewardPoints} Reward Points
                      </p>
                    </div>
                  </div>
                </div>

                <div className="upcoming-journeys-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                      <circle cx="12" cy="5" r="2"/>
                      <path d="M12 7v4"/>
                      <line x1="8" y1="21" x2="8" y2="17"/>
                      <line x1="16" y1="21" x2="16" y2="17"/>
                    </svg>
                    Upcoming Journeys
                  </h3>
                  {upcomingJourneys.length === 0 ? (
                    <div className="empty-state">
                      <p>No upcoming journeys</p>
                      <Link to="/book-ticket" className="btn btn-primary">
                        Book a Ticket
                      </Link>
                    </div>
                  ) : (
                    <div className="journeys-list">
                      {upcomingJourneys.map((journey) => (
                        <div key={journey.id} className="journey-card">
                          <div className="journey-header">
                            <h4>
                              {journey.trainName} ({journey.trainNumber})
                            </h4>
                            <span
                              className={`status ${journey.status.toLowerCase()}`}
                            >
                              {journey.status}
                            </span>
                          </div>
                          <div className="journey-route">
                            <div className="route-info">
                              <span className="station">{journey.from}</span>
                              <span className="arrow">→</span>
                              <span className="station">{journey.to}</span>
                            </div>
                            <div className="journey-time">
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                  <line x1="16" y1="2" x2="16" y2="6"/>
                                  <line x1="8" y1="2" x2="8" y2="6"/>
                                  <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                {journey.date}
                              </span>
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <polyline points="12,6 12,12 16,14"/>
                                </svg>
                                {journey.time}
                              </span>
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <polyline points="12,6 12,12 16,14"/>
                                </svg>
                                {journey.duration}
                              </span>
                            </div>
                          </div>
                          <div className="journey-details">
                            <div className="detail-row">
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                                  <circle cx="12" cy="5" r="2"/>
                                  <path d="M12 7v4"/>
                                </svg>
                                Class: {journey.class}
                              </span>
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M5 12V7a1 1 0 0 1 1-1h4l2 2h4a1 1 0 0 1 1 1v3"/>
                                  <path d="M5 12l6 6 6-6"/>
                                </svg>
                                Seat: {journey.seatNumber}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                  <line x1="8" y1="21" x2="16" y2="21"/>
                                  <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                                Platform: {journey.platform}
                              </span>
                              <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14,2 14,8 20,8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10,9 9,9 8,9"/>
                                </svg>
                                PNR: {journey.pnr}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="payment-history-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Payment History
                  </h3>
                  {paymentHistory.length === 0 ? (
                    <div className="empty-state">
                      <p>No payment history</p>
                    </div>
                  ) : (
                    <div className="payments-list">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="payment-card">
                          <div className="payment-icon">
                            {payment.type === "train" && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                                <circle cx="12" cy="5" r="2"/>
                                <path d="M12 7v4"/>
                              </svg>
                            )}
                            {payment.type === "food" && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                                <path d="M7 2v20"/>
                                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
                              </svg>
                            )}
                            {payment.type === "cab" && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-.8-1.2-1.3-2.1-1.3H7.7c-.9 0-1.7.5-2.1 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                                <circle cx="7" cy="17" r="2"/>
                                <path d="M9 17h6"/>
                                <circle cx="17" cy="17" r="2"/>
                              </svg>
                            )}
                            {payment.type === "porter" && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg>
                            )}
                          </div>
                          <div className="payment-info">
                            <h4>{payment.description}</h4>
                            <p>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                            <p>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                              </svg>
                              {payment.paymentMethod}
                            </p>
                            <p className="transaction-id">
                              ID: {payment.transactionId}
                            </p>
                          </div>
                          <div className="payment-amount">
                            <span className="amount">₹{payment.amount}</span>
                            <span
                              className={`status ${payment.status.toLowerCase()}`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="services-tab">
              <h3>Available Services</h3>
              <div className="services-grid">
                <Link to="/seat-finder" className="service-card">
                  <div className="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3,11 22,2 13,21 11,13 3,11"/>
                    </svg>
                  </div>
                  <h4>Seat Finder</h4>
                  <p>
                    Get turn-by-turn navigation to your exact seat at the
                    station
                  </p>
                  <span className="btn btn-primary">Use Seat Finder</span>
                </Link>

                <Link to="/cab-booking" className="service-card">
                  <div className="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-.8-1.2-1.3-2.1-1.3H7.7c-.9 0-1.7.5-2.1 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <path d="M9 17h6"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <h4>Cab Booking</h4>
                  <p>Book Uber, Ola cabs integrated with your train journey</p>
                  <span className="btn btn-primary">Book Cab</span>
                </Link>

                <Link to="/porter-service" className="service-card">
                  <div className="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h4>Porter Service</h4>
                  <p>Book verified government porters at fixed rates</p>
                  <span className="btn btn-primary">Book Porter</span>
                </Link>

                <Link to="/food-ordering" className="service-card">
                  <div className="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                      <path d="M7 2v20"/>
                      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
                    </svg>
                  </div>
                  <h4>Food Ordering</h4>
                  <p>Order food and snacks with veg/non-veg options</p>
                  <span className="btn btn-primary">Order Food</span>
                </Link>

                <div className="service-card">
                  <div className="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                      <path d="M12 3v18"/>
                    </svg>
                  </div>
                  <h4>Cleanliness Rewards</h4>
                  <p>Verify seat cleanliness and earn reward points</p>
                  <button className="btn btn-primary">
                    Verify Cleanliness
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
