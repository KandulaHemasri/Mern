import React, { useState, useEffect } from 'react';
import './App.css';

import food_01 from '../src/assests/food_01.png';
import food_02 from '../src/assests/food_02.png';
import food_03 from '../src/assests/food_03.png';
import food_04 from '../src/assests/food_04.png';
import food_05 from '../src/assests/food_05.png';
import food_06 from '../src/assests/food_06.png';
import food_07 from '../src/assests/food_07.png';
import food_08 from '../src/assests/food_08.png';
import food_09 from '../src/assests/food_09.png';
import food_10 from '../src/assests/food_10.png';
import food_11 from '../src/assests/food_11.png';
import food_12 from '../src/assests/food_12.png';


function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // Products state
  const [products, setProducts] = useState([]);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Load mock products
  useEffect(() => {
    // Mock products data
    const mockProducts = [
      { id: 1, name: 'Cup cake', price:20, image: food_01 },
      { id: 2, name: 'Roll', price: 30, image: food_02 },
      { id: 3, name: 'chicken patty', price: 25, image: food_03 },
      { id: 4, name: 'veg salad', price: 50, image: food_04},
      { id: 5, name: 'Ice-cream', price: 70, image: food_05 },
      { id: 6, name: 'Green-salad', price: 85, image: food_06 },
      { id: 7, name: 'Biryani', price: 150, image: food_07 },
      { id: 8, name: 'Pasta', price: 220, image: food_08 },
      { id: 9, name: 'pan cake', price: 120, image: food_09 },
      { id: 10, name: 'veg-sandwich', price: 95, image: food_10 },
      { id: 11, name: 'pastry', price: 110, image: food_11 },
      { id: 12, name: 'Red-sauce Pasta', price: 130, image: food_12 },
    ];
    
    setProducts(mockProducts);
    
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  
  // Authentication function
  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: email.split('@')[0], email });
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
    setShowAuth(false);
    resetAuthForm();
  };

  
  const handleSignup = (e) => {
    e.preventDefault();
    // Simple mock signup (in a real app, this would call an API)
    setUser({ name, email });
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify({ name, email }));
    setShowAuth(false);
    resetAuthForm();
  };
  
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };
  
  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };
  
  // Checkout functions
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed successfully!\n
      Shipping to: ${address}, ${city}, ${state} ${zipCode}\n
      Contact: ${phone}\n
      Total: $${getSubtotal().toFixed(2)}`);
    clearCart();
    setShowCheckout(false);
    setShowCart(false);
    resetCheckoutForm();
  };
  
  const resetCheckoutForm = () => {
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setPhone('');
  };
  
  // Cart functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
          ? {...item, quantity: item.quantity + 1}
          : item
        );
      } else {
        return [...prevCart, {...product, quantity: 1}];
      }
    });
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
        ? {...item, quantity: newQuantity}
        : item
      )
    );
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Render authentication forms
  const renderAuthForms = () => {
    if (authMode === 'login') {
      return (
        <div className="auth-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? 
            <button 
              className="link-button" 
              onClick={() => setAuthMode('signup')}
            >
              Sign up
            </button>
          </p>
        </div>
      );
    } else {
      return (
        <div className="auth-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account? 
            <button 
              className="link-button" 
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
          </p>
        </div>
      );
    }
  };
  
  // Render checkout form
  const renderCheckoutForm = () => {
    return (
      <div className="modal">
        <div className="modal-content checkout-form">
          <span className="close" onClick={() => setShowCheckout(false)}>&times;</span>
          <h2>Shipping Information</h2>
          <form onSubmit={handleCheckoutSubmit}>
            <div className="form-group">
              <label>Street Address:</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State:</label>
                <input 
                  type="text" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Zip Code:</label>
                <input 
                  type="text" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <p>Items: {getTotalItems()}</p>
              <p>Total: ${getSubtotal().toFixed(2)}</p>
            </div>
            <button type="submit">Place Order</button>
            <button type="button" className="secondary-button" onClick={() => setShowCheckout(false)}>
              Return to Cart
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  // Render cart
  const renderCart = () => {
    if (cart.length === 0) {
      return (
        <div className="cart-container">
          <h2>Your Cart</h2>
          <p>Your cart is empty.</p>
          <button onClick={() => setShowCart(false)}>Continue Shopping</button>
        </div>
      );
    }
    
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{'\u20B9'}{item.price.toFixed(2)}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button 
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <p>Subtotal: ${getSubtotal().toFixed(2)}</p>
          <button onClick={() => setShowCheckout(true)}>
            Proceed to Checkout
          </button>
          <button className="clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        <button onClick={() => setShowCart(false)}>Continue Shopping</button>
      </div>
    );
  };
  
  return (
    <div className="app">
      {/* Header */}
      <header>
        <h1 onClick={() => {setShowCart(false); setShowCheckout(false);}}>SimpleShop</h1>
        <div className="header-controls">
          <button 
            className="cart-button" 
            onClick={() => isLoggedIn ? setShowCart(!showCart) : setShowAuth(true)}
          >
            Cart ({getTotalItems()})
          </button>
          {isLoggedIn ? (
            <div className="user-menu">
              <span>Hello, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)}>Login</button>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main>
        {showAuth && !isLoggedIn && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowAuth(false)}>&times;</span>
              {renderAuthForms()}
            </div>
          </div>
        )}
        
        {showCheckout && (
          renderCheckoutForm()
        )}
        
        {showCart && isLoggedIn && !showCheckout ? (
          renderCart()
        ) : !showCheckout ? (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      addToCart(product);
                    } else {
                      setShowAuth(true);
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </main>
      
      {/* Footer */}
      <footer>
        <p>&copy; 2024 SimpleShop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
