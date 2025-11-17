import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BookingContext } from '../contexts/BookingContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingTrain from '../components/common/LoadingTrain';
import './FoodOrderingPage.css';

const FoodOrderingPage = () => {
  const { user } = useContext(AuthContext);
  const { addFoodOrder } = useContext(BookingContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [activeCategory, setActiveCategory] = useState('veg-main');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Function to get category-based icons
  const getCategoryIcon = (category) => {
    const icons = {
      'veg': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      ),
      'non-veg': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      ),
      'snack': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18l-9-9v18"/>
        </svg>
      ),
      'bread': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/>
          <path d="M8 12h8"/>
        </svg>
      ),
      'rice': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
          <circle cx="12" cy="5" r="2"/>
          <path d="M12 7v4"/>
        </svg>
      ),
      'dessert': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      'beverage': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12V7a1 1 0 0 1 1-1h4l2 2h4a1 1 0 0 1 1 1v3"/>
          <path d="M5 12l6 6 6-6"/>
        </svg>
      )
    };
    return icons[category] || icons['veg'];
  };

  const stations = [
    'New Delhi Railway Station',
    'Mumbai Central',
    'Bangalore City Junction',
    'Chennai Central',
    'Kolkata Howrah',
    'Hyderabad Deccan',
    'Pune Junction',
    'Ahmedabad Junction'
  ];

  const foodMenu = {
    'veg-main': {
      name: 'Vegetarian Main Course',
      items: [
        { id: 1, name: 'Dal Tadka', price: 120, description: 'Yellow lentils tempered with spices', category: 'veg' },
        { id: 2, name: 'Paneer Butter Masala', price: 180, description: 'Cottage cheese in rich tomato gravy', category: 'veg' },
        { id: 3, name: 'Chole Bhature', price: 150, description: 'Spicy chickpeas with fried bread', category: 'veg' },
        { id: 4, name: 'Rajma Rice', price: 140, description: 'Kidney beans curry with steamed rice', category: 'veg' },
        { id: 5, name: 'Aloo Gobi', price: 110, description: 'Potato and cauliflower curry', category: 'veg' },
        { id: 6, name: 'Palak Paneer', price: 170, description: 'Cottage cheese in spinach gravy', category: 'veg' },
        { id: 7, name: 'Veg Biryani', price: 200, description: 'Fragrant rice with mixed vegetables', category: 'veg' },
        { id: 8, name: 'Sambar Rice', price: 130, description: 'South Indian lentil curry with rice', category: 'veg' }
      ]
    },
    'non-veg-main': {
      name: 'Non-Vegetarian Main Course',
      items: [
        { id: 9, name: 'Butter Chicken', price: 250, description: 'Tender chicken in creamy tomato sauce', category: 'non-veg' },
        { id: 10, name: 'Chicken Biryani', price: 280, description: 'Aromatic rice with spiced chicken', category: 'non-veg' },
        { id: 11, name: 'Mutton Curry', price: 320, description: 'Slow-cooked goat meat curry', category: 'non-veg' },
        { id: 12, name: 'Fish Curry', price: 240, description: 'Fresh fish in coconut curry', category: 'non-veg' },
        { id: 13, name: 'Chicken Tikka Masala', price: 260, description: 'Grilled chicken in spiced gravy', category: 'non-veg' },
        { id: 14, name: 'Egg Curry', price: 160, description: 'Boiled eggs in onion tomato gravy', category: 'non-veg' },
        { id: 15, name: 'Prawn Masala', price: 300, description: 'Spicy prawns in thick gravy', category: 'non-veg' },
        { id: 16, name: 'Chicken Dum Biryani', price: 290, description: 'Hyderabadi style chicken biryani', category: 'non-veg' }
      ]
    },
    'snacks': {
      name: 'Snacks & Appetizers',
      items: [
        { id: 17, name: 'Samosa', price: 40, description: 'Crispy pastry with spiced potato filling', category: 'snack' },
        { id: 18, name: 'Pav Bhaji', price: 80, description: 'Spiced vegetable curry with bread rolls', category: 'snack' },
        { id: 19, name: 'Vada Pav', price: 50, description: 'Mumbai street food - spiced potato fritter in bun', category: 'snack' },
        { id: 20, name: 'Dosa', price: 90, description: 'South Indian crepe with coconut chutney', category: 'snack' },
        { id: 21, name: 'Idli Sambhar', price: 70, description: 'Steamed rice cakes with lentil curry', category: 'snack' },
        { id: 22, name: 'Pakora', price: 60, description: 'Mixed vegetable fritters', category: 'snack' },
        { id: 23, name: 'Chicken Tikka', price: 180, description: 'Grilled marinated chicken pieces', category: 'snack' },
        { id: 24, name: 'Paneer Tikka', price: 160, description: 'Grilled cottage cheese with spices', category: 'snack' }
      ]
    },
    'breads': {
      name: 'Indian Breads',
      items: [
        { id: 25, name: 'Butter Naan', price: 45, description: 'Soft leavened bread with butter', category: 'bread' },
        { id: 26, name: 'Garlic Naan', price: 50, description: 'Naan bread with garlic and herbs', category: 'bread' },
        { id: 27, name: 'Roti', price: 25, description: 'Whole wheat flatbread', category: 'bread' },
        { id: 28, name: 'Paratha', price: 35, description: 'Layered flatbread', category: 'bread' },
        { id: 29, name: 'Kulcha', price: 40, description: 'Stuffed leavened bread', category: 'bread' },
        { id: 30, name: 'Bhatura', price: 30, description: 'Deep-fried leavened bread', category: 'bread' }
      ]
    },
    'rice': {
      name: 'Rice & Pulao',
      items: [
        { id: 31, name: 'Jeera Rice', price: 80, description: 'Cumin flavored basmati rice', category: 'rice' },
        { id: 32, name: 'Veg Pulao', price: 120, description: 'Spiced rice with mixed vegetables', category: 'rice' },
        { id: 33, name: 'Plain Rice', price: 60, description: 'Steamed basmati rice', category: 'rice' },
        { id: 34, name: 'Lemon Rice', price: 90, description: 'South Indian tangy rice', category: 'rice' },
        { id: 35, name: 'Curd Rice', price: 70, description: 'Rice mixed with yogurt and spices', category: 'rice' }
      ]
    },
    'desserts': {
      name: 'Desserts & Sweets',
      items: [
        { id: 36, name: 'Gulab Jamun', price: 60, description: 'Sweet milk dumplings in syrup', category: 'dessert' },
        { id: 37, name: 'Rasgulla', price: 50, description: 'Spongy cottage cheese balls in syrup', category: 'dessert' },
        { id: 38, name: 'Kheer', price: 70, description: 'Rice pudding with nuts and cardamom', category: 'dessert' },
        { id: 39, name: 'Jalebi', price: 80, description: 'Crispy sweet spirals in sugar syrup', category: 'dessert' },
        { id: 40, name: 'Kulfi', price: 90, description: 'Traditional Indian ice cream', category: 'dessert' },
        { id: 41, name: 'Laddu', price: 40, description: 'Sweet gram flour balls', category: 'dessert' }
      ]
    },
    'beverages': {
      name: 'Beverages',
      items: [
        { id: 42, name: 'Masala Chai', price: 30, description: 'Spiced Indian tea', category: 'beverage' },
        { id: 43, name: 'Lassi', price: 60, description: 'Yogurt-based drink', category: 'beverage' },
        { id: 44, name: 'Fresh Lime Water', price: 40, description: 'Refreshing lime drink', category: 'beverage' },
        { id: 45, name: 'Buttermilk', price: 35, description: 'Spiced yogurt drink', category: 'beverage' },
        { id: 46, name: 'Filter Coffee', price: 40, description: 'South Indian style coffee', category: 'beverage' },
        { id: 47, name: 'Mango Juice', price: 70, description: 'Fresh mango juice', category: 'beverage' },
        { id: 48, name: 'Coconut Water', price: 50, description: 'Fresh tender coconut water', category: 'beverage' }
      ]
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrderSubmit = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (!selectedStation) {
      toast.error('Please select a delivery station');
      return;
    }

    if (cart.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    setLoading(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to booking context
      addFoodOrder({
        items: cart,
        totalAmount: getTotalPrice(),
        station: selectedStation
      });
      
      toast.success('Order placed successfully!');
      setCart([]);
      setShowCart(false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingTrain message="Placing your order..." fullScreen />;
  }

  return (
    <div className="food-ordering-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-badge">
            <span className="badge-text">Food Delivery Platform</span>
          </div>
          <h1>Professional Food Ordering</h1>
          <p>Premium Indian cuisine delivered directly to your train seat with quality assurance and real-time tracking</p>
        </div>

        <div className="station-selector">
          <label>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Select Delivery Station:
          </label>
          <select 
            value={selectedStation} 
            onChange={(e) => setSelectedStation(e.target.value)}
            className="station-select"
          >
            <option value="">Choose your station</option>
            {stations.map(station => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </div>

        <div className="food-content">
          <div className="menu-section">
            <div className="category-tabs">
              {Object.entries(foodMenu).map(([key, category]) => (
                <button
                  key={key}
                  className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="menu-items">
              <h2>{foodMenu[activeCategory].name}</h2>
              <div className="items-grid">
                {foodMenu[activeCategory].items.map(item => (
                  <div key={item.id} className="food-item">
                    <div className="item-image">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-footer">
                        <span className="price">₹{item.price}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="add-btn"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Your Cart ({cart.length})
              </h3>
              <button 
                onClick={() => setShowCart(!showCart)}
                className="toggle-cart"
              >
                {showCart ? 'Hide' : 'Show'}
              </button>
            </div>

            {(showCart || cart.length > 0) && (
              <div className="cart-content">
                {cart.length === 0 ? (
                  <p className="empty-cart">Your cart is empty</p>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-info">
                            <span className="item-emoji">
                              {getCategoryIcon(item.category)}
                            </span>
                            <div>
                              <h4>{item.name}</h4>
                              <span className="item-price">₹{item.price}</span>
                            </div>
                          </div>
                          <div className="quantity-controls">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="qty-btn"
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-total">
                      <div className="total-line">
                        <span>Total: ₹{getTotalPrice()}</span>
                      </div>
                      <button 
                        onClick={handleOrderSubmit}
                        className="order-btn"
                        disabled={!selectedStation || loading}
                      >
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodOrderingPage;