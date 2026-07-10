import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

export default function Watchlist({ favorites, watchlist, onSelectMovie, onFavorite, onWatchlist }) {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const promises = watchlist.map(id => api.getMovieDetails(id).catch(() => null));
      const res = await Promise.all(promises);
      setWatchlistMovies(res.filter(Boolean).map(r => r.movie || r.data || r));
      setLoading(false);
    };
    load();
  }, [watchlist]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>📺 Watchlist</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{watchlistMovies.length} movies queued up to watch</p>
      </div>
      {watchlistMovies.length > 0 ? (
        <div className="movie-grid">
          {watchlistMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              onFavorite={onFavorite}
              onWatchlist={onWatchlist}
              isFavorited={favorites.includes(movie.id)}
              isWatchlisted={watchlist.includes(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>📺</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your watchlist is empty</h3>
          <p>Add movies to your watchlist to watch them later!</p>
        </div>
      )}
    </div>
  );
}
