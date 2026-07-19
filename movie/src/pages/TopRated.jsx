import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

export default function TopRated({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all-time');

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const res = await api.getTopRatedMovies();
        setMovies(res.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, [filterMode]);

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* Header and Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>⭐ Top Rated</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>The highest-rated cinematic masterpieces of all time.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid var(--card-border)' }}>
          {['all-time', 'this-year', 'by-genre'].map(f => (
            <button
              key={f}
              onClick={() => setFilterMode(f)}
              style={{
                background: filterMode === f ? '#6366F1' : 'transparent',
                color: filterMode === f ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 44, animation: 'pulse 1.5s infinite' }}>⭐</div>
          <p style={{ marginTop: 12 }}>Loading masterpieces...</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
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
          {movies.length === 0 && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>No movies found.</div>
          )}
        </div>
      )}
    </div>
  );
}
