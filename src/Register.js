import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: ''
  });
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
      <h2>Create Account</h2>
      <p className="auth-sub">Join us and start ordering!</p>

      <form onSubmit={submit}>
        <div className="auth-field">
          <label>Full Name</label>
          <input name="name" type="text" placeholder="Your full name"
            value={form.name} onChange={handle} required />
        </div>
        <div className="auth-field">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="you@email.com"
            value={form.email} onChange={handle} required />
        </div>
        <div className="auth-field">
          <label>Phone Number</label>
          <input name="phone" type="tel" placeholder="03XX-XXXXXXX"
            value={form.phone} onChange={handle} required />
        </div>
        <div className="auth-grid2">
          <div className="auth-field">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handle} required />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input name="confirm" type="password" placeholder="••••••••"
              value={form.confirm} onChange={handle} required />
          </div>
        </div>
        <label className="auth-check" style={{marginBottom:'16px',display:'flex'}}>
          <input type="checkbox" required /> &nbsp;
          I agree to the <button type="button" className="auth-link">&nbsp;Terms & Conditions</button>
        </label>
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button className="auth-link" onClick={onSwitch}>Login here</button>
      </p>
    </div>
  );
}