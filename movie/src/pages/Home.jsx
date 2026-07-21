import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

// --- Radar Chart Component (AI Taste Profile) ---
const RadarChart = ({ data }) => {
  const cx = 70, cy = 70, r = 48;
  const n = data.length;
  if (n === 0) return <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Add movies to build profile.</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (d.value / max) * r;
    return { x: cx + val * Math.cos(angle), y: cy + val * Math.sin(angle), label: d.label, lx: cx + (r + 14) * Math.cos(angle), ly: cy + (r + 14) * Math.sin(angle) };
  });
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {[0.3, 0.6, 1].map((lv, li) => (
        <polygon key={li} points={data.map((_, i) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return `${cx + r * lv * Math.cos(a)},${cy + r * lv * Math.sin(a)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(99,102,241,0.2)" stroke="#6366F1" strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#6366F1" />)}
      {points.map((p, i) => <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600">{p.label}</text>)}
    </svg>
  );
};

// --- Confidence Breakdown ---
const ConfidenceBreakdown = () => {
  const items = [
    { label: 'Content Similarity', value: 40, color: '#6366F1' },
    { label: 'Collaborative Score', value: 30, color: '#8B5CF6' },
    { label: 'Popularity', value: 15, color: '#10B981' },
    { label: 'Personal Preference', value: 15, color: '#F59E0B' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 100, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${it.value}%`, background: it.color }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: it.color, width: 28, textAlign: 'right' }}>{it.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function Home({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist, history = [], user, movies: allMovies = [], onRemoveHistory, setActiveView }) {
  const [movies, setMovies] = useState({});
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllMovies = async (isInitial = false) => {
    const isInit = isInitial === true;
    setLoading(true);
    setError(null);
    try {
      const page = isInit ? 1 : Math.floor(Math.random() * 10) + 1;
      const [trending, popular, topRated, upcoming] = await Promise.all([
        api.getTrendingMovies(page),
        api.getPopularMovies(page),
        api.getTopRatedMovies(page),
        api.getUpcomingMovies(page),
      ]);
      const trendingResults = trending.results || trending || [];
      setMovies({
        trending: trendingResults,
        popular: popular.results || popular || [],
        topRated: topRated.results || topRated || [],
        upcoming: upcoming.results || upcoming || [],
      });
      if (trendingResults.length > 0) {
        const index = isInit ? 0 : Math.floor(Math.random() * trendingResults.length);
        setHeroMovie(trendingResults[index]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch movies from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMovies(true);
  }, []);

  // Build taste profile data from favorites/watchlist genres
  const genreCounts = {};
  allMovies.filter(m => watchlist.includes(m.id || m.movieId)).forEach(m => (m.genre_ids || []).forEach(g => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  }));
  const radarData = Object.entries(genreCounts).slice(0, 5).map(([label, value]) => ({ label: `Genre ${label}`, value }));
  const dummyRadarData = [
    { label: 'Sci-Fi', value: 45 },
    { label: 'Action', value: 30 },
    { label: 'Drama', value: 20 },
    { label: 'Adventure', value: 35 },
    { label: 'Mystery', value: 10 },
  ];

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ flex: '0 0 200px', height: 300 }} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>⚠️</div>
        <h2>Connection Error</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error}</p>
        <button className="btn btn-primary" onClick={loadAllMovies} style={{ padding: '12px 28px' }}>
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  const backdrop = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : heroMovie?.backdropPath || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400';

  const cardStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, overflow: 'hidden' };

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* Dashboard Header with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Movie Lover'} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Here's your personalized dashboard
          </p>
        </div>
        <button
          onClick={loadAllMovies}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 8, transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
          {loading ? 'Refreshing...' : 'Refresh Movies'}
        </button>
      </div>

      {/* ROW 1: Hero Widget + AI Taste Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Hero Widget */}
        {heroMovie && (
          <div style={{ ...cardStyle, position: 'relative', height: 320, padding: 0 }}>
            <div style={{ backgroundImage: `url(${backdrop})`, position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #09090B 10%, rgba(9,9,11,0.8) 50%, transparent 100%)' }} />
            <div style={{ position: 'relative', zIndex: 10, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: '65%' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 20, display: 'inline-block', alignSelf: 'flex-start', marginBottom: 12, fontSize: 10, fontWeight: 700 }}>Your Next Favorite Movie</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>{heroMovie.title}</h1>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{heroMovie.release_date?.substring(0, 4) || '2024'}</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>Sci-Fi</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>Adventure</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.5 }}>{heroMovie.overview ? heroMovie.overview.slice(0, 100) + '...' : ''}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => onSelectMovie(heroMovie)}>▶ Watch Trailer</button>
                <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => onWatchlist(heroMovie.id || heroMovie.movieId)}>+ Add to Watchlist</button>
                <button onClick={() => onFavorite(heroMovie.id || heroMovie.movieId)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
                  {favorites.includes(heroMovie.id || heroMovie.movieId) ? '❤️' : '🤍'}
                </button>
              </div>
              {/* Score Badge */}
              <div style={{ position: 'absolute', right: -90, top: 40, width: 70, height: 70, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '2px solid #6366F1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#6366F1' }}>98%</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Match</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Taste Profile */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>AI Taste Profile</span>
            <span style={{ fontSize: 11, color: '#6366F1', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('profile')}>View all</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <RadarChart data={radarData.length > 3 ? radarData : dummyRadarData} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sci-Fi</span><strong>35%</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Thriller</span><strong>25%</strong></div>
          </div>
        </div>
      </div>

      {/* ROW 2: Continue Watching + Recommendation Confidence + Watchlist */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Continue Watching */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Continue Watching</span>
            <span style={{ fontSize: 11, color: '#6366F1', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('history')}>View all</span>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
            {history.length > 0 ? history.slice(0, 4).map(m => (
              <div key={m.id || m.movieId} style={{ flexShrink: 0, width: 100, cursor: 'pointer', position: 'relative' }} onClick={() => onSelectMovie(m)}>
                <div style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, background: 'rgba(0,0,0,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99, fontSize: 10 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveHistory && onRemoveHistory(m.id || m.movieId); }}>✖</div>
                <div style={{ height: 130, borderRadius: 10, backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.posterPath || m.poster_path})`, backgroundSize: 'cover', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#27272A' }}>
                    <div style={{ height: '100%', width: `${m.progress || 60}%`, background: '#6366F1' }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.progress || 60}% completed</div>
              </div>
            )) : <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '20px 0' }}>No watch history yet.</div>}
          </div>
        </div>

        {/* Recommendation Confidence */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Recommendation Confidence</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#6366F1' }}>97%</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>AI Confidence</span>
          </div>
          <ConfidenceBreakdown />
        </div>

        {/* Watchlist */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Watchlist</span>
            <span style={{ fontSize: 11, color: '#6366F1', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('watchlist')}>View all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 150 }}>
            {watchlist.length > 0 ? allMovies.filter(m => watchlist.includes(m.id || m.movieId)).slice(0, 3).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => onSelectMovie(m)}>
                <div style={{ width: 30, height: 42, borderRadius: 4, backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, backgroundSize: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{m.release_date?.substring(0, 4)}</div>
                </div>
                <div style={{ color: '#6366F1', fontSize: 12 }} onClick={(e) => { e.stopPropagation(); onWatchlist(m.id || m.movieId); }}>🔖</div>
              </div>
            )) : <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Your watchlist is empty.</div>}
          </div>
        </div>
      </div>

      {/* ROW 3: Stats Row (Bottom) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { value: '57K+', label: 'Happy Users', icon: '😊' },
          { value: '4.8M+', label: 'Recommendations', icon: '🚀' },
          { value: '96%', label: 'AI Match Accuracy', icon: '🤖' },
          { value: '10K+', label: 'Movies Analyzed', icon: '🎬' },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
