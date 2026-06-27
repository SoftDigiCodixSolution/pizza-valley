import React, { useState } from 'react';
import './Auth.css';

export default function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="auth-box">
      <div className="auth-logo">🍕 Pizza Valley</div>
      <h2>Welcome Back</h2>
      <p className="auth-sub">Login to your account</p>

      <form onSubmit={submit}>
        <div className="auth-field">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="you@email.com"
            value={form.email} onChange={handle} required />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input name="password" type="password" placeholder="••••••••"
            value={form.password} onChange={handle} required />
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

      <div className="auth-divider"><span>or continue with</span></div>
      <div className="auth-socials">
        <button className="auth-social-btn">📘 Facebook</button>
        <button className="auth-social-btn">🔍 Google</button>
      </div>

      <p className="auth-switch">
        Don't have an account?{' '}
        <button className="auth-link" onClick={onSwitch}>Register here</button>
      </p>
    </div>
  );
}