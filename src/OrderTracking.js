import React, { useState, useEffect } from 'react';
import './OrderTracking.css';

const STEPS = [
  { id: 'placed',      icon: '📋', label: 'Order Placed',     desc: 'Your order has been received' },
  { id: 'confirmed',   icon: '✅', label: 'Confirmed',         desc: 'Restaurant confirmed your order' },
  { id: 'preparing',   icon: '👨‍🍳', label: 'Preparing',        desc: 'Chef is making your pizza' },
  { id: 'on_the_way',  icon: '🛵', label: 'On the Way',        desc: 'Rider is heading to you' },
  { id: 'delivered',   icon: '🎉', label: 'Delivered',         desc: 'Enjoy your pizza!' },
];

const RESTAURANT_LOCATION = { lat: 33.5969, lng: 73.0479 };

export default function OrderTracking({ orderId, onBack, deliveryLocation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta]                 = useState(28);
  const [riderName]                   = useState('Muhammad Bilal');
  const [riderPhone]                  = useState('0311-1234567');
  const [riderPos, setRiderPos]       = useState(RESTAURANT_LOCATION);

  const customerLoc = deliveryLocation || { lat: 33.6007, lng: 73.0679 }; // fallback demo location

  // Simulate live order progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
      setEta(prev => Math.max(0, prev - 7));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate rider moving along the route once "on_the_way"
  useEffect(() => {
    if (currentStep !== 3) return; // only animate during "on_the_way"
    let progress = 0;
    const moveInterval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) { clearInterval(moveInterval); return; }
      setRiderPos({
        lat: RESTAURANT_LOCATION.lat + (customerLoc.lat - RESTAURANT_LOCATION.lat) * progress,
        lng: RESTAURANT_LOCATION.lng + (customerLoc.lng - RESTAURANT_LOCATION.lng) * progress,
      });
    }, 800);
    return () => clearInterval(moveInterval);
  }, [currentStep, customerLoc.lat, customerLoc.lng]);

  const currentStatus = STEPS[currentStep];
  const isDelivered   = currentStep === STEPS.length - 1;
  const showMap       = currentStep >= 2; // show map from "preparing" onward

  return (
    <div className="ot-page">

      {/* HEADER */}
      <div className="ot-header">
        <button className="ot-back" onClick={onBack}>← Back</button>
        <div className="ot-logo">🍕 Pizza Valley</div>
        <div />
      </div>

      <div className="ot-body">

        {/* ORDER ID */}
        <div className="ot-order-id">
          <span>Order</span>
          <strong>#{orderId || 'PV10234'}</strong>
        </div>

        {/* STATUS HERO */}
        <div className={`ot-status-hero ${isDelivered ? 'delivered' : ''}`}>
          <div className="ot-status-icon">{currentStatus.icon}</div>
          <h2>{currentStatus.label}</h2>
          <p>{currentStatus.desc}</p>
          {!isDelivered && (
            <div className="ot-eta">
              ⏱ Estimated arrival: <strong>{eta} minutes</strong>
            </div>
          )}
        </div>

        {/* LIVE MAP — shows from "preparing" step onward */}
        {showMap && !isDelivered && (
          <div className="ot-map-section">
            <div className="ot-map-header">
              <span>🗺️ Live Tracking</span>
              {currentStep === 3 && <span className="ot-map-live-badge">● LIVE</span>}
            </div>
            <div className="ot-map-box">
              <iframe
                title="rider-map"
                className="ot-map-iframe"
                src={`https://maps.google.com/maps?q=${riderPos.lat},${riderPos.lng}&z=14&output=embed`}
              />
              {currentStep === 3 && (
                <div className="ot-map-overlay">
                  <div className="ot-rider-marker">🛵</div>
                  <span>Rider is moving toward you</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROGRESS STEPS */}
        <div className="ot-steps">
          {STEPS.map((step, index) => (
            <div key={step.id} className="ot-step-row">
              <div className={`ot-step-circle ${index <= currentStep ? 'done' : ''} ${index === currentStep ? 'active' : ''}`}>
                {index < currentStep ? '✓' : step.icon}
              </div>
              <div className="ot-step-info">
                <strong className={index <= currentStep ? 'active' : ''}>{step.label}</strong>
                <span>{step.desc}</span>
              </div>
              {index === currentStep && (
                <div className="ot-step-badge">Current</div>
              )}
            </div>
          ))}
        </div>

        {/* RIDER INFO */}
        {currentStep >= 3 && !isDelivered && (
          <div className="ot-rider">
            <div className="ot-rider-header">
              <h3>🛵 Your Rider</h3>
            </div>
            <div className="ot-rider-info">
              <div className="ot-rider-avatar">{riderName[0]}</div>
              <div>
                <strong>{riderName}</strong>
                <span>Delivery Rider</span>
              </div>
              <a href={`tel:${riderPhone}`} className="ot-call-btn">
                📞 Call Rider
              </a>
            </div>
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="ot-summary">
          <h3>Order Summary</h3>
          <div className="ot-summary-items">
            <div className="ot-summary-item">
              <span>BBQ Smoky Chicken x1</span>
              <span>Rs. 1,100</span>
            </div>
            <div className="ot-summary-item">
              <span>Pepperoni Feast x1</span>
              <span>Rs. 1,250</span>
            </div>
            <div className="ot-summary-item">
              <span>Delivery Fee</span>
              <span>Rs. 150</span>
            </div>
            <div className="ot-summary-item total">
              <strong>Total</strong>
              <strong>Rs. 2,500</strong>
            </div>
          </div>
        </div>

        {/* DELIVERY ADDRESS */}
        <div className="ot-address">
          <h3>📍 Delivery Address</h3>
          <p>House 12, Street 4, Satellite Town, Rawalpindi</p>
        </div>

        {/* HELP */}
        <div className="ot-help">
          <h3>Need Help?</h3>
          <div className="ot-help-btns">
            <a href="tel:0300-1234567" className="ot-help-btn">📞 Call Us</a>
            <button className="ot-help-btn">💬 Chat Support</button>
          </div>
        </div>

      </div>
    </div>
  );
}