
cat > /mnt/user-data/outputs/App.js << 'APPEOF'
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import Checkout from './Checkout';
import AdminDashboard from './AdminDashboard';
import OrderTracking from './OrderTracking';

const menuItems = [
  { id:1, category:'Classic', badge:'Bestseller', name:'Margherita Classic',
    desc:'San Marzano tomatoes, fresh mozzarella, fresh basil, olive oil', price:850,
    img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=85' },
  { id:2, category:'Chicken', badge:'Hot', name:'BBQ Smoky Chicken',
    desc:'Smoked chicken chunks, caramelized onions, smoky BBQ sauce drizzle', price:1100,
    img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=85' },
  { id:3, category:'Beef', badge:'Popular', name:'Pepperoni Feast',
    desc:'Double layer pepperoni, cheese burst crust, dried oregano', price:1250,
    img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=85' },
  { id:4, category:'Veggie', badge:'', name:'Veggie Supreme',
    desc:'Roasted bell peppers, mushrooms, black olives, sun-dried tomato', price:950,
    img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=85' },
  { id:5, category:'Chicken', badge:'Spicy 🌶', name:'Spicy Tikka',
    desc:'Tikka marinated chicken, green chilli, mint chutney base, red onion', price:1150,
    img:'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=85' },
  { id:6, category:'Classic', badge:'New', name:'Cheese Overload',
    desc:'Four cheese blend — mozzarella, cheddar, gouda, parmesan with truffle oil', price:1300,
    img:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=85' },
  { id:7, category:'Chicken', badge:'', name:'Buffalo Ranch',
    desc:'Crispy buffalo chicken strips, ranch drizzle, pickled jalapeños', price:1200,
    img:'https://images.unsplash.com/photo-1548369937-47519962c11a?w=500&q=85' },
  { id:8, category:'Beef', badge:'Hot', name:'Beef Zinger',
    desc:'Zinger beef chunks, jalapeños, chipotle mayo, sharp cheddar', price:1350,
    img:'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=85' },
];

const categories = ['All', 'Classic', 'Chicken', 'Beef', 'Veggie'];

const deals = [
  { id:1, tag:'28% OFF', title:'Family Feast',
    desc:'2 Large Pizzas + 4 Drinks + Garlic Bread', price:2999, original:4200,
    img:'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=500&q=85' },
  { id:2, tag:'24% OFF', title:'Date Night',
    desc:'1 Large Pizza + 2 Drinks + Chocolate Lava Cake', price:1599, original:2100,
    img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=85' },
  { id:3, tag:'30% OFF', title:'Solo Deal',
    desc:'1 Medium Pizza + 1 Drink + Crispy Fries', price:899, original:1300,
    img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=85' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [toast, setToast]         = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [authPage, setAuthPage]   = useState(null);
  const [page, setPage]           = useState('home');
  const [isAdmin, setIsAdmin]     = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  const filtered  = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setToast(`✅ ${item.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  useEffect(() => {
    const onScroll = () => {
      ['home','menu','deals','contact'].forEach(s => {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 100) setActiveSection(s);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // ── ADMIN PAGE ──
  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  // ── ORDER TRACKING PAGE ──
  if (showTracking) {
    return (
      <OrderTracking
        orderId={currentOrderId}
        onBack={() => setShowTracking(false)}
      />
    );
  }

  // ── CHECKOUT PAGE ──
  if (page === 'checkout') {
    return (
      <Checkout
        cart={cart}
        total={cartTotal}
        onBack={() => setPage('home')}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onOrderPlaced={(id) => {
          setPage('home');
          setCart([]);
          setCurrentOrderId(id);
          setShowTracking(true);
        }}
      />
    );
  }

  // ── MAIN PAGE ──
  return (
    <div className="pv-app">

      {/* AUTH OVERLAY */}
      {authPage && (
        <div className="auth-page" style={{position:'fixed',inset:0,zIndex:3000}}>
          {authPage === 'login'
            ? <Login onSwitch={() => setAuthPage('register')} onClose={() => setAuthPage(null)} />
            : <Register onSwitch={() => setAuthPage('login')} onClose={() => setAuthPage(null)} />
          }
          <button
            onClick={() => setAuthPage(null)}
            style={{position:'absolute',top:20,left:20,background:'rgba(255,255,255,0.1)',
            border:'none',color:'#fff',padding:'8px 16px',borderRadius:'20px',
            cursor:'pointer',fontSize:'14px',fontFamily:'Poppins,sans-serif'}}>
            ← Back
          </button>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="pv-toast">{toast}</div>}

      {/* ── NAVBAR ── */}
      <nav className="pv-nav">
        <div className="pv-nav-inner">
          <div className="pv-logo" onClick={() => scrollTo('home')}>
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=40&h=40&q=80&fit=crop"
              alt="logo" className="pv-logo-img"
            />
            Pizza <span>Valley</span>
          </div>

          <ul className={`pv-nav-links ${menuOpen ? 'open' : ''}`}>
            {['home','menu','deals','contact'].map(s => (
              <li key={s}>
                <button
                  className={activeSection === s ? 'active' : ''}
                  onClick={() => scrollTo(s)}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="pv-nav-actions">
            <button className="pv-cart-btn" onClick={() => setCartOpen(true)}>
              🛒 {cartCount > 0 && <span className="pv-cart-count">{cartCount}</span>}
            </button>
            <button className="pv-btn-login" onClick={() => setAuthPage('login')}>Login</button>
            <button className="pv-order-btn" onClick={() => setAuthPage('register')}>Register</button>
            <button
              onClick={() => setIsAdmin(true)}
              style={{background:'#333',border:'none',color:'#ff6b35',
              padding:'8px 14px',borderRadius:'20px',cursor:'pointer',
              fontSize:'12px',fontFamily:'Poppins,sans-serif'}}>
              Admin
            </button>
            <button className="pv-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pv-hero" id="home">
        <div className="pv-hero-content">
          <div className="pv-hero-badge">🔥 Fresh & Hot — Delivered in 30 mins</div>
          <h1>Authentic Pizza<br /><span>Crafted with Passion</span></h1>
          <p>Stone-fired pizzas made from scratch, delivered hot to your door anywhere in Rawalpindi & Islamabad.</p>
          <div className="pv-hero-btns">
            <button className="pv-btn-primary"   onClick={() => scrollTo('menu')}>Explore Menu 🍕</button>
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
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90"
              alt="Fresh Pizza" className="pv-hero-pizza-img"
            />
          </div>
          <div className="pv-floating-card pv-fc1">⚡ Just ordered in Rawalpindi!</div>
          <div className="pv-floating-card pv-fc2">🌟 4.9 Rating — Top Rated</div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="pv-why">
        <div className="pv-why-grid">
          {[
            { icon:'🔥', title:'Stone Fired',    desc:'Cooked in our signature stone oven at 450°C' },
            { icon:'🌿', title:'Fresh Daily',     desc:'All ingredients sourced fresh every morning' },
            { icon:'⚡', title:'30 Min Delivery', desc:'Guaranteed hot delivery or your next is free' },
            { icon:'💳', title:'Easy Payment',    desc:'Cash, JazzCash, Easypaisa, Card — your choice' },
          ].map((f, i) => (
            <div className="pv-why-card" key={i}>
              <div className="pv-why-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENU ── */}
      <section className="pv-menu-section" id="menu">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Our Menu</span>
          <h2>Hand-Crafted Pizzas</h2>
          <p>Every pizza made fresh to order with premium ingredients</p>
        </div>
        <div className="pv-categories">
          {categories.map(c => (
            <button key={c}
              className={`pv-cat-btn ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="pv-menu-grid">
          {filtered.map(item => (
            <div className="pv-menu-card" key={item.id}>
              {item.badge && <div className="pv-menu-badge">{item.badge}</div>}
              <div className="pv-menu-img">
                <img src={item.img} alt={item.name} loading="lazy" />
              </div>
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

      {/* ── DEALS ── */}
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
              <div className="pv-deal-img">
                <img src={deal.img} alt={deal.title} loading="lazy" />
              </div>
              <div className="pv-deal-body">
                <h3>{deal.title}</h3>
                <p>{deal.desc}</p>
                <div className="pv-deal-price">
                  <span className="pv-deal-original">Rs. {deal.original.toLocaleString()}</span>
                  <span className="pv-deal-new">Rs. {deal.price.toLocaleString()}</span>
                </div>
                <button className="pv-btn-primary" style={{width:'100%'}}
                  onClick={() => scrollTo('menu')}>Order This Deal</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pv-testimonials">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Reviews</span>
          <h2>What Our Customers Say</h2>
        </div>
        <div className="pv-test-grid">
          {[
            { name:'Ahmed Raza',  loc:'Rawalpindi', stars:5, text:'Best pizza in town! The BBQ Chicken is absolutely amazing. Fast delivery too!' },
            { name:'Sara Khan',   loc:'Islamabad',  stars:5, text:'Ordered the Family Feast deal — total value for money. Will definitely order again!' },
            { name:'Usman Ali',   loc:'Bahria Town',stars:5, text:'Spicy Tikka pizza is a must try. Love the stone fired taste, so authentic!' },
          ].map((t, i) => (
            <div className="pv-test-card" key={i}>
              <div className="pv-test-stars">{'★'.repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <div className="pv-test-author">
                <div className="pv-test-avatar">{t.name[0]}</div>
                <div><strong>{t.name}</strong><span>{t.loc}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="pv-contact" id="contact">
        <div className="pv-section-header">
          <span className="pv-eyebrow">Find Us</span>
          <h2>Get In Touch</h2>
        </div>
        <div className="pv-contact-grid">
          {[
            { icon:'📞', title:'Call Us',  info:'0300-1234567',        sub:'Daily 11am – 11pm' },
            { icon:'📍', title:'Location', info:'Rawalpindi, Pakistan', sub:'Saddar & Bahria Town' },
            { icon:'📧', title:'Email',    info:'info@pizzavalley.pk',  sub:'Reply within 2 hours' },
            { icon:'🕐', title:'Hours',    info:'11:00 AM – 11:00 PM', sub:'Open 7 days a week' },
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

      {/* ── FOOTER ── */}
      <footer className="pv-footer">
        <div className="pv-footer-top">
          <div className="pv-footer-brand">
            <div className="pv-logo" style={{marginBottom:12}}>🍕 Pizza <span>Valley</span></div>
            <p>Authentic stone-fired pizzas delivered fresh to your door across Rawalpindi & Islamabad since 2024.</p>
            <div className="pv-social">
              <button>📘</button><button>📸</button><button>🐦</button>
            </div>
          </div>
          <div className="pv-footer-links">
            <h4>Quick Links</h4>
            {['Home','Menu','Deals','Contact'].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
            ))}
          </div>
          <div className="pv-footer-links">
            <h4>Order Via</h4>
            <p>🌐 Website</p><p>📱 Android App</p><p>🍎 iOS App</p><p>💻 Desktop App</p>
          </div>
          <div className="pv-footer-links">
            <h4>Payment</h4>
            <p>💵 Cash on Delivery</p><p>📱 JazzCash</p><p>📱 Easypaisa</p><p>💳 Card</p>
          </div>
        </div>
        <div className="pv-footer-bottom">
          <p>© 2024 Pizza Valley. All rights reserved. Made with ❤️ in Pakistan</p>
        </div>
      </footer>

      {/* ── CART SIDEBAR ── */}
      {cartOpen && (
        <div className="pv-cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="pv-cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="pv-cart-header">
              <h2>🛒 Your Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="pv-cart-empty">
                <img
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80"
                  alt="empty"
                  style={{width:100,height:100,borderRadius:'50%',objectFit:'cover',opacity:0.4,marginBottom:12}}
                />
                <p>Your cart is empty</p>
                <button className="pv-btn-primary"
                  onClick={() => { setCartOpen(false); scrollTo('menu'); }}>
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="pv-cart-items">
                  {cart.map(item => (
                    <div className="pv-cart-item" key={item.id}>
                      <img src={item.img} alt={item.name} className="pv-cart-item-img" />
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
                  <button className="pv-btn-primary"
                    style={{width:'100%',padding:'14px'}}
                    onClick={() => { setCartOpen(false); setPage('checkout'); }}>
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

