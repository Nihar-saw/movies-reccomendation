import { useState, useEffect } from 'react';
import { api } from '../api/api.js';
import './Auth.css';

export default function Auth({ onLogin, initialMode = 'login', onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (mode === 'register' && !agreedToTerms) {
      setError('You must agree to the Terms of Service');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (mode === 'login') {
        result = await api.login(form.email, form.password);
      } else {
        result = await api.register(form.name, form.email, form.password);
      }
      if (result?.success && result?.token) {
        localStorage.setItem('cineai_token', result.token);
        onLogin(result.user, result.token);
      } else {
        setError(result?.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const loginImage = 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop'; // TV glowing in dark
  const registerImage = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'; // Director chair/movie setup

  return (
    <div className="auth-split-container">
      {/* Left Panel - Image/Graphics */}
      <div className="auth-left-panel" style={{ backgroundImage: `url(${mode === 'login' ? loginImage : registerImage})` }}>
        <div className="auth-left-overlay">
          <div className="auth-left-content">
            {mode === 'login' ? (
              <>
                <h2>Great stories stay<br/>with us forever.</h2>
                <p>Sign in and continue your<br/>movie journey.</p>
              </>
            ) : (
              <>
                <h2>Your next favorite<br/>movie is waiting.</h2>
                <p>Create an account and let the<br/>AI magic begin.</p>
              </>
            )}
            <div className="carousel-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        <button className="auth-back-btn" onClick={onBack}>← Back to Home</button>
        
        <div className="auth-form-container">
          <div className="landing-logo" style={{ justifyContent: 'center', marginBottom: 24 }}>
            <div className="logo-icon">C</div>
            <span className="logo-text">CineMind <span style={{ color: '#D946EF' }}>AI</span></span>
          </div>
          
          <div className="auth-header" style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="auth-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="auth-subtitle" style={{ color: '#94A3B8', fontSize: 14 }}>
              {mode === 'login' ? 'Sign in to continue your movie journey' : 'Start your personalized movie experience'}
            </p>
          </div>

          <div className="social-auth-buttons">
            <button className="btn-social" onClick={() => alert('Google authentication is coming soon! Please use email for now.')}>
              <span className="social-icon-placeholder">G</span> Continue with Google
            </button>
            <button className="btn-social" onClick={() => alert('Apple authentication is coming soon! Please use email for now.')}>
              <span className="social-icon-placeholder">🍎</span> Continue with Apple
            </button>
          </div>

          <div className="auth-divider">
            <span>or {mode === 'login' ? 'continue' : 'sign up'} with email</span>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  className="auth-input-dark"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
            )}
            
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input-dark"
                type="email"
                placeholder="youremail@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="auth-label">Password</label>
                {mode === 'login' && <span className="auth-forgot-link" onClick={() => alert('Password reset link has been sent to your email!')}>Forgot Password?</span>}
              </div>
              <input
                className="auth-input-dark"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Confirm Password</label>
                <input
                  className="auth-input-dark"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="auth-checkbox-group">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreedToTerms} 
                  onChange={(e) => setAgreedToTerms(e.target.checked)} 
                />
                <label htmlFor="terms">
                  I agree to the <span className="auth-link">Terms of Service</span> and <span className="auth-link">Privacy Policy</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', marginTop: 8 }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch" style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#94A3B8' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span className="auth-switch-link" style={{ color: '#D946EF', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
