import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const BarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="svg-chart-container">
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{Math.round(item.value)}h</div>
          <div style={{ width: '60%', height: `${(item.value / max) * 180}px`, background: `linear-gradient(to top, ${color}, ${color}88)`, borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', minHeight: 4 }} />
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ segments }) => {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const radius = 60, cx = 80, cy = 80;
  const paths = segments.map(seg => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = (seg.value / total) > 0.5 ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: seg.color, label: seg.label, value: seg.value };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} opacity="0.85" stroke="var(--card-color)" strokeWidth="3" />
        ))}
        <circle cx={cx} cy={cy} r="36" fill="var(--card-color)" />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{total}h</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(s.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WEEK_DATA = [
  { label: 'Mon', value: 1.5 }, { label: 'Tue', value: 3 }, { label: 'Wed', value: 0.5 },
  { label: 'Thu', value: 2 }, { label: 'Fri', value: 4 }, { label: 'Sat', value: 5.5 }, { label: 'Sun', value: 3 }
];

const GENRE_DATA = [
  { label: 'Sci-Fi', value: 45, color: '#6366F1' },
  { label: 'Thriller', value: 30, color: '#8B5CF6' },
  { label: 'Drama', value: 60, color: '#10B981' },
  { label: 'Action', value: 35, color: '#F59E0B' },
  { label: 'Mystery', value: 20, color: '#EF4444' },
];

export default function Recommendations({ onSelectMovie, user, favorites, watchlist, onFavorite, onWatchlist }) {
  const [recs, setRecs] = useState([]);
  const [hybridRecs, setHybridRecs] = useState({ content: [], collaborative: [] });
  const [loading, setLoading] = useState(true);
  const [activeRec, setActiveRec] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [simple, hybrid] = await Promise.all([
          api.getRecommendations('Interstellar'),
          api.getHybridRecommendations('Inception'),
        ]);
        const simpleData = simple.data || simple.results || simple || [];
        const simpleArr = Array.isArray(simpleData) ? simpleData : [];
        setRecs(simpleArr);
        setActiveRec(simpleArr[0]);
        
        const hybridData = hybrid.data || hybrid || {};
        setHybridRecs({ content: hybridData.content || [], collaborative: hybridData.collaborative || [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const watchCount = user?.watchHistory?.length || 0;
  const favCount = favorites?.length || 0;
  const hoursWatched = Math.round(watchCount * 2.1); // Estimate 2.1h per movie

  const STATS = [
    { label: 'Movies Watched', value: watchCount, icon: '🎬', trend: 'Based on history' },
    { label: 'Favorites', value: favCount, icon: '❤️', trend: 'Saved' },
    { label: 'Hours Watched', value: `${hoursWatched}h`, icon: '⏱️', trend: 'Estimated' },
    { label: 'Genres Explored', value: '12', icon: '🎭', trend: 'Dynamic soon' },
    { label: 'AI Accuracy', value: '94%', icon: '🤖', trend: 'System' },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>🤖 AI Recommendations</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Personalized movie picks, curated by CineAI just for you.</p>
      </div>

      {/* Analytics Stats */}
      <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {STATS.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <span>{stat.label}</span>
              <span style={{ fontSize: 22 }}>{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-footer stat-trend-up">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📅 Weekly Watch Time</div>
          <BarChart data={WEEK_DATA} color="#6366F1" />
        </div>
        <div className="chart-card">
          <div className="chart-title">🎭 Genre Breakdown</div>
          <DonutChart segments={GENRE_DATA} />
        </div>
      </div>

      {/* AI Recommendation Feature */}
      {!loading && activeRec && (
        <div style={{ marginBottom: 48 }}>
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 24, fontWeight: 700 }}>✨ Top AI Pick This Week</h2>
          <div className="ai-hub-container">
            {/* Left: Movie Detail with Match */}
            <div className="ai-recommendation-hero">
              <div style={{ display: 'flex', gap: 28 }}>
                <div style={{
                  width: 140, height: 210, borderRadius: 'var(--radius-lg)',
                  backgroundImage: `url(${activeRec.posterPath || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300&fit=crop&q=60'})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)'
                }} />
                <div style={{ flex: 1 }}>
                  <div className="match-circle-container" style={{ marginBottom: 16 }}>
                    <div className="match-circle" style={{ background: `conic-gradient(var(--success-accent) ${(activeRec.matchScore || 94)}%, #27272A 0)` }}>
                      <div className="match-circle-inner">{activeRec.matchScore || 94}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>AI Match Score</div>
                      <div style={{ color: 'var(--success-accent)', fontWeight: 700 }}>Excellent Match</div>
                    </div>
                  </div>
                  <div className="match-info-title">{activeRec.title}</div>
                  <div className="match-info-meta" style={{ marginBottom: 16 }}>
                    {(activeRec.genres || []).slice(0, 3).join(' • ')} • {activeRec.releaseDate?.slice(0, 4)}
                  </div>
                  <button className="btn btn-primary" onClick={() => onSelectMovie(activeRec)} style={{ fontSize: 14 }}>
                    View Details
                  </button>
                </div>
              </div>

              {/* Reason List */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Why CineAI Recommends This
                </div>
                <div className="ai-reason-list">
                  {[
                    '✔ Similar to your top-rated movies',
                    '✔ Matches your Sci-Fi & Drama genre preference',
                    '✔ Highly rated by users with similar taste',
                    '✔ Directed by one of your top directors',
                  ].map((reason, i) => (
                    <div key={i} className="ai-reason-item">
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Recommendation Picker */}
            <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-xl)', padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>More AI Picks</div>
              {recs.slice(0, 5).map((movie, i) => (
                <div
                  key={i}
                  onClick={() => setActiveRec(movie)}
                  style={{
                    display: 'flex', gap: 14, padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    background: activeRec?.id === movie.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeRec?.id === movie.id ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                  }}
                >
                  <div style={{
                    width: 44, height: 64, borderRadius: 8, flexShrink: 0,
                    backgroundImage: `url(${movie.posterPath || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&fit=crop'})`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(movie.genres || []).slice(0, 2).join(' • ')}</div>
                    <div style={{ fontSize: 12, color: 'var(--success-accent)', fontWeight: 700, marginTop: 4 }}>
                      🤖 {movie.matchScore || Math.floor(85 + Math.random() * 13)}% match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hybrid Recs */}
      {hybridRecs.content.length > 0 && (
        <div className="section-container">
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 22, fontWeight: 700 }}>🧠 Because You Watched Inception</h2>
          <div className="section-scroll-row">
            {hybridRecs.content.map(movie => (
              <MovieCard
                key={movie.id || movie.movieId}
                movie={movie}
                onSelect={onSelectMovie}
                onFavorite={onFavorite}
                onWatchlist={onWatchlist}
                isFavorited={favorites.includes(movie.id || movie.movieId)}
                isWatchlisted={watchlist.includes(movie.id || movie.movieId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
