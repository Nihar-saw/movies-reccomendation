import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'discover', label: 'Discover', emoji: '🎬' },
  { id: 'recommendations', label: 'AI Picks', emoji: '🤖' },
  { id: 'search', label: 'Search', emoji: '🔍' },
  { id: 'favorites', label: 'Favorites', emoji: '❤️' },
  { id: 'watchlist', label: 'Watchlist', emoji: '📺' },
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
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} style={{ background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(12px)' }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => setActiveView('home')}>
        <div className="logo-icon">
          <span style={{ fontSize: 18, fontWeight: 900 }}>C</span>
        </div>
        <span className="logo-text">CineAI</span>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={collapsed ? item.label : ''}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
            <span className="nav-text" style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 8 }} />
        {BOTTOM_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={collapsed ? item.label : ''}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
            <span className="nav-text" style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item"
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', marginTop: 4 }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{collapsed ? '▶' : '◀'}</span>
          <span className="nav-text" style={{ fontSize: 14, fontWeight: 500 }}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
