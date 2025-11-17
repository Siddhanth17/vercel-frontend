import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Home.css";

const TRAIN_IMAGE_URL =
  "https://media.istockphoto.com/id/1485287542/photo/vande-bharat-express-heading-towards-thiruvandapuram-kerala-india.jpg?s=2048x2048&w=is&k=20&c=wjcWq_CiK2rGiMlPukYWucvZ6C81E-WOJhl-e9dL5BM=";

const Home = () => {
  const { user } = useContext(AuthContext);

  const getFeatureIcon = (iconName) => {
    const icons = {
      mic: (
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
      ),
      navigation: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="3,11 22,2 13,21 11,13 3,11" />
        </svg>
      ),
      car: (
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
      ),
      users: (
        <svg
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
      ),
      utensils: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
        </svg>
      ),
      award: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
        </svg>
      ),
    };
    return icons[iconName] || icons.mic;
  };

  const features = [
    {
      icon: "mic",
      title: "AI Voice Assistant",
      description:
        "Enterprise-grade voice recognition with multi-language support and natural language processing for seamless booking experiences.",
      link: "/voice-assistant",
      badge: "AI Powered",
    },
    {
      icon: "navigation",
      title: "Smart Navigation",
      description:
        "Real-time indoor positioning system with precision mapping and augmented reality guidance to your exact seat.",
      link: "/seat-finder",
      badge: "AR Ready",
    },
    {
      icon: "car",
      title: "Integrated Mobility",
      description:
        "End-to-end transportation ecosystem with dynamic pricing, real-time tracking, and multi-modal journey planning.",
      link: "/cab-booking",
      badge: "Connected",
    },
    {
      icon: "users",
      title: "Verified Services",
      description:
        "Government-certified porter network with blockchain-verified credentials and transparent pricing algorithms.",
      link: "/porter-service",
      badge: "Verified",
    },
    {
      icon: "utensils",
      title: "Culinary Platform",
      description:
        "Curated marketplace for premium dining with quality assurance, nutritional tracking, and startup vendor partnerships.",
      link: "/food-ordering",
      badge: "Premium",
    },
    {
      icon: "award",
      title: "Rewards Ecosystem",
      description:
        "Gamified sustainability program with AI-powered cleanliness verification and cross-platform reward redemption.",
      link: "/dashboard",
      badge: "Sustainable",
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.7) 100%), url('${TRAIN_IMAGE_URL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content professional-hero-content">
          <h1 className="hero-title professional-title">
            Experience the Future of Travel
          </h1>
          <p className="hero-subtitle professional-subtitle">
            Seamless bookings, smart assistance, unforgettable journeys.
          </p>
          <div className="hero-buttons professional-buttons">
            <Link to="/book-ticket" className="btn btn-primary btn-large">
              Book Your Journey
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-large">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <div className="section-badge">Platform Capabilities</div>
            <h2>Enterprise Railway Solutions</h2>
            <p>
              Leveraging advanced AI, IoT, and blockchain technologies to
              revolutionize the railway transportation industry with scalable,
              secure, and intelligent solutions
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="feature-header">
                  <div className="feature-icon">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <div className="feature-badge">{feature.badge}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">
                  Explore Feature
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-number">10M+</div>
              <div className="stat-label">Active Users</div>
              <div className="stat-sublabel">Across 28 States</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <path d="M12 7v4"/>
                  <line x1="8" y1="21" x2="8" y2="17"/>
                  <line x1="16" y1="21" x2="16" y2="17"/>
                </svg>
              </div>
              <div className="stat-number">50K+</div>
              <div className="stat-label">Daily Transactions</div>
              <div className="stat-sublabel">Real-time Processing</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="6" y2="12"/>
                  <line x1="18" y1="12" x2="22" y2="12"/>
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <line x1="12" y1="18" x2="12" y2="22"/>
                </svg>
              </div>
              <div className="stat-number">15+</div>
              <div className="stat-label">Languages</div>
              <div className="stat-sublabel">AI Voice Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
                </svg>
              </div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">System Uptime</div>
              <div className="stat-sublabel">Enterprise SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-container">
          <div className="section-header">
            <div className="section-badge">Process Overview</div>
            <h2>Streamlined Journey Planning</h2>
            <p>
              Our intelligent platform simplifies complex travel logistics
              through automated processes and smart integrations
            </p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Intelligent Discovery</h3>
                <p>
                  Advanced AI algorithms analyze your preferences and travel
                  patterns to suggest optimal routes, timing, and services
                </p>
                <div className="step-features">
                  <span>Voice Recognition</span>
                  <span>Smart Filters</span>
                  <span>Price Optimization</span>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Unified Booking</h3>
                <p>
                  Seamlessly integrate multiple services including
                  transportation, accommodation, and dining through a single
                  transaction
                </p>
                <div className="step-features">
                  <span>Multi-Service</span>
                  <span>Real-time Sync</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Smart Navigation</h3>
                <p>
                  Precision indoor positioning and augmented reality guidance
                  ensure effortless navigation to your exact destination
                </p>
                <div className="step-features">
                  <span>AR Navigation</span>
                  <span>Live Updates</span>
                  <span>Service Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Experience Next-Generation Railway Travel?</h2>
            <p>
              Join the future of transportation with our enterprise-grade
              platform trusted by millions of users worldwide
            </p>
            <div className="cta-buttons">
              {user ? (
                <Link to="/book-ticket" className="btn btn-primary btn-large">
                  Book Your Next Journey
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Already a Member?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
