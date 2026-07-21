import { useState } from 'react';

const SETTINGS_SECTIONS = [
  {
    title: 'AI Recommendations',
    items: [
      { key: 'aiEnabled', label: 'Enable AI Recommendations', desc: 'Personalize movie picks using your watch history' },
      { key: 'hybridMode', label: 'Hybrid Recommendation Mode', desc: 'Combine content-based and collaborative filtering' },
      { key: 'autoRefresh', label: 'Auto-refresh Recommendations', desc: 'Update picks every time you visit' },
    ]
  },
  {
    title: 'Notifications',
    items: [
      { key: 'newReleases', label: 'New Release Alerts', desc: 'Get notified when movies from your favorites list are released' },
      { key: 'weeklyDigest', label: 'Weekly AI Digest', desc: 'Receive a weekly curated list of AI movie picks' },
      { key: 'chatReplies', label: 'AI Chat Replies', desc: 'Notifications when AI assistant has new recommendations' },
    ]
  },
  {
    title: ' Appearance',
    items: [
      { key: 'darkMode', label: 'Dark Mode', desc: 'Enable the dark cinematic interface' },
      { key: 'reducedMotion', label: 'Reduce Animations', desc: 'Minimize motion effects for accessibility' },
      { key: 'compactView', label: 'Compact Movie Cards', desc: 'Display smaller movie cards to see more at once' },
    ]
  },
  {
    title: ' Privacy',
    items: [
      { key: 'shareHistory', label: 'Share Watch History for AI Training', desc: 'Help improve CineAI recommendation accuracy' },
      { key: 'publicProfile', label: 'Public Profile', desc: 'Let other users see your movie reviews and lists' },
      { key: 'mockMode', label: 'Demo / Mock Mode', desc: 'Use local mock data instead of connecting to the server' },
    ]
  }
];

export default function Settings() {
  const [toggles, setToggles] = useState({
    aiEnabled: true, hybridMode: true, autoRefresh: false,
    newReleases: true, weeklyDigest: false, chatReplies: true,
    darkMode: true, reducedMotion: false, compactView: false,
    shareHistory: false, publicProfile: false,
    mockMode: localStorage.getItem('cineai_mock_mode') === 'true',
  });

  const handleToggle = (key) => {
    const newVal = !toggles[key];
    setToggles(t => ({ ...t, [key]: newVal }));
    if (key === 'mockMode') {
      localStorage.setItem('cineai_mock_mode', String(newVal));
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>⚙️ Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Customize your CineAI experience.</p>
      </div>

      {SETTINGS_SECTIONS.map(section => (
        <div key={section.title} className="settings-section">
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{section.title}</h2>
          {section.items.map(item => (
            <div key={item.key} className="settings-row">
              <div className="settings-info">
                <div className="settings-label" style={{ opacity: item.locked ? 0.5 : 1 }}>{item.label}</div>
                <div className="settings-desc">{item.desc}</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={toggles[item.key] || false}
                  onChange={() => !item.locked && handleToggle(item.key)}
                  disabled={item.locked}
                />
                <span className="toggle-slider" style={{ opacity: item.locked ? 0.4 : 1 }} />
              </label>
            </div>
          ))}
        </div>
      ))}

      {/* Account */}
      <div className="settings-section">
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>👤 Account</h2>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ fontSize: 14 }}>Change Password</button>
          <button className="btn btn-secondary" style={{ fontSize: 14 }}>Export My Data</button>
          <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', padding: '12px 24px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Delete Account</button>
        </div>
      </div>

      {/* App Info */}
      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 13 }}>
        CineAI v1.0.0 · Built with ❤️ · React 19 + FastAPI + MongoDB
      </div>
    </div>
  );
}
