import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingTrain from "../components/common/LoadingTrain";
import "./BookTicketPage.css";

const BookTicketPage = () => {
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });
  const [stations, setStations] = useState([
    { code: "NDLS", name: "New Delhi" },
    { code: "CSMT", name: "Mumbai CST" },
    { code: "HWH", name: "Howrah Junction" },
    { code: "MAS", name: "Chennai Central" },
    { code: "SBC", name: "Bangalore City" },
    { code: "SC", name: "Secunderabad" },
    { code: "PUNE", name: "Pune Junction" },
    { code: "ADI", name: "Ahmedabad" },
    { code: "LKO", name: "Lucknow" },
    { code: "JP", name: "Jaipur" },
    { code: "BPL", name: "Bhopal" },
    { code: "INDB", name: "Indore" },
    { code: "GWL", name: "Gwalior" },
    { code: "AGC", name: "Agra Cantt" },
    { code: "CNB", name: "Kanpur Central" },
  ]);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Load stations on component mount
  useEffect(() => {
    loadStations();
  }, []);

  // Debug: Log stations when they change
  useEffect(() => {
    console.log("Stations state updated:", stations);
    console.log("Number of stations:", stations.length);
  }, [stations]);

  const loadStations = async () => {
    try {
      const response = await axios.get("/trains/stations");
      console.log("Stations loaded from API:", response.data.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        setStations(response.data.data);
        toast.success("Stations loaded from server");
      }
    } catch (error) {
      console.error("Error loading stations:", error);
      // Keep the default mock stations that are already set
      console.log("Using default mock stations");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      toast.error("Please fill all required fields");
      return;
    }

    if (searchForm.from === searchForm.to) {
      toast.error("From and To stations cannot be the same");
      return;
    }

    setLoading(true);
    try {
      console.log("Searching trains with params:", {
        from: searchForm.from,
        to: searchForm.to,
        date: searchForm.date,
      });

      const response = await axios.get("/trains/search", {
        params: {
          from: searchForm.from,
          to: searchForm.to,
          date: searchForm.date,
        },
      });

      console.log("Search response:", response.data);
      setTrains(response.data.data.trains);
      setSearchPerformed(true);

      if (response.data.data.trains.length === 0) {
        toast.info(
          "No trains found for the selected route and date. Try NDLS to CSMT or NDLS to HWH."
        );
      } else {
        toast.success(`Found ${response.data.data.trains.length} trains`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(
        `Failed to search trains: ${
          error.response?.data?.message || error.message
        }`
      );
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainSelect = (train) => {
    // Only set selectedTrain, do NOT redirect to payment here
    setSelectedTrain(train);
    toast.success(
      `Selected ${train.trainName} - ${train.selectedClass.name} class`
    );
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time;
  };

  const formatDuration = (duration) => {
    if (typeof duration === "string") return duration;
    return `${duration.hours}h ${duration.minutes}m`;
  };

  const getClassColor = (classType) => {
    const colors = {
      "1A": "#8b5cf6",
      "2A": "#3b82f6",
      "3A": "#10b981",
      CC: "#f59e0b",
      SL: "#ef4444",
      "2S": "#6b7280",
      GEN: "#374151",
    };
    return colors[classType] || "#6b7280";
  };

  if (loading) {
    return <LoadingTrain message="Searching trains..." fullScreen />;
  }

  return (
    <div className="book-ticket-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-badge">
            <span className="badge-text">Smart Booking Platform</span>
          </div>
          <h1>Enterprise Railway Booking</h1>
          <p>
            Advanced search algorithms and real-time availability for seamless
            travel planning
          </p>
        </div>

        <div className="booking-content">
          <div className="booking-form-section">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h2>Intelligent Train Search</h2>
              </div>

              <form onSubmit={handleSearch} className="search-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="10"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                      </svg>
                      Departure Station
                    </label>
                    <select
                      name="from"
                      value={searchForm.from}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">
                        Select departure station ({stations.length} available)
                      </option>
                      {stations.map((station, index) => {
                        console.log(`Rendering station ${index}:`, station);
                        return (
                          <option key={station.code} value={station.code}>
                            {station.name} ({station.code})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="10"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                      </svg>
                      Destination Station
                    </label>
                    <select
                      name="to"
                      value={searchForm.to}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">
                        Select destination station ({stations.length} available)
                      </option>
                      {stations.map((station, index) => (
                        <option key={station.code} value={station.code}>
                          {station.name} ({station.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Travel Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={searchForm.date}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Passenger Count
                    </label>
                    <select
                      name="passengers"
                      value={searchForm.passengers}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Passenger{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full search-btn"
                  disabled={loading}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  {loading ? "Processing Search..." : "Search Available Trains"}
                </button>
              </form>
            </div>

            {/* Search Results */}
            {searchPerformed && (
              <div className="search-results">
                <h3>Search Results</h3>
                {trains.length === 0 ? (
                  <div className="no-results">
                    <p>No trains found for your search criteria.</p>
                    <p>Try different stations or dates.</p>
                  </div>
                ) : (
                  <div className="trains-list">
                    {trains.map((train) => (
                      <div key={train._id} className="train-card">
                        <div className="train-header">
                          <div className="train-info">
                            <h4>{train.trainName}</h4>
                            <span className="train-number">
                              #{train.trainNumber}
                            </span>
                            <span className="train-type">
                              {train.trainType}
                            </span>
                          </div>
                          <div className="train-timing">
                            <div className="time-info">
                              <span className="time">
                                {formatTime(
                                  train.journeyDetails?.from?.departureTime
                                )}
                              </span>
                              <span className="station">
                                {train.journeyDetails?.from?.stationName}
                              </span>
                            </div>
                            <div className="duration">
                              <span>{train.journeyDetails?.duration}</span>
                              <div className="route-line"></div>
                            </div>
                            <div className="time-info">
                              <span className="time">
                                {formatTime(
                                  train.journeyDetails?.to?.arrivalTime
                                )}
                              </span>
                              <span className="station">
                                {train.journeyDetails?.to?.stationName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="train-classes">
                          {train.classes
                            .filter((cls) => cls.available)
                            .map((cls) => (
                              <div key={cls.type} className="class-option">
                                <div className="class-info">
                                  <span
                                    className="class-name"
                                    style={{ color: getClassColor(cls.type) }}
                                  >
                                    {cls.name}
                                  </span>
                                  <span className="seats-available">
                                    {cls.availableSeats} seats
                                  </span>
                                </div>
                                <div className="class-price">
                                  <span className="price">₹{cls.price}</span>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Only set selectedTrain, do NOT redirect here
                                      handleTrainSelect({
                                        ...train,
                                        selectedClass: cls,
                                      });
                                    }}
                                    disabled={loading}
                                  >
                                    {loading ? "Booking..." : "Book Now"}
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>

                        {train.amenities && (
                          <div className="train-amenities">
                            <span>Amenities: </span>
                            {train.pantryAvailable && (
                              <span className="amenity">🍽️ Pantry</span>
                            )}
                            {train.wifiAvailable && (
                              <span className="amenity">📶 WiFi</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Simple Booking Confirmation Modal */}
            {selectedTrain && (
              <div
                className="booking-modal-overlay"
                onClick={() => setSelectedTrain(null)}
              >
                <div
                  className="booking-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h3>Confirm Booking</h3>
                    <button
                      onClick={() => setSelectedTrain(null)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  <div className="modal-content">
                    <p>
                      <strong>Train:</strong> {selectedTrain.trainName}
                    </p>
                    <p>
                      <strong>Class:</strong>{" "}
                      {selectedTrain.selectedClass?.name}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹
                      {selectedTrain.selectedClass?.price}
                    </p>
                    <p>
                      <strong>Passengers:</strong> {searchForm.passengers}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹
                      {selectedTrain.selectedClass?.price *
                        searchForm.passengers}
                    </p>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedTrain(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const params = new URLSearchParams({
                          trainName: selectedTrain.trainName,
                          trainNumber: selectedTrain.trainNumber,
                          class: selectedTrain.selectedClass.name,
                          from: searchForm.from,
                          to: searchForm.to,
                          date: searchForm.date,
                          passengers: searchForm.passengers,
                          amount:
                            selectedTrain.selectedClass.price *
                            searchForm.passengers,
                        }).toString();
                        window.location.href = `/payment?${params}`;
                      }}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="features-sidebar">
            <div className="feature-highlight">
              <div className="feature-icon-small">
                <svg
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
              </div>
              <h3>AI Voice Assistant</h3>
              <p>
                Advanced natural language processing with multi-language support
                for hands-free booking
              </p>
            </div>

            <div className="feature-highlight">
              <div className="feature-icon-small">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="3,11 22,2 13,21 11,13 3,11" />
                </svg>
              </div>
              <h3>Smart Navigation</h3>
              <p>
                Precision indoor positioning with augmented reality guidance to
                your exact seat location
              </p>
            </div>

            <div className="feature-highlight">
              <div className="feature-icon-small">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10c-.4-.8-1.2-1.3-2.1-1.3H7.7c-.9 0-1.7.5-2.1 1.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <h3>Integrated Mobility</h3>
              <p>
                Comprehensive transportation ecosystem with real-time
                coordination and unified booking
              </p>
            </div>

            <div className="popular-routes">
              <h3>Popular Routes</h3>
              <div className="route-list">
                <div
                  className="route-item"
                  onClick={() =>
                    setSearchForm({ ...searchForm, from: "NDLS", to: "CSMT" })
                  }
                >
                  <span>Delhi → Mumbai</span>
                  <span className="route-price">From ₹450</span>
                </div>
                <div
                  className="route-item"
                  onClick={() =>
                    setSearchForm({ ...searchForm, from: "NDLS", to: "HWH" })
                  }
                >
                  <span>Delhi → Kolkata</span>
                  <span className="route-price">From ₹520</span>
                </div>
                <div
                  className="route-item"
                  onClick={() =>
                    setSearchForm({ ...searchForm, from: "NDLS", to: "LKO" })
                  }
                >
                  <span>Delhi → Lucknow</span>
                  <span className="route-price">From ₹280</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicketPage;
