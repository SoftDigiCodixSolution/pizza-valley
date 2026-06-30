import React from 'react';
import './AppDownload.css';

export default function AppDownload({ onClose }) {
  return (
    <div className="dl-overlay" onClick={onClose}>
      <div className="dl-modal" onClick={e => e.stopPropagation()}>

        <div className="dl-header">
          <div>
            <h2>📱 Download Pizza Valley App</h2>
            <p>Order faster with our dedicated app — available on all platforms</p>
          </div>
          <button className="dl-close" onClick={onClose}>✕</button>
        </div>

        <div className="dl-body">

          {/* ANDROID */}
          <div className="dl-card dl-android">
            <div className="dl-card-header">
              <div className="dl-platform-icon">🤖</div>
              <div>
                <h3>Android App</h3>
                <span>Android 8.0 and above</span>
              </div>
              <div className="dl-badge">FREE</div>
            </div>
            <div className="dl-qr-section">
              <div className="dl-qr-box">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://pizza-valley-cjm5.vercel.app&color=ff6b35&bgcolor=1a1a1a"
                  alt="Android QR Code"
                  className="dl-qr-img"
                />
                <span>Scan to download</span>
              </div>
              <div className="dl-dl-options">
                <a href="https://pizza-valley-cjm5.vercel.app" target="_blank" rel="noreferrer" className="dl-btn dl-btn-green">
                  <span>⬇️</span> Download APK
                </a>
                <a href="https://play.google.com" target="_blank" rel="noreferrer" className="dl-btn dl-btn-dark">
                  <span>▶️</span> Google Play Store
                </a>
                <div className="dl-features">
                  <div>✅ Push notifications</div>
                  <div>✅ Live order tracking</div>
                  <div>✅ Offline menu browsing</div>
                </div>
              </div>
            </div>
          </div>

          {/* IOS */}
          <div className="dl-card dl-ios">
            <div className="dl-card-header">
              <div className="dl-platform-icon">🍎</div>
              <div>
                <h3>iOS App</h3>
                <span>iOS 14.0 and above</span>
              </div>
              <div className="dl-badge">FREE</div>
            </div>
            <div className="dl-qr-section">
              <div className="dl-qr-box">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com&color=ffffff&bgcolor=1a1a1a"
                  alt="iOS QR Code"
                  className="dl-qr-img"
                />
                <span>Scan to download</span>
              </div>
              <div className="dl-dl-options">
                <a href="https://apps.apple.com" target="_blank" rel="noreferrer" className="dl-btn dl-btn-blue">
                  <span>🍎</span> App Store
                </a>
                <div className="dl-features">
                  <div>✅ Apple Pay support</div>
                  <div>✅ Face ID login</div>
                  <div>✅ Live order tracking</div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="dl-card dl-desktop">
            <div className="dl-card-header">
              <div class="dl-platform-icon">💻</div>
              <div>
                <h3>Desktop App</h3>
                <span>Windows / macOS / Linux</span>
              </div>
              <div className="dl-badge">FREE</div>
            </div>
            <div className="dl-desktop-btns">
              <a href="https://pizza-valley-cjm5.vercel.app" target="_blank" rel="noreferrer" className="dl-btn dl-btn-dark">
                <span>🪟</span> Download for Windows (.exe)
              </a>
              <a href="https://pizza-valley-cjm5.vercel.app" target="_blank" rel="noreferrer" className="dl-btn dl-btn-dark">
                <span>🍎</span> Download for macOS (.dmg)
              </a>
              <a href="https://pizza-valley-cjm5.vercel.app" target="_blank" rel="noreferrer" className="dl-btn dl-btn-dark">
                <span>🐧</span> Download for Linux (.deb)
              </a>
            </div>
          </div>

          {/* WEBSITE */}
          <div className="dl-card dl-web">
            <div className="dl-card-header">
              <div className="dl-platform-icon">🌐</div>
              <div>
                <h3>Order via Website</h3>
                <span>No download needed — works on any browser</span>
              </div>
            </div>
            <a href="https://pizza-valley-cjm5.vercel.app" target="_blank" rel="noreferrer" className="dl-btn dl-btn-orange" style={{display:'block',textAlign:'center',marginTop:12}}>
              🌐 Open Website Now
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}