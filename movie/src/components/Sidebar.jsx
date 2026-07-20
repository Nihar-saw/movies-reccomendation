import { useState } from 'react';

const NAV_GROUPS = [
  [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'discover', label: 'Discover', icon: '🔍' },
    { id: 'recommendations', label: 'AI Recommendations', icon: '✨' },
    { id: 'genres', label: 'Genres', icon: '🔠' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'topRated', label: 'Top Rated', icon: '⭐' },
  ],
  [
    { id: 'watchlist', label: 'Watchlist', icon: '🔖' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
  ],
  [
    { id: 'assistant', label: 'AI Assistant', icon: '🤖' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]
];

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveView('home')}>
          <div className="logo-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🎬</span>
          </div>
          {!collapsed && (
            <span className="logo-text" style={{ fontSize: 18, fontWeight: 800, background: 'white', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CineMind <span style={{ color: '#D946EF', WebkitTextFillColor: '#D946EF' }}>AI</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16 }}>
            ≪
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
          ≫
        </button>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ marginTop: 24, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: 20 }}>
            {group.map(item => (
              <button
                key={item.id}
                className={`nav-item${activeView === item.id ? ' active' : ''}`}
                onClick={() => setActiveView(item.id)}
                title={collapsed ? item.label : ''}
                style={{ 
                  background: 'none', 
                  width: '100%', 
                  textAlign: 'left',
                  border: 'none',
                  outline: 'none',
                  padding: collapsed ? '12px' : '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeView === item.id ? 'white' : 'var(--text-secondary)',
                  backgroundColor: activeView === item.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  borderLeft: activeView === item.id ? '3px solid #8B5CF6' : '3px solid transparent',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer',
                  fontWeight: activeView === item.id ? 600 : 500,
                  fontSize: 14,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 16, opacity: activeView === item.id ? 1 : 0.7 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Section: Premium Card */}
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="bg-accent-gradient" style={{ borderRadius: 16, padding: 20, margin: '10px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Upgrade to Premium</h4>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              Unlock advanced AI recommendations and exclusive features.
            </p>
            <button style={{ 
              background: 'linear-gradient(to right, #8B5CF6, #D946EF)', 
              color: 'white', 
              border: 'none', 
              padding: '10px', 
              borderRadius: 8, 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4
            }}>
              ⭐ Upgrade Now
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
