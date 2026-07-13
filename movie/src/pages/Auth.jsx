import { useState } from 'react';
import { api } from '../api/api.js';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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

  return (
    <div className="auth-container">
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 350, height: 350, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <div className="auth-card glass" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div className="logo-icon">C</div>
            <span style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(to right, white, #E2E8F0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CineAI</span>
          </div>
          <div className="auth-header">
            <h2 className="auth-title">{mode === 'login' ? 'Welcome back 👋' : 'Create an account'}</h2>
            <p className="auth-subtitle">
              {mode === 'login' ? 'Sign in to access your personalized AI movie recommendations' : 'Join CineAI to get personalized movie picks powered by AI'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: '#FCA5A5', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {mode === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                className="auth-input"
                placeholder="Alexander Johnson"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
          )}
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🚀 Sign In' : '✨ Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span className="auth-switch-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Sign up for free' : 'Sign in'}
          </span>
        </p>


      </div>
    </div>
  );
}
