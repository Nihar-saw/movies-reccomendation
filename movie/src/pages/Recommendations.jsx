import { useState, useEffect, useCallback } from 'react';
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
  if (total === 0) return <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>No genre data yet.</div>;
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
        <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{total}</text>
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

const GENRE_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

export default function Recommendations({ onSelectMovie, user, favorites, watchlist, history, onFavorite, onWatchlist }) {
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRec, setActiveRec] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch personalized recommendations — re-runs whenever refreshKey changes (triggered by user interactions)
  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getPersonalizedRecommendations();
      const recs = result.recommendations || [];
      setPersonalizedRecs(recs);
      if (recs.length > 0) setActiveRec(recs[0]);
    } catch (err) {
      console.error('Failed to load personalized recommendations:', err);
      // Fallback: try legacy recommendations
      try {
        const simple = await api.getRecommendations('Interstellar');
        const simpleData = simple.data || simple.results || simple || [];
        const simpleArr = Array.isArray(simpleData) ? simpleData : [];
        setPersonalizedRecs(simpleArr);
        if (simpleArr.length > 0) setActiveRec(simpleArr[0]);
      } catch (e2) {
        console.error('Fallback recommendations also failed:', e2);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations, refreshKey]);

  // Auto-refresh when watchlist/favorites/history changes
  const prevWatchlistLen = useState(watchlist?.length || 0);
  const prevFavoritesLen = useState(favorites?.length || 0);
  const prevHistoryLen = useState(history?.length || 0);

  useEffect(() => {
    const wl = watchlist?.length || 0;
    const fl = favorites?.length || 0;
    const hl = history?.length || 0;
    if (wl !== prevWatchlistLen[0] || fl !== prevFavoritesLen[0] || hl !== prevHistoryLen[0]) {
      prevWatchlistLen[0] = wl;
      prevFavoritesLen[0] = fl;
      prevHistoryLen[0] = hl;
      // Debounce the refresh by 2 seconds to let backend process the vector update
      const timer = setTimeout(() => setRefreshKey(k => k + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [watchlist?.length, favorites?.length, history?.length]);

  // Build dynamic stats from real data
  const watchCount = history?.length || 0;
  const favCount = favorites?.length || 0;
  const watchlistCount = watchlist?.length || 0;
  const hoursWatched = Math.round(watchCount * 2.1);

  // Build genre breakdown from personalized recs
  const genreCounts = {};
  personalizedRecs.forEach(rec => {
    const genres = rec.genres || [];
    genres.forEach(g => {
      const name = typeof g === 'string' ? g : g.name;
      if (name) genreCounts[name] = (genreCounts[name] || 0) + 1;
    });
  });
  const genreSegments = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value], i) => ({ label, value, color: GENRE_COLORS[i % GENRE_COLORS.length] }));

  const STATS = [
    { label: 'Movies Watched', value: watchCount, icon: '🎬', trend: 'From history' },
    { label: 'Favorites', value: favCount, icon: '❤️', trend: 'Saved' },
    { label: 'Watchlist', value: watchlistCount, icon: '📋', trend: 'Queued' },
    { label: 'Hours Watched', value: `${hoursWatched}h`, icon: '⏱️', trend: 'Estimated' },
    { label: 'AI Picks', value: personalizedRecs.length, icon: '🤖', trend: 'Personalized' },
  ];

  const WEEK_DATA = [
    { label: 'Mon', value: Math.max(0.5, watchCount * 0.3) },
    { label: 'Tue', value: Math.max(0.5, watchCount * 0.6) },
    { label: 'Wed', value: Math.max(0.5, watchCount * 0.2) },
    { label: 'Thu', value: Math.max(0.5, watchCount * 0.4) },
    { label: 'Fri', value: Math.max(0.5, watchCount * 0.8) },
    { label: 'Sat', value: Math.max(0.5, watchCount * 1.1) },
    { label: 'Sun', value: Math.max(0.5, watchCount * 0.6) },
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
          <DonutChart segments={genreSegments} />
        </div>
      </div>

      {/* AI Recommendation Feature */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🤖</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>Generating personalized recommendations...</div>
        </div>
      )}

      {!loading && activeRec && (
        <div style={{ marginBottom: 48 }}>
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 24, fontWeight: 700 }}>✨ Top AI Pick For You</h2>
          <div className="ai-hub-container">
            {/* Left: Movie Detail with Match */}
            <div className="ai-recommendation-hero">
              <div style={{ display: 'flex', gap: 28 }}>
                <div style={{
                  width: 140, height: 210, borderRadius: 'var(--radius-lg)',
                  backgroundImage: `url(${activeRec.poster || activeRec.posterPath || ''})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)'
                }} />
                <div style={{ flex: 1 }}>
                  <div className="match-circle-container" style={{ marginBottom: 16 }}>
                    <div className="match-circle" style={{ background: `conic-gradient(var(--success-accent) ${activeRec.match || 0}%, #27272A 0)` }}>
                      <div className="match-circle-inner">{activeRec.match || 0}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>AI Match Score</div>
                      <div style={{ color: 'var(--success-accent)', fontWeight: 700 }}>
                        {(activeRec.match || 0) >= 80 ? 'Excellent Match' : (activeRec.match || 0) >= 60 ? 'Good Match' : 'Possible Match'}
                      </div>
                    </div>
                  </div>
                  <div className="match-info-title">{activeRec.title}</div>
                  <div className="match-info-meta" style={{ marginBottom: 16 }}>
                    {(activeRec.genres || []).slice(0, 3).join(' • ')} • {(activeRec.release_date || activeRec.releaseDate || '').slice(0, 4)}
                  </div>
                  <button className="btn btn-primary" onClick={() => onSelectMovie(activeRec)} style={{ fontSize: 14 }}>
                    View Details
                  </button>
                </div>
              </div>

              {/* AI-Generated Reason */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Why CineAI Recommends This
                </div>
                <div className="ai-reason-list">
                  <div className="ai-reason-item">
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      🤖 {activeRec.reason || 'Based on your watchlist and preferences.'}
                    </span>
                  </div>
                  {activeRec.genres && (
                    <div className="ai-reason-item">
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                        ✔ Matches your preference for {(activeRec.genres || []).slice(0, 2).join(' & ')}
                      </span>
                    </div>
                  )}
                  <div className="ai-reason-item">
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      ✔ {activeRec.match >= 80 ? 'Highly rated by users with similar taste' : 'Aligns with your viewing patterns'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Recommendation Picker */}
            <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-xl)', padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>More AI Picks</div>
              {personalizedRecs.slice(0, 8).map((movie, i) => (
                <div
                  key={movie.movieId || i}
                  onClick={() => setActiveRec(movie)}
                  style={{
                    display: 'flex', gap: 14, padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    background: activeRec?.movieId === movie.movieId ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeRec?.movieId === movie.movieId ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                  }}
                >
                  <div style={{
                    width: 44, height: 64, borderRadius: 8, flexShrink: 0,
                    backgroundImage: `url(${movie.poster || movie.posterPath || ''})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    background: movie.poster ? undefined : '#27272A'
                  }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(movie.genres || []).slice(0, 2).join(' • ')}</div>
                    <div style={{ fontSize: 12, color: 'var(--success-accent)', fontWeight: 700, marginTop: 4 }}>
                      🤖 {movie.match || 0}% match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && personalizedRecs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎬</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No Personalized Recommendations Yet</h3>
          <p>Add movies to your watchlist, favorite some films, or watch more movies to get personalized AI recommendations!</p>
        </div>
      )}

      {/* Full Grid of Recommendations */}
      {personalizedRecs.length > 0 && (
        <div className="section-container">
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 22, fontWeight: 700 }}>🎯 All Personalized Picks</h2>
          <div className="movie-grid">
            {personalizedRecs.map(movie => (
              <MovieCard
                key={movie.movieId}
                movie={{
                  ...movie,
                  id: movie.movieId,
                  poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null,
                  vote_average: movie.vote_average,
                  matchScore: movie.match,
                  confidence: (movie.match || 0) / 100,
                }}
                onSelect={onSelectMovie}
                onFavorite={onFavorite}
                onWatchlist={onWatchlist}
                isFavorited={favorites.includes(movie.movieId)}
                isWatchlisted={watchlist.includes(movie.movieId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
