import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', emoji: '🎛️' },
  { id: 'discover', label: 'Discover', emoji: '🧭' },
  { id: 'recommendations', label: 'AI Recommendations', emoji: '✨' },
  { id: 'genres', label: 'Genres', emoji: '🎭' },
  { id: 'trending', label: 'Trending', emoji: '🔥' },
  { id: 'watchlist', label: 'Watchlist', emoji: '🔖' },
  { id: 'favorites', label: 'Favorites', emoji: '❤️' },
  { id: 'history', label: 'Continue Watching', emoji: '🕒' },
  { id: 'assistant', label: 'AI Assistant', emoji: '💬' },
];

const BOTTOM_ITEMS = [
  { id: 'profile', label: 'Profile', emoji: '👤' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
  { id: 'admin', label: 'Admin', emoji: '👑' },
];

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => setActiveView('home')}>
        <div className="logo-icon">
          <span style={{ fontSize: 18, fontWeight: 900 }}>C</span>
        </div>
        <span className="logo-text">CineMind</span>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={collapsed ? item.label : ''}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <span className="nav-emoji">{item.emoji}</span>
            <span className="nav-text">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section: AI Credits & Collapse */}
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="ai-credits-card">
            <div className="ai-credits-header">
              <span className="ai-credits-title">AI credits</span>
            </div>
            <div className="ai-credits-value">Premium · Unlimited</div>
            <div className="ai-credits-progress">
              <div className="ai-credits-bar" />
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item collapse-btn"
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <span className="nav-emoji">{collapsed ? '▶' : '◀'}</span>
          <span className="nav-text">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
