import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const GENRES = [
  { id: 'sci-fi', name: 'Science Fiction', emoji: '🚀', color: '#6366F1' },
  { id: 'thriller', name: 'Thriller', emoji: '🎭', color: '#8B5CF6' },
  { id: 'drama', name: 'Drama', emoji: '🎬', color: '#10B981' },
  { id: 'action', name: 'Action', emoji: '💥', color: '#F59E0B' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍', color: '#EF4444' },
  { id: 'romance', name: 'Romance', emoji: '❤️', color: '#EC4899' },
  { id: 'comedy', name: 'Comedy', emoji: '😂', color: '#14B8A6' },
  { id: 'horror', name: 'Horror', emoji: '👻', color: '#7C3AED' },
];

export default function Discover({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const result = await api.getTrendingMovies();
        const all = result.results || result;
        const filtered = selectedGenre
          ? all.filter(m => (m.genres || []).some(g => g.toLowerCase().includes(selectedGenre.toLowerCase())))
          : all;
        setMovies(filtered.length > 0 ? filtered : all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [selectedGenre]);

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
            onClick={() => setSelectedGenre(null)}
            style={{
              padding: '18px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid',
              borderColor: !selectedGenre ? 'var(--primary-accent)' : 'var(--card-border)',
              background: !selectedGenre ? 'rgba(99,102,241,0.15)' : 'var(--card-color)',
              color: !selectedGenre ? 'white' : 'var(--text-secondary)',
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
              onClick={() => setSelectedGenre(genre.name)}
              style={{
                padding: '18px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid',
                borderColor: selectedGenre === genre.name ? genre.color : 'var(--card-border)',
                background: selectedGenre === genre.name ? `${genre.color}20` : 'var(--card-color)',
                color: selectedGenre === genre.name ? 'white' : 'var(--text-secondary)',
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
        {selectedGenre ? `${selectedGenre} Movies` : 'All Movies'}
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
