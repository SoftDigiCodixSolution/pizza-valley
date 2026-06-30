cat > /mnt/user-data/outputs/AdminDashboard.js << 'EOF'
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import ActivityLogs from './ActivityLogs';

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://rhrsebtzwqjvjdrtvuhl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocnNlYnR6d3FqdmpkcnR2dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTI3MzEsImV4cCI6MjA5ODA2ODczMX0.Nay0yADjjFzzQ2qH90xa6EHPwRuNFosJTLTgniVF5g8';

const sb = async (table, options = {}) => {
  const { method='GET', body, select='*', filter='' } = options;
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filter}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const STATUS_COLORS = {
  placed     : '#3b82f6',
  preparing  : '#f59e0b',
  on_the_way : '#8b5cf6',
  delivered  : '#10b981',
  cancelled  : '#ef4444',
};

const STATUS_LABELS = {
  placed     : '🔵 Placed',
  preparing  : '🟡 Preparing',
  on_the_way : '🟣 On the Way',
  delivered  : '🟢 Delivered',
  cancelled  : '🔴 Cancelled',
};

const ROLES = {
  super_admin    : { label:'Super Admin',    color:'#ef4444', icon:'👑' },
  branch_manager : { label:'Branch Manager', color:'#f59e0b', icon:'🏪' },
  kitchen        : { label:'Kitchen Staff',  color:'#3b82f6', icon:'👨‍🍳' },
  rider          : { label:'Delivery Rider', color:'#10b981', icon:'🛵' },
  customer       : { label:'Customer',       color:'#888',    icon:'👤' },
};

// ── LOGIN SCREEN ──
function AdminLogin({ onLogin }) {
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await sb('admin_accounts', {
        filter: `&email=eq.${form.email}&active=eq.true`
      });
      if (!data.length) { setError('Account not found'); setLoading(false); return; }
      const account = data[0];
      if (account.password !== form.password) { setError('Wrong password'); setLoading(false); return; }
      onLogin(account);
    } catch (err) {
      setError('Connection error. Check Supabase.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0d0d0d',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,padding:40,width:'100%',maxWidth:400}}>
        <div style={{fontSize:22,fontWeight:700,color:'#ff6b35',marginBottom:8}}>🍕 Pizza Valley</div>
        <div style={{fontSize:24,fontWeight:700,color:'#fff',marginBottom:4}}>Admin Login</div>
        <div style={{fontSize:13,color:'#888',marginBottom:24}}>Enter your role credentials</div>

        {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'10px 16px',borderRadius:10,fontSize:13,marginBottom:16}}>⚠️ {error}</div>}

        <form onSubmit={login}>
          {[
            { name:'email',    label:'Email',    type:'email',    ph:'role@pizzavalley.pk' },
            { name:'password', label:'Password', type:'password', ph:'••••••••' },
          ].map(f => (
            <div key={f.name} style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:13,color:'#aaa',marginBottom:6}}>{f.label}</label>
              <input type={f.type} placeholder={f.ph}
                value={form[f.name]} onChange={e => setForm({...form,[f.name]:e.target.value})}
                required
                style={{width:'100%',background:'#242424',border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:12,padding:'13px 16px',fontSize:14,color:'#fff',outline:'none',
                fontFamily:'Poppins,sans-serif',boxSizing:'border-box'}}
              />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{width:'100%',background:'#ff6b35',color:'#fff',border:'none',padding:14,
            borderRadius:30,fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div style={{marginTop:24,background:'#242424',borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:'#888',marginBottom:8}}>Test accounts:</div>
          {[
            { role:'Super Admin',    email:'superadmin@pizzavalley.pk',  pass:'super2024' },
            { role:'Branch Manager', email:'manager@pizzavalley.pk',     pass:'manager2024' },
            { role:'Kitchen',        email:'kitchen@pizzavalley.pk',     pass:'kitchen2024' },
            { role:'Rider',          email:'rider@pizzavalley.pk',       pass:'rider2024' },
          ].map((a,i) => (
            <div key={i} style={{fontSize:11,color:'#666',padding:'2px 0'}}>
              <span style={{color:'#ff6b35'}}>{a.role}:</span> {a.email} / {a.pass}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──
export default function AdminDashboard({ onLogout }) {
  const [account, setAccount]   = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Live data states
  const [orders, setOrders]     = useState([]);
  const [menu, setMenu]         = useState([]);
  const [stock, setStock]       = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [stats, setStats]       = useState({ orders:0, revenue:0, customers:0, menu:0 });

  // Load data from Supabase
  const loadOrders   = async () => { try { const d = await sb('orders');          setOrders(d);   } catch(e){} };
  const loadMenu     = async () => { try { const d = await sb('menu');             setMenu(d);     } catch(e){} };
  const loadStock    = async () => { try { const d = await sb('stock');            setStock(d);    } catch(e){} };
  const loadAccounts = async () => { try { const d = await sb('admin_accounts');   setAccounts(d); } catch(e){} };

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    Promise.all([loadOrders(), loadMenu(), loadStock(), loadAccounts()])
      .finally(() => setLoading(false));
    // Auto refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [account]);

  useEffect(() => {
    const revenue = orders.filter(o => o.status === 'delivered').reduce((a,b) => a + (b.total||0), 0);
    setStats({ orders: orders.length, revenue, customers: orders.length, menu: menu.length });
  }, [orders, menu]);

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch(e){}
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/menu?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      setMenu(prev => prev.filter(m => m.id !== id));
    } catch(e){}
  };

  if (!account) return <AdminLogin onLogin={a => { setAccount(a); setActiveTab('dashboard'); }} />;

  const role = account.role;

  // NAV ITEMS based on role
  const allNavItems = [
    { id:'dashboard', icon:'📊', label:'Dashboard',      roles:['super_admin','branch_manager'] },
    { id:'orders',    icon:'📦', label:'Orders',         roles:['super_admin','branch_manager','kitchen','rider'] },
    { id:'menu',      icon:'🍕', label:'Menu',           roles:['super_admin','branch_manager'] },
    { id:'stock',     icon:'📋', label:'Stock',          roles:['super_admin','branch_manager'] },
    { id:'accounts',  icon:'👥', label:'Accounts',       roles:['super_admin'] },
    { id:'reports',   icon:'📈', label:'Reports',        roles:['super_admin','branch_manager'] },
    { id:'logs',      icon:'📜', label:'Activity Logs',  roles:['super_admin','branch_manager'] },
  ];
  const navItems = allNavItems.filter(n => n.roles.includes(role));

  return (
    <div className="ad-layout">

      {/* SIDEBAR */}
      <aside className={`ad-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="ad-sidebar-header">
          <div className="ad-logo">🍕 {sidebarOpen && 'Pizza Valley'}</div>
          <button className="ad-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="ad-admin-badge">
          <div className="ad-avatar">{account.name[0]}</div>
          {sidebarOpen && (
            <div>
              <strong>{account.name}</strong>
              <span style={{color: ROLES[role]?.color}}>{ROLES[role]?.icon} {ROLES[role]?.label}</span>
            </div>
          )}
        </div>

        <nav className="ad-nav">
          {navItems.map(item => (
            <button key={item.id}
              className={`ad-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}>
              <span className="ad-nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="ad-logout" onClick={() => { setAccount(null); onLogout && onLogout(); }}>
          🚪 {sidebarOpen && 'Logout'}
        </button>
      </aside>

      {/* MAIN */}
      <main className="ad-main">

        {/* TOPBAR */}
        <div className="ad-topbar">
          <div>
            <h1>{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</h1>
            <span>{account.branch} — {ROLES[role]?.label}</span>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-search"><input placeholder="Search..." /></div>
            <button className="ad-notif" onClick={loadOrders}>🔄 Refresh</button>
          </div>
        </div>

        <div className="ad-content">
          {loading && <div style={{textAlign:'center',padding:20,color:'#888'}}>Loading live data...</div>}

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="ad-stats-grid">
                {[
                  { icon:'📦', label:'Total Orders',   value: stats.orders,                       change:'Live from database' },
                  { icon:'💰', label:'Total Revenue',  value:`Rs. ${stats.revenue.toLocaleString()}`, change:'Delivered orders only' },
                  { icon:'👥', label:'Total Customers',value: stats.customers,                    change:'Registered users' },
                  { icon:'🍕', label:'Menu Items',     value: stats.menu,                         change:`${stock.filter(s=>s.quantity<=s.low_alert).length} low stock` },
                ].map((s,i) => (
                  <div className="ad-stat-card" key={i}>
                    <div className="ad-stat-icon">{s.icon}</div>
                    <div>
                      <div className="ad-stat-value">{s.value}</div>
                      <div className="ad-stat-label">{s.label}</div>
                      <div className="ad-stat-change">{s.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT ORDERS */}
              <div className="ad-section">
                <div className="ad-section-header">
                  <h2>Recent Orders — Live</h2>
                  <button className="ad-view-all" onClick={() => setActiveTab('orders')}>View All →</button>
                </div>
                {orders.length === 0 ? (
                  <div style={{textAlign:'center',padding:40,color:'#888'}}>No orders yet. Orders will appear here live.</div>
                ) : (
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead><tr>
                        <th>Order ID</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th>
                      </tr></thead>
                      <tbody>
                        {orders.slice(0,5).map(o => (
                          <tr key={o.id}>
                            <td><strong>{o.id}</strong></td>
                            <td>Rs. {(o.total||0).toLocaleString()}</td>
                            <td>{o.payment_method?.toUpperCase() || 'COD'}</td>
                            <td>
                              <span className="ad-status" style={{background:STATUS_COLORS[o.status]+'22',color:STATUS_COLORS[o.status]}}>
                                {STATUS_LABELS[o.status] || o.status}
                              </span>
                            </td>
                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* STOCK ALERTS */}
              {stock.filter(s => s.quantity <= s.low_alert).length > 0 && (
                <div className="ad-section">
                  <div className="ad-section-header">
                    <h2>⚠️ Stock Alerts</h2>
                    <button className="ad-view-all" onClick={() => setActiveTab('stock')}>Manage →</button>
                  </div>
                  <div className="ad-stock-alerts">
                    {stock.filter(s => s.quantity <= s.low_alert).map((s,i) => (
                      <div key={i} className={`ad-alert-card ${s.quantity === 0 ? 'critical' : 'low'}`}>
                        <div className="ad-alert-icon">{s.quantity === 0 ? '🔴' : '🟡'}</div>
                        <div>
                          <strong>{s.ingredient}</strong>
                          <span>{s.quantity} {s.unit} remaining</span>
                        </div>
                        <span className={`ad-alert-badge ${s.quantity === 0 ? 'critical' : 'low'}`}>
                          {s.quantity === 0 ? 'OUT OF STOCK' : 'LOW'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div className="ad-section">
              <div className="ad-section-header">
                <h2>All Orders — Live</h2>
                <button className="ad-btn-primary" onClick={loadOrders}>🔄 Refresh</button>
              </div>
              {orders.length === 0 ? (
                <div style={{textAlign:'center',padding:40,color:'#888'}}>No orders in database yet.</div>
              ) : (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead><tr>
                      <th>Order ID</th><th>Total</th><th>Payment</th><th>Status</th>
                      {['super_admin','branch_manager','kitchen'].includes(role) && <th>Update</th>}
                    </tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.id}</strong></td>
                          <td>Rs. {(o.total||0).toLocaleString()}</td>
                          <td>{o.payment_method?.toUpperCase() || 'COD'}</td>
                          <td>
                            <span className="ad-status" style={{background:STATUS_COLORS[o.status]+'22',color:STATUS_COLORS[o.status]}}>
                              {STATUS_LABELS[o.status] || o.status}
                            </span>
                          </td>
                          {['super_admin','branch_manager','kitchen'].includes(role) && (
                            <td>
                              <select className="ad-status-select" value={o.status}
                                onChange={e => updateOrderStatus(o.id, e.target.value)}>
                                <option value="placed">Placed</option>
                                <option value="preparing">Preparing</option>
                                <option value="on_the_way">On the Way</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── MENU ── */}
          {activeTab === 'menu' && (
            <div className="ad-section">
              <div className="ad-section-header">
                <h2>Menu Management — Live</h2>
                <button className="ad-btn-primary" onClick={loadMenu}>🔄 Refresh</button>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Badge</th><th>Status</th>
                    {role === 'super_admin' && <th>Action</th>}
                  </tr></thead>
                  <tbody>
                    {menu.map(item => (
                      <tr key={item.id}>
                        <td><img src={item.image_url} alt={item.name}
                          style={{width:48,height:48,borderRadius:8,objectFit:'cover'}} /></td>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.category}</td>
                        <td>Rs. {(item.price||0).toLocaleString()}</td>
                        <td>{item.badge || '—'}</td>
                        <td>
                          <span style={{padding:'3px 10px',borderRadius:20,fontSize:12,
                            background: item.available ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: item.available ? '#10b981' : '#ef4444'}}>
                            {item.available ? '✅ Available' : '❌ Unavailable'}
                          </span>
                        </td>
                        {role === 'super_admin' && (
                          <td>
                            <button className="ad-btn-sm" style={{marginRight:6}}>Edit</button>
                            <button className="ad-btn-sm" style={{background:'rgba(239,68,68,0.15)',color:'#ef4444',borderColor:'rgba(239,68,68,0.3)'}}
                              onClick={() => deleteMenuItem(item.id)}>Delete</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STOCK ── */}
          {activeTab === 'stock' && (
            <div className="ad-section">
              <div className="ad-section-header">
                <h2>Stock Management — Live</h2>
                <button className="ad-btn-primary" onClick={loadStock}>🔄 Refresh</button>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Ingredient</th><th>Quantity</th><th>Unit</th><th>Alert Level</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {stock.map((s,i) => {
                      const status = s.quantity === 0 ? 'critical' : s.quantity <= s.low_alert ? 'low' : 'ok';
                      return (
                        <tr key={i}>
                          <td><strong>{s.ingredient}</strong></td>
                          <td>{s.quantity}</td>
                          <td>{s.unit}</td>
                          <td>{s.low_alert} {s.unit}</td>
                          <td>
                            <span className={`ad-stock-status ${status}`}>
                              {status==='ok' ? '✅ OK' : status==='low' ? '⚠️ Low' : '🔴 Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ACCOUNTS ── */}
          {activeTab === 'accounts' && role === 'super_admin' && (
            <div className="ad-section">
              <div className="ad-section-header">
                <h2>All Role Accounts</h2>
                <button className="ad-btn-primary" onClick={loadAccounts}>🔄 Refresh</button>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {accounts.map((a,i) => (
                      <tr key={i}>
                        <td><strong>{a.name}</strong></td>
                        <td>{a.email}</td>
                        <td>
                          <span style={{padding:'3px 10px',borderRadius:20,fontSize:12,
                            background: ROLES[a.role]?.color+'22', color: ROLES[a.role]?.color}}>
                            {ROLES[a.role]?.icon} {ROLES[a.role]?.label}
                          </span>
                        </td>
                        <td>{a.branch}</td>
                        <td>
                          <span style={{padding:'3px 10px',borderRadius:20,fontSize:12,
                            background: a.active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: a.active ? '#10b981' : '#ef4444'}}>
                            {a.active ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === 'reports' && (
            <div className="ad-section">
              <div className="ad-section-header"><h2>Sales Reports</h2></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:24}}>
                {[
                  { label:'Total Orders',    value: orders.length },
                  { label:'Delivered',       value: orders.filter(o=>o.status==='delivered').length },
                  { label:'Cancelled',       value: orders.filter(o=>o.status==='cancelled').length },
                  { label:'Total Revenue',   value:`Rs. ${orders.filter(o=>o.status==='delivered').reduce((a,b)=>a+(b.total||0),0).toLocaleString()}` },
                  { label:'Avg Order Value', value: orders.length ? `Rs. ${Math.round(orders.reduce((a,b)=>a+(b.total||0),0)/orders.length).toLocaleString()}` : 'Rs. 0' },
                  { label:'Menu Items',      value: menu.length },
                ].map((r,i) => (
                  <div key={i} className="ad-stat-card">
                    <div>
                      <div className="ad-stat-value">{r.value}</div>
                      <div className="ad-stat-label">{r.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ACTIVITY LOGS ── */}
          {activeTab === 'logs' && <ActivityLogs />}

        </div>
      </main>
    </div>
  );
}