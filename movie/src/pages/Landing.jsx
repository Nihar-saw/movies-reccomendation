import { useState } from 'react';
import './Landing.css'; // We will add specific styles for the landing page

export default function Landing({ onAuthClick }) {
  return (
    <div className="landing-container">
      {/* Background Gradient */}
      <div className="landing-bg-glow" />

      {/* Top Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon">C</div>
          <span className="logo-text">CineMind <span style={{ color: '#D946EF' }}>AI</span></span>
        </div>
        <div className="landing-links">
          <span onClick={() => onAuthClick('register')}>Home</span>
          <span onClick={() => onAuthClick('register')}>Features</span>
          <span onClick={() => onAuthClick('register')}>AI Assistant</span>
          <span onClick={() => onAuthClick('register')}>Premium</span>
          <span onClick={() => onAuthClick('register')}>About</span>
        </div>
        <div className="landing-actions">
          <button className="btn btn-secondary" onClick={() => onAuthClick('login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => onAuthClick('register')} style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)' }}>
            Get Started
          </button>
        </div>
      </nav>

      <main className="landing-main">
        {/* Hero Section */}
        <div className="landing-hero">
          <div className="hero-text-section">
            <div className="ai-badge">✨ AI Powered Movie Recommendations</div>
            <h1 className="hero-heading">
              Find Movies <br /> You'll <span className="text-gradient">Love</span>
            </h1>
            <p className="hero-subheading">
              CineMind AI analyzes your taste and millions of patterns to recommend movies that match your mood, moments and mind.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={() => onAuthClick('register')} style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)' }}>
                Get Started Free →
              </button>
              <button className="btn btn-secondary btn-large" onClick={() => alert('Trailer coming soon! Please Sign In to explore.')}>
                ▶ Watch Trailer
              </button>
            </div>
            <div className="hero-social-proof">
              <div className="avatar-group">
                {[1, 2, 3].map(i => (
                  <div key={i} className="avatar-small" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i})` }} />
                ))}
              </div>
              <span>Join <strong>57K+</strong> movie lovers</span>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="hero-collage">
              <div className="collage-card main-card" style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdlsR.jpg)' }}>
                <div className="match-badge">98% Match</div>
                <div className="movie-title">INTERSTELLAR</div>
              </div>
              <div className="collage-card sub-card-1" style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQQsV5AC5.jpg)' }}></div>
              <div className="collage-card sub-card-2" style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg)' }}></div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="landing-stats">
          <div className="stat-item">
            <div className="stat-icon-circle" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>👥</div>
            <div>
              <div className="stat-number">57K+</div>
              <div className="stat-label">Happy Users</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-circle" style={{ background: 'rgba(217, 70, 239, 0.1)' }}>🚀</div>
            <div>
              <div className="stat-number">4.8M+</div>
              <div className="stat-label">Recommendations</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-circle" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>⭐</div>
            <div>
              <div className="stat-number">96%</div>
              <div className="stat-label">AI Match Accuracy</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>🎞️</div>
            <div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Movies Analyzed</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="landing-features">
          <div className="features-header">
            <h2>Why Choose <span style={{ color: '#D946EF' }}>CineMind AI?</span></h2>
            <p>Smart. Personal. Effortless.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' }}>🧠</div>
              <h3>AI-Powered</h3>
              <p>Advanced algorithms understand your taste better than anyone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: '#D946EF', background: 'rgba(217, 70, 239, 0.1)' }}>🎯</div>
              <h3>Highly Accurate</h3>
              <p>Our AI model gives 96% accurate recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>⚡</div>
              <h3>Instant Suggestions</h3>
              <p>Get movie suggestions in real-time based on your mood.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>💖</div>
              <h3>Personalized</h3>
              <p>Tailored recommendations just for you.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="landing-cta">
          <div className="cta-content">
            <h2>Ready to discover your <br/> next favorite movie?</h2>
            <p>Join thousands of users and let AI find movies you'll absolutely love.</p>
          </div>
          <div className="cta-image">
            <span style={{ fontSize: 100 }}>🍿</span>
          </div>
          <div className="cta-action">
            <button className="btn btn-primary btn-large" onClick={() => onAuthClick('register')} style={{ background: 'white', color: '#13131A', display: 'flex', alignItems: 'center', gap: 8 }}>
              Get Started Free <span>→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="landing-logo" style={{ marginBottom: 12 }}>
            <div className="logo-icon">C</div>
            <span className="logo-text">CineMind <span style={{ color: '#D946EF' }}>AI</span></span>
          </div>
          <p>Your personal AI movie companion.<br/>Discover. Watch. Enjoy.</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <span onClick={() => onAuthClick('register')}>Features</span>
            <span onClick={() => onAuthClick('register')}>AI Recommendations</span>
            <span onClick={() => onAuthClick('register')}>Premium</span>
            <span onClick={() => onAuthClick('register')}>Pricing</span>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <span onClick={() => alert('About Us: We are CineMind AI!')}>About Us</span>
            <span onClick={() => alert('Blog coming soon.')}>Blog</span>
            <span onClick={() => alert('No open positions right now.')}>Careers</span>
            <span onClick={() => alert('Contact us at support@cinemind.ai')}>Contact</span>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <span onClick={() => alert('Privacy Policy is standard.')}>Privacy Policy</span>
            <span onClick={() => alert('Terms of Service applied.')}>Terms of Service</span>
            <span onClick={() => alert('Refund Policy: 30 days.')}>Refund Policy</span>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div className="social-icon" onClick={() => window.open('https://x.com', '_blank')}>X</div>
              <div className="social-icon" onClick={() => window.open('https://linkedin.com', '_blank')}>In</div>
              <div className="social-icon" onClick={() => window.open('https://youtube.com', '_blank')}>Yt</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 CineMind AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
