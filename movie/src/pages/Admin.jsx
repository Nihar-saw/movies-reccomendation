const MOCK_USERS = [
  { id: 1, name: 'Alexander Johnson', email: 'alex@example.com', watched: 124, joined: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Sophia Martinez', email: 'sophia@example.com', watched: 87, joined: '2024-02-20', status: 'Active' },
  { id: 3, name: 'Liam Chen', email: 'liam@example.com', watched: 201, joined: '2023-11-05', status: 'Active' },
  { id: 4, name: 'Ava Wilson', email: 'ava@example.com', watched: 43, joined: '2024-04-12', status: 'Inactive' },
  { id: 5, name: 'Noah Garcia', email: 'noah@example.com', watched: 155, joined: '2023-09-28', status: 'Active' },
];

const TRENDING_GENRES = [
  { name: 'Science Fiction', count: 2847, trend: '+12%', color: '#6366F1' },
  { name: 'Thriller', count: 2340, trend: '+8%', color: '#8B5CF6' },
  { name: 'Drama', count: 3120, trend: '+5%', color: '#10B981' },
  { name: 'Action', count: 1980, trend: '+15%', color: '#F59E0B' },
  { name: 'Mystery', count: 1456, trend: '+22%', color: '#EF4444' },
];

const MOST_WATCHED = [
  { rank: 1, title: 'Interstellar', views: 4289, rating: 8.6 },
  { rank: 2, title: 'Inception', views: 3974, rating: 8.8 },
  { rank: 3, title: 'The Dark Knight', views: 3756, rating: 9.0 },
  { rank: 4, title: 'The Matrix', views: 3421, rating: 8.7 },
  { rank: 5, title: 'Shawshank Redemption', views: 3198, rating: 9.3 },
];

const StatBlock = ({ label, value, icon, sub, color }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span>{label}</span>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
    <div className="stat-value" style={{ color: color || 'white' }}>{value}</div>
    <div className="stat-footer stat-trend-up">{sub}</div>
  </div>
);

export default function Admin() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 50, padding: '6px 16px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: 1 }}>Admin Dashboard</span>
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>👑 Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Monitor CineAI platform health, users, and recommendation analytics.</p>
      </div>

      {/* Platform Stats */}
      <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 40 }}>
        <StatBlock label="Total Users" value="12,847" icon="👥" sub="↑ 340 this week" color="white" />
        <StatBlock label="Movies Analyzed" value="65,290" icon="🎬" sub="From TMDB + ML models" color="white" />
        <StatBlock label="Recommendations Served" value="2.4M" icon="🤖" sub="↑ 18% this month" color="var(--success-accent)" />
        <StatBlock label="Avg AI Accuracy" value="94.2%" icon="🎯" sub="↑ 2.1% from last month" color="var(--success-accent)" />
        <StatBlock label="Active Sessions" value="1,284" icon="🟢" sub="Right now" color="#10B981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, marginBottom: 40 }}>
        {/* Most Watched Movies */}
        <div className="admin-table-card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🏆 Most Watched Movies</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Views</th>
                <th>IMDb</th>
              </tr>
            </thead>
            <tbody>
              {MOST_WATCHED.map(m => (
                <tr key={m.rank}>
                  <td style={{ fontWeight: 800, color: m.rank === 1 ? '#FBBF24' : 'var(--text-muted)' }}>#{m.rank}</td>
                  <td style={{ fontWeight: 600 }}>{m.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{m.views.toLocaleString()}</td>
                  <td style={{ color: '#FBBF24', fontWeight: 700 }}>⭐ {m.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trending Genres */}
        <div className="admin-table-card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📊 Trending Genres</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TRENDING_GENRES.map(g => (
              <div key={g.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{g.count.toLocaleString()} views</span>
                    <span style={{ color: 'var(--success-accent)', fontWeight: 700, fontSize: 13 }}>{g.trend}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#27272A', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(g.count / 3500) * 100}%`, background: g.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>👥 Recent Users</h2>
          <button className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 18px' }}>View All →</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Films Watched</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12
                    }}>
                      {u.name[0]}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.watched}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.joined}</td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                    background: u.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(113,113,122,0.15)',
                    color: u.status === 'Active' ? 'var(--success-accent)' : 'var(--text-muted)'
                  }}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
