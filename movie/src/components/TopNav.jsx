import { useState, useRef } from 'react';

export default function TopNav({ user, setActiveView, onSearch, onLogout }) {
  const [query, setQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setActiveView('search');
    }
  };

  const NOTIFS = [
    { id: 1, text: '🤖 AI found 5 new picks based on your recent watches', time: '2 min ago', unread: true },
    { id: 2, text: '⭐ Interstellar sequel announced! Add to watchlist?', time: '1 hour ago', unread: true },
    { id: 3, text: '🎬 New release: Dune: Part Three trailer is out', time: '3 hours ago', unread: false },
  ];

  return (
    <header className="top-nav">
      {/* Search Bar */}
      <form className="search-bar-container" onSubmit={handleSearch} style={{ flex: '0 0 auto' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          placeholder="Search movies, actors, genres or ask AI..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}>✕</button>
        )}
      </form>

      {/* Action Buttons */}
      <div className="top-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Voice Search */}
        <button className="icon-btn" title="Voice Search" onClick={() => { inputRef.current?.focus(); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }} style={{ position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{
              position: 'absolute', top: -4, right: -4, width: 16, height: 16,
              background: '#D946EF', borderRadius: '50%', border: '2px solid var(--bg-color)',
              color: 'white', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>3</span>
          </button>
          {showNotifs && (
            <div className="glass" style={{
              position: 'absolute', top: '52px', right: 0, width: 340,
              borderRadius: 'var(--radius-lg)', overflow: 'hidden', zIndex: 200,
              border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
                <span style={{ fontSize: 12, color: 'var(--primary-accent)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              {NOTIFS.map(n => (
                <div key={n.id} style={{
                  padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)',
                  background: n.unread ? 'rgba(139,92,246,0.04)' : 'transparent', cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button className="icon-btn" title="Toggle Theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        {/* Profile Avatar / User Menu */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '6px 12px 6px 6px', borderRadius: 30, transition: 'var(--transition-fast)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Nihar Sawant" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Nihar Sawant</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {showUserMenu && (
              <div className="glass" style={{
                position: 'absolute', top: '52px', right: 0, width: 220,
                borderRadius: 'var(--radius-lg)', overflow: 'hidden', zIndex: 200,
                border: '1px solid var(--card-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                {[
                  { label: '👤 View Profile', view: 'profile' },
                  { label: '⚙️ Settings', view: 'settings' },
                  { label: '👑 Admin', view: 'admin' },
                ].map(item => (
                  <button key={item.view} onClick={() => { setActiveView(item.view); setShowUserMenu(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}
                    onMouseEnter={e => e.target.style.background = 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    {item.label}
                  </button>
                ))}
                <div style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />
                <button onClick={() => { onLogout(); setShowUserMenu(false); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 20px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}
            onClick={() => setActiveView('auth')}>
            Sign In
          </button>
        )}
      </div>

      {/* Click outside to close */}
      {(showNotifs || showUserMenu) && (
        <div onClick={() => { setShowNotifs(false); setShowUserMenu(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
      )}
    </header>
  );
}
