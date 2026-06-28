import React, { useState } from 'react';
import './Auth.css';

export default function Login({ onSwitch, onClose, onLogin }) {  // ← added onLogin prop
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email || !form.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Get registered users from localStorage
      const users = JSON.parse(localStorage.getItem('pv_users') || '[]');
      const user  = users.find(u => u.email === form.email);

      if (!user) {
        setError('No account found with this email. Please register first.');
        setLoading(false);
        return;
      }

      if (user.password !== form.password) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      // Save logged in user
      const userData = {
        id    : user.id,
        name  : user.name,
        email : user.email,
        phone : user.phone,
        role  : user.role,
      };
      localStorage.setItem('pv_current_user', JSON.stringify(userData));

      // ── 🔐 NEW: Notify the parent component (App) about the logged-in user ──
      if (onLogin) {
        onLogin(userData);
      }

      setSuccess(`Welcome back, ${user.name}! 🎉`);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🍕 Pizza Valley</div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Login to your account</p>

        {error   && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <form onSubmit={submit}>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>
          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="auth-link">Forgot Password?</button>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button className="auth-link" onClick={onSwitch}>Register here</button>
        </p>
      </div>
    </div>
  );
}