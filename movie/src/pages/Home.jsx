import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const SECTIONS = [
  { id: 'trending', label: '🔥 Trending Now' },
  { id: 'popular', label: '🏆 Popular Movies' },
  { id: 'topRated', label: '⭐ Top Rated' },
  { id: 'upcoming', label: '🎬 Upcoming Releases' },
];

export default function Home({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist, history = [], user, movies: allMovies = [], onRemoveHistory, setActiveView }) {
  const [movies, setMovies] = useState({});

  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllMovies = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          api.getTrendingMovies(),
          api.getPopularMovies(),
          api.getTopRatedMovies(),
          api.getUpcomingMovies(),
        ]);

        const trendingResults = trending.results || trending || [];
        const popularResults = popular.results || popular || [];
        const topRatedResults = topRated.results || topRated || [];
        const upcomingResults = upcoming.results || upcoming || [];

        setMovies({
          trending: trendingResults,
          popular: popularResults,
          topRated: topRatedResults,
          upcoming: upcomingResults,
        });

        if (trendingResults.length > 0) {
          setHeroMovie(trendingResults[0]);
        } else if (popularResults.length > 0) {
          setHeroMovie(popularResults[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies from server.');
      } finally {
        setLoading(false);
      }
    };
    loadAllMovies();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ flex: '0 0 200px', height: 300 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>⚠️</div>
        <h2>Connection Error</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  const backdrop = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : heroMovie?.backdropPath || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400';

  return (
    <div className="page-container" style={{ paddingTop: 32 }}>
      <div className="dashboard-grid">
        {/* Row 1: Hero and Stats */}
        {heroMovie && (
          <div className="dash-card hero-widget" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="hero-backdrop" style={{ backgroundImage: `url(${backdrop})`, position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #09090B 10%, rgba(9,9,11,0.8) 40%, transparent 100%)' }} />
            <div className="hero-content" style={{ position: 'relative', zIndex: 10, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: '60%' }}>
              <div className="hero-tagline" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: 20, display: 'inline-block', alignSelf: 'flex-start', marginBottom: 16, fontSize: 12, fontWeight: 600 }}>⭐ Top Pick For You</div>
              <h1 className="hero-title" style={{ fontSize: 42, fontWeight: 800, marginBottom: 12 }}>{heroMovie.title}</h1>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>{heroMovie.release_date?.substring(0, 4) || '2023'}</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>Sci-Fi</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>PG-13</span>
              </div>
              <p style={{ maxWidth: '100%', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 30, lineHeight: 1.6 }}>{heroMovie.overview ? heroMovie.overview.slice(0, 120) + '...' : ''}</p>
              <div style={{ display: 'flex', gap: 16 }}>
                <button className="btn btn-primary" onClick={() => onSelectMovie(heroMovie)}>▶ Watch Trailer</button>
                <button className="btn btn-secondary" onClick={() => onWatchlist(heroMovie.id || heroMovie.movieId)}>+ Watchlist</button>
                <button className="btn btn-secondary" style={{ padding: '14px' }}>🤍</button>
              </div>
            </div>
          </div>
        )}

        <div className="dash-card stat-widget bg-purple-light">
          <div>
            <div className="stat-header">
              <span className="stat-icon">👁️</span>
            </div>
            <div className="stat-value">{history.length}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Movies Watched</div>
            <div className="stat-footer trend-up">Keep it up!</div>
          </div>
          <svg style={{ width: '100%', height: 40, marginTop: 20 }} viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 30 Q 25 10, 50 20 T 100 10" fill="none" stroke="#8B5CF6" strokeWidth="3" />
          </svg>
        </div>

        <div className="dash-card stat-widget bg-yellow-light">
          <div>
            <div className="stat-header">
              <span className="stat-icon">👥</span>
            </div>
            <div className="stat-value">{favorites.length}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your Favorites</div>
            <div className="stat-footer trend-up">Love these!</div>
          </div>
          <svg style={{ width: '100%', height: 40, marginTop: 20 }} viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 20 Q 25 30, 50 15 T 100 25" fill="none" stroke="#EAB308" strokeWidth="3" />
          </svg>
        </div>

        <div className="dash-card stat-widget bg-green-light" style={{ gridColumn: '4', gridRow: '1 / span 2' }}>
          <div>
            <div className="stat-header">
              <span className="stat-icon">⭐</span>
            </div>
            <div className="stat-value">{watchlist.length}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Watchlist Items</div>
            <div className="stat-footer trend-up">To watch</div>
          </div>
          <svg style={{ width: '100%', height: '100px', marginTop: 'auto' }} viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 35 L 20 25 L 40 30 L 60 10 L 80 15 L 100 5" fill="none" stroke="#10B981" strokeWidth="3" />
          </svg>
        </div>

        {/* Row 2 */}
        {/* Continue Watching */}
        <div className="dash-card wide-widget bg-dark-card" style={{ gridColumn: '1 / span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Continue Watching</h3>
            <span style={{ fontSize: 12, color: '#8B5CF6', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('history')}>View all</span>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 10 }}>
            {history.length > 0 ? history.slice(0, 4).map(m => (
              <div key={m.id || m.movieId} style={{ flexShrink: 0, width: 110, cursor: 'pointer', position: 'relative' }} onClick={() => onSelectMovie(m)}>
                <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, background: 'rgba(0,0,0,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99, fontSize: 10 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveHistory && onRemoveHistory(m.id || m.movieId); }}>✖</div>
                <div style={{ height: 160, background: '#27272A', borderRadius: 12, marginBottom: 8, position: 'relative', backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.posterPath || m.poster_path})`, backgroundSize: 'cover' }}>
                   <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', paddingLeft: 3 }}>▶</div>
                   </div>
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#3F3F46', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' }}>
                     <div style={{ height: '100%', width: `${m.progress || 60}%`, background: '#8B5CF6' }} />
                   </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.progress || 60}%</div>
              </div>
            )) : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No watch history yet.</div>}
          </div>
        </div>

        <div className="dash-card stat-widget bg-purple-pale">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <div>
               <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#2A2563' }}>Hours Watched<br/>Total</div>
               <div style={{ background: '#1C1942', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 11, display: 'inline-block' }}>{Math.floor((history.length * 120) / 60)}h {(history.length * 120) % 60}m</div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: 24, fontWeight: 800, color: '#2A2563' }}>4.93%</div>
               <div className="trend-down" style={{ fontSize: 12 }}>↓ -2.3%</div>
             </div>
          </div>
          <div style={{ marginTop: 20, height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L0 80 Q 25 50, 50 70 T 100 40 L 100 100 Z" fill="rgba(139, 92, 246, 0.2)" />
               <path d="M0 80 Q 25 50, 50 70 T 100 40" fill="none" stroke="#8B5CF6" strokeWidth="3" />
             </svg>
          </div>
        </div>

        {/* Row 3 */}
        {/* Trending This Week */}
        <div className="dash-card bg-dark-card" style={{ gridColumn: '1 / span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Trending This Week</h3>
            <span style={{ fontSize: 12, color: '#8B5CF6', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('discover')}>View all</span>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
            {movies.trending?.slice(0, 5).map((m, i) => (
              <div key={m.id || m.movieId} onClick={() => onSelectMovie(m)} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0, width: 110, height: 160, borderRadius: 12, overflow: 'hidden', backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, backgroundSize: 'cover' }}>
                 <div style={{ position: 'absolute', top: -6, left: -6, width: 28, height: 28, background: '#8B5CF6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: 'white', border: '3px solid #13131A' }}>{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card bg-green-light" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0C3823' }}>AI Assistant</div>
            <div style={{ fontSize: 10, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}/> Online</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
            <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 12, fontSize: 12, marginBottom: 16, color: '#0C3823', flex: 1 }}>
              Hi {user?.name ? user.name.split(' ')[0] : 'there'}! I can help you find the perfect movie for your mood. What are you in the mood for?
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
             <span style={{ background: 'rgba(16,185,129,0.2)', padding: '6px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, color: '#0C3823' }}>Mind-bending Sci-Fi</span>
             <span style={{ background: 'rgba(16,185,129,0.2)', padding: '6px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, color: '#0C3823' }}>Emotional Movies</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" placeholder="Ask me anything..." style={{ flex: 1, border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, outline: 'none', background: 'rgba(255,255,255,0.7)', color: '#0C3823' }} />
            <button style={{ background: '#8B5CF6', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>↗</button>
          </div>
        </div>

        <div className="dash-card bg-dark-card" style={{ gridColumn: '4' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
             <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your Watchlist</h3>
             <span style={{ fontSize: 12, color: '#8B5CF6', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('watchlist')}>View all</span>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
             {watchlist.length > 0 ? allMovies.filter(m => watchlist.includes(m.id || m.movieId)).slice(0, 3).map((m, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onSelectMovie(m)}>
                 <div style={{ width: 40, height: 56, background: '#27272A', borderRadius: 6, backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, backgroundSize: 'cover' }} />
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 140 }}>{m.title}</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.release_date?.substring(0,4)}</div>
                 </div>
                 <div style={{ color: '#8B5CF6' }} onClick={(e) => { e.stopPropagation(); onWatchlist(m.id || m.movieId); }}>🔖</div>
               </div>
             )) : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your watchlist is empty.</div>}
           </div>
        </div>
      </div>
      
      {/* Premium Banner */}
      <div style={{ background: 'linear-gradient(to right, #2A1D3C, #1C1C24)', borderRadius: 20, padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(139, 92, 246, 0.2)', marginTop: -10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
           <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⭐</div>
           <div>
             <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Unlock Premium Benefits</h2>
             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>Get unlimited AI recommendations, advanced filters, early access and more.</p>
           </div>
        </div>
        <button style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', color: 'white', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>⭐ Upgrade to Premium</button>
      </div>
    </div>
  );
}

