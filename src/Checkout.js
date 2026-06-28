import React, { useState } from 'react';
import './Checkout.css';

const STEPS = ['Cart Review', 'Delivery Info', 'Payment', 'Confirmation'];

export default function Checkout({ cart, total, onBack, updateQty, removeFromCart }) {
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('cod');
  const [form, setForm] = useState({ name:'', phone:'', address:'', city:'Rawalpindi', notes:'' });
  const [, setOrdered] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const delivery = 150;
  const grandTotal = total + delivery;

  const placeOrder = () => {
    setOrdered(true);
    setStep(3);
  };

  return (
    <div className="co-page">
      {/* HEADER */}
      <div className="co-header">
        <button className="co-back" onClick={onBack}>← Back to Menu</button>
        <div className="co-logo">🍕 Pizza Valley</div>
        <div />
      </div>

      {/* STEPS */}
      <div className="co-steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`co-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="co-step-num">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="co-body">
        {/* STEP 0 — CART REVIEW */}
        {step === 0 && (
          <div className="co-section">
            <h2>Review Your Order</h2>
            {cart.length === 0 ? (
              <div className="co-empty">
                <p>🍕 Your cart is empty</p>
                <button className="co-btn" onClick={onBack}>Browse Menu</button>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div className="co-item" key={item.id}>
                    <img src={item.img} alt={item.name} className="co-item-img" />
                    <div className="co-item-info">
                      <strong>{item.name}</strong>
                      <span>Rs. {item.price.toLocaleString()} each</span>
                    </div>
                    <div className="co-item-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="co-item-total">Rs. {(item.price * item.qty).toLocaleString()}</div>
                    <button className="co-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                  </div>
                ))}
                <div className="co-summary">
                  <div className="co-summary-row"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
                  <div className="co-summary-row"><span>Delivery</span><span>Rs. {delivery}</span></div>
                  <div className="co-summary-row total"><span>Total</span><strong>Rs. {grandTotal.toLocaleString()}</strong></div>
                </div>
                <button className="co-btn" onClick={() => setStep(1)}>Continue to Delivery →</button>
              </>
            )}
          </div>
        )}

        {/* STEP 1 — DELIVERY INFO */}
        {step === 1 && (
          <div className="co-section">
            <h2>Delivery Information</h2>
            <div className="co-form">
              <div className="co-field">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
              </div>
              <div className="co-field">
                <label>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="03XX-XXXXXXX" required />
              </div>
              <div className="co-field">
                <label>Delivery Address</label>
                <input name="address" value={form.address} onChange={handle} placeholder="Street, Area, Landmark" required />
              </div>
              <div className="co-field">
                <label>City</label>
                <select name="city" value={form.city} onChange={handle}>
                  <option>Rawalpindi</option>
                  <option>Islamabad</option>
                  <option>Bahria Town</option>
                </select>
              </div>
              <div className="co-field">
                <label>Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handle}
                  placeholder="Extra cheese, no onions, ring the bell..." rows={3} />
              </div>
              <div className="co-type-row">
                <button className={`co-type-btn ${form.type !== 'pickup' ? 'active' : ''}`}
                  onClick={() => setForm({...form, type:'delivery'})}>🚴 Delivery</button>
                <button className={`co-type-btn ${form.type === 'pickup' ? 'active' : ''}`}
                  onClick={() => setForm({...form, type:'pickup'})}>🏪 Self Pickup</button>
              </div>
            </div>
            <div className="co-nav-btns">
              <button className="co-btn-outline" onClick={() => setStep(0)}>← Back</button>
              <button className="co-btn" onClick={() => setStep(2)}
                disabled={!form.name || !form.phone || !form.address}>
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — PAYMENT */}
        {step === 2 && (
          <div className="co-section">
            <h2>Choose Payment Method</h2>
            <div className="co-pay-options">
              {[
                { id:'cod', icon:'💵', label:'Cash on Delivery', sub:'Pay when your order arrives' },
                { id:'jazzcash', icon:'📱', label:'JazzCash', sub:'Pay via JazzCash mobile wallet' },
                { id:'easypaisa', icon:'📲', label:'Easypaisa', sub:'Pay via Easypaisa mobile wallet' },
                { id:'card', icon:'💳', label:'Credit / Debit Card', sub:'Visa, Mastercard, secure payment' },
              ].map(p => (
                <div key={p.id} className={`co-pay-card ${payMethod === p.id ? 'active' : ''}`}
                  onClick={() => setPayMethod(p.id)}>
                  <div className="co-pay-radio">{payMethod === p.id ? '●' : '○'}</div>
                  <div className="co-pay-icon">{p.icon}</div>
                  <div>
                    <strong>{p.label}</strong>
                    <span>{p.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {payMethod === 'jazzcash' && (
              <div className="co-pay-detail">
                <p>Send Rs. {grandTotal.toLocaleString()} to <strong>0300-1234567</strong></p>
                <input placeholder="Enter JazzCash Transaction ID" />
              </div>
            )}
            {payMethod === 'easypaisa' && (
              <div className="co-pay-detail">
                <p>Send Rs. {grandTotal.toLocaleString()} to <strong>0311-1234567</strong></p>
                <input placeholder="Enter Easypaisa Transaction ID" />
              </div>
            )}
            {payMethod === 'card' && (
              <div className="co-pay-detail">
                <input placeholder="Card Number" />
                <div className="co-card-row">
                  <input placeholder="MM/YY" />
                  <input placeholder="CVV" />
                </div>
                <input placeholder="Cardholder Name" />
              </div>
            )}

            <div className="co-order-summary">
              <div className="co-summary-row"><span>Items ({cart.length})</span><span>Rs. {total.toLocaleString()}</span></div>
              <div className="co-summary-row"><span>Delivery</span><span>Rs. {delivery}</span></div>
              <div className="co-summary-row total"><span>Grand Total</span><strong>Rs. {grandTotal.toLocaleString()}</strong></div>
            </div>

            <div className="co-nav-btns">
              <button className="co-btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="co-btn" onClick={placeOrder}>Place Order 🍕</button>
            </div>
          </div>
        )}

        {/* STEP 3 — CONFIRMATION */}
        {step === 3 && (
          <div className="co-section co-confirm">
            <div className="co-confirm-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been received and is being prepared.</p>
            <div className="co-order-id">Order #PV{Math.floor(Math.random()*90000+10000)}</div>
            <div className="co-tracking">
              <div className="co-track-step done">✓ Order Received</div>
              <div className="co-track-step active">🔥 Preparing your pizza</div>
              <div className="co-track-step">🚴 Out for delivery</div>
              <div className="co-track-step">✅ Delivered</div>
            </div>
            <p className="co-eta">⏱ Estimated delivery: <strong>25–35 minutes</strong></p>
            <button className="co-btn" onClick={onBack}>Back to Menu</button>
          </div>
        )}
      </div>
    </div>
  );
}