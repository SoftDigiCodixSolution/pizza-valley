import React, { useState, useEffect } from 'react';
import './App.css';

const menuItems = [
  { id: 1, name: 'Margherita Classic', desc: 'San Marzano tomatoes, fresh mozzarella, basil oil', price: 850, category: 'Classic', badge: 'Bestseller' },
  { id: 2, name: 'BBQ Smoky Chicken', desc: 'Smoked chicken, caramelized onions, BBQ drizzle', price: 1100, category: 'Chicken', badge: 'Hot' },
  { id: 3, name: 'Pepperoni Feast', desc: 'Double pepperoni, cheese burst crust, oregano', price: 1250, category: 'Beef', badge: 'Popular' },
  { id: 4, name: 'Veggie Supreme', desc: 'Bell peppers, mushrooms, olives, sun-dried tomato', price: 950, category: 'Veggie', badge: '' },
  { id: 5, name: 'Spicy Tikka', desc: 'Tikka chicken, green chilli, mint chutney base', price: 1150, category: 'Chicken', badge: 'Spicy 🌶' },
  { id: 6, name: 'Cheese Overload', desc: 'Four cheese blend, truffle oil, crispy garlic', price: 1300, category: 'Classic', badge: 'New' },
  { id: 7, name: 'Buffalo Ranch', desc: 'Buffalo sauce, ranch drizzle, crispy chicken strips', price: 1200, category: 'Chicken', badge: '' },
  { id: 8, name: 'Beef Zinger', desc: 'Zinger beef, jalapeños, chipotle mayo, cheddar', price: 1350, category: 'Beef', badge: 'Hot' },
];

const categories = ['All', 'Classic', 'Chicken', 'Beef', 'Veggie'];

const deals = [
  { id: 1, title: 'Family Feast', desc: '2 Large Pizzas + 4 Drinks + Garlic Bread', price: 2999, original: 4200, tag: '28% OFF' },
  { id: 2, title: 'Date Night', desc: '1 Large Pizza + 2 Drinks + Dessert', price: 1599, original: 2100, tag: '24% OFF' },
  { id: 3, title: 'Solo Deal', desc: '1 Medium Pizza + 1 Drink + Fries', price: 899, original: 1300, tag: '30% OFF' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setNotification(`${item.name} added to cart!`);
    setTimeout(() => setNotification(''), 2500);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'menu', 'deals', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 100) setActiveSection(s);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="pv-app">

      {/* NOTIFICATION TOAST */}
      {notification && <div className="pv-toast">{notification}</div>}

      {/* NAVBAR */}
      <nav className="pv-nav">
        <div className="pv-nav-inner">
          <div className="pv-logo" onClick={() => scrollTo('home')}>
            <span className="pv-logo-icon">🍕</span>
            <span className="pv-logo-text">Pizza <span>Valley</span></span>
          </div>

          <ul className={`pv-nav-links ${menuOpen ? 'open' : ''}`}>
            {['home', 'menu', 'deals', 'contact'].map(s => (
              <li key={s}>
                <button className={activeSection === s ? 'active' : ''} onClick={() => scrollTo(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="pv-nav-actions">
            <button className="pv-cart-btn" onClick={() => setCartOpen(true)}>
              🛒 <span className="pv-cart-count">{cartCount}</span>
            </button>
            <button className="pv-order-btn" onClick={() => scrollTo('menu')}>Order Now</button>
            <button className="pv-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pv-hero" id="home">
        <div className="pv-hero-content">
          <div className="pv-hero-badge">🔥 Fresh & Hot — Delivered in 30 mins</div>
          <h1>
            Authentic Pizza<br />
            <span>Crafted with Passion</span>
          </h1>
          <p>Stone-fired pizzas made from scratch, delivered hot to your door anywhere in Rawalpindi & Islamabad.</p>
          <div className="pv-hero-btns">
            <button className="pv-btn-primary" onClick={() => scrollTo('menu')}>Explore Menu 🍕</button>
            <button className="pv-btn-secondary" onClick={() => scrollTo('deals')}>View Deals 🎉</button>
          </div>
          <div className="pv-hero-stats">
            <div className="pv-stat"><strong>50K+</strong><span>Happy Customers</span></div>
            <div className="pv-stat-divider" />
            <div className="pv-stat"><strong>4.9★</strong><span>Average Rating</span></div>
            <div className="pv-stat-divider" />
            <div className="pv-stat"><strong>30 min</strong><span>Avg Delivery</span></div>
          </div>
        </div>
        <div className="pv-hero-visual">
          <div className="pv-pizza-ring">
            <div className="pv-pizza-emoji">🍕</div>
          </div>
          <div className="pv-floating-card pv-fc1">⚡ Just ordered!</div>
          <div className="pv-floating-card pv-fc2">🌟 Top Rated</div>
        </div>
      </section>

      {/* WHY US */}
      <section className="pv-why">
        <div className="pv-why-grid">
          {[
            { icon: '🔥', title: 'Stone Fired', desc: 'Cooked in our signature stone oven at 450°C' },
            { icon: '🌿', title: 'Fresh Daily', desc: 'All ingredients sourced fresh every morning' },
            { icon: '⚡', title: '30 Min Delivery', desc: 'Guaranteed hot delivery or your next order is free' },
            { icon: '💳', title: 'Easy Payment', desc: 'Cash, JazzCash, Easypaisa, Card — your choice' },
          ].map((f, i) => (
            <div className="pv-why-card" key={i}>
              <div className="pv-why-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section className="pv-menu-section" id="menu">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Our Menu</span>
          <h2>Hand-Crafted Pizzas</h2>
          <p>Every pizza made fresh to order with premium ingredients</p>
        </div>

        <div className="pv-categories">
          {categories.map(c => (
            <button key={c} className={`pv-cat-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="pv-menu-grid">
          {filtered.map(item => (
            <div className="pv-menu-card" key={item.id}>
              {item.badge && <div className="pv-menu-badge">{item.badge}</div>}
              <div className="pv-menu-img">🍕</div>
              <div className="pv-menu-info">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="pv-menu-footer">
                  <span className="pv-price">Rs. {item.price.toLocaleString()}</span>
                  <button className="pv-add-btn" onClick={() => addToCart(item)}>+ Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEALS */}
      <section className="pv-deals" id="deals">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Special Offers</span>
          <h2>Today's Best Deals</h2>
          <p>Limited time offers — grab them before they're gone!</p>
        </div>
        <div className="pv-deals-grid">
          {deals.map(deal => (
            <div className="pv-deal-card" key={deal.id}>
              <div className="pv-deal-tag">{deal.tag}</div>
              <div className="pv-deal-icon">🎉</div>
              <h3>{deal.title}</h3>
              <p>{deal.desc}</p>
              <div className="pv-deal-price">
                <span className="pv-deal-original">Rs. {deal.original.toLocaleString()}</span>
                <span className="pv-deal-new">Rs. {deal.price.toLocaleString()}</span>
              </div>
              <button className="pv-btn-primary" style={{width:'100%'}} onClick={() => scrollTo('menu')}>Order This Deal</button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pv-testimonials">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Reviews</span>
          <h2>What Our Customers Say</h2>
        </div>
        <div className="pv-test-grid">
          {[
            { name: 'Ahmed Raza', loc: 'Rawalpindi', text: 'Best pizza in town! The BBQ Chicken is absolutely amazing. Fast delivery too!', stars: 5 },
            { name: 'Sara Khan', loc: 'Islamabad', text: 'Ordered the Family Feast deal — total value for money. Will order again!', stars: 5 },
            { name: 'Usman Ali', loc: 'Bahria Town', text: 'Spicy Tikka pizza is a must try. Love the stone fired taste, so authentic!', stars: 5 },
          ].map((t, i) => (
            <div className="pv-test-card" key={i}>
              <div className="pv-test-stars">{'★'.repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <div className="pv-test-author">
                <div className="pv-test-avatar">{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.loc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="pv-contact" id="contact">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Find Us</span>
          <h2>Get In Touch</h2>
        </div>
        <div className="pv-contact-grid">
          {[
            { icon: '📞', title: 'Call Us', info: '0300-1234567', sub: 'Daily 11am – 11pm' },
            { icon: '📍', title: 'Location', info: 'Rawalpindi, Pakistan', sub: 'Saddar & Bahria Town' },
            { icon: '📧', title: 'Email', info: 'info@pizzavalley.pk', sub: 'Reply within 2 hours' },
            { icon: '🕐', title: 'Hours', info: '11:00 AM – 11:00 PM', sub: 'Open 7 days a week' },
          ].map((c, i) => (
            <div className="pv-contact-card" key={i}>
              <div className="pv-contact-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <strong>{c.info}</strong>
              <span>{c.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pv-footer">
        <div className="pv-footer-top">
          <div className="pv-footer-brand">
            <div className="pv-logo">🍕 Pizza <span>Valley</span></div>
            <p>Authentic stone-fired pizzas delivered fresh to your door across Rawalpindi & Islamabad since 2024.</p>
            <div className="pv-social">
              <button>📘</button><button>📸</button><button>🐦</button>
            </div>
          </div>
          <div className="pv-footer-links">
            <h4>Quick Links</h4>
            {['Home', 'Menu', 'Deals', 'Contact'].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
            ))}
          </div>
          <div className="pv-footer-links">
            <h4>Order Via</h4>
            <p>🌐 Website</p><p>📱 Android App</p><p>🍎 iOS App</p><p>💻 Desktop App</p>
          </div>
          <div className="pv-footer-links">
            <h4>Payment</h4>
            <p>💵 Cash on Delivery</p><p>📱 JazzCash</p><p>📱 Easypaisa</p><p>💳 Credit / Debit Card</p>
          </div>
        </div>
        <div className="pv-footer-bottom">
          <p>© 2024 Pizza Valley. All rights reserved. Made with ❤️ in Pakistan</p>
        </div>
      </footer>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="pv-cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="pv-cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="pv-cart-header">
              <h2>🛒 Your Cart</h2>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="pv-cart-empty">
                <p>🍕</p>
                <p>Your cart is empty</p>
                <button className="pv-btn-primary" onClick={() => { setCartOpen(false); scrollTo('menu'); }}>Browse Menu</button>
              </div>
            ) : (
              <>
                <div className="pv-cart-items">
                  {cart.map(item => (
                    <div className="pv-cart-item" key={item.id}>
                      <div className="pv-cart-item-info">
                        <strong>{item.name}</strong>
                        <span>Rs. {item.price.toLocaleString()}</span>
                      </div>
                      <div className="pv-cart-item-qty">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className="pv-cart-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                    </div>
                  ))}
                </div>
                <div className="pv-cart-footer">
                  <div className="pv-cart-total">
                    <span>Total</span>
                    <strong>Rs. {cartTotal.toLocaleString()}</strong>
                  </div>
                  <button className="pv-btn-primary" style={{width:'100%', padding:'14px'}}>Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
