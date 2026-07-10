import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const GENRES = [
  { id: 878, name: 'Science Fiction', emoji: '🚀', color: '#6366F1' },
  { id: 53, name: 'Thriller', emoji: '🎭', color: '#8B5CF6' },
  { id: 18, name: 'Drama', emoji: '🎬', color: '#10B981' },
  { id: 28, name: 'Action', emoji: '💥', color: '#F59E0B' },
  { id: 9648, name: 'Mystery', emoji: '🔍', color: '#EF4444' },
  { id: 10749, name: 'Romance', emoji: '❤️', color: '#EC4899' },
  { id: 35, name: 'Comedy', emoji: '😂', color: '#14B8A6' },
  { id: 27, name: 'Horror', emoji: '👻', color: '#7C3AED' },
];

export default function Discover({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const result = await api.getTrendingMovies();
        const all = result.results || result || [];
        const filtered = selectedGenreId
          ? all.filter(m => (m.genre_ids || []).includes(selectedGenreId))
          : all;
        setMovies(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [selectedGenreId]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>
          🎬 Discover Movies
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Explore our curated collection across all genres, powered by AI curation.
        </p>
      </div>

      {/* Genre Pills */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>🎭 Browse by Genre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
          <button
            onClick={() => setSelectedGenreId(null)}
            style={{
              padding: '18px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid',
              borderColor: !selectedGenreId ? 'var(--primary-accent)' : 'var(--card-border)',
              background: !selectedGenreId ? 'rgba(99,102,241,0.15)' : 'var(--card-color)',
              color: !selectedGenreId ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 14,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎞️</div>
            All
          </button>
          {GENRES.map(genre => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenreId(genre.id)}
              style={{
                padding: '18px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid',
                borderColor: selectedGenreId === genre.id ? genre.color : 'var(--card-border)',
                background: selectedGenreId === genre.id ? `${genre.color}20` : 'var(--card-color)',
                color: selectedGenreId === genre.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 14,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{genre.emoji}</div>
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 22 }}>
        {selectedGenreId ? `${GENRES.find(g => g.id === selectedGenreId)?.name} Movies` : 'All Movies'}
        <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500, marginLeft: 12 }}>{movies.length} titles</span>
      </h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 2s infinite' }}>🎬</div>
            <div>Loading amazing movies...</div>
          </div>
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
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p>No movies found for this genre. Try another one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
