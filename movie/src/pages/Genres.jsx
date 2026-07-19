import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const GENRES = [
  { id: 28, name: 'Action', emoji: '💥', color: '#EF4444', count: '1,234' },
  { id: 12, name: 'Adventure', emoji: '🧭', color: '#F59E0B', count: '890' },
  { id: 16, name: 'Animation', emoji: '🎨', color: '#EC4899', count: '542' },
  { id: 35, name: 'Comedy', emoji: '😂', color: '#10B981', count: '1,678' },
  { id: 80, name: 'Crime', emoji: '🕵️', color: '#6366F1', count: '745' },
  { id: 99, name: 'Documentary', emoji: '📹', color: '#14B8A6', count: '788' },
  { id: 18, name: 'Drama', emoji: '🎬', color: '#8B5CF6', count: '2,342' },
  { id: 10751, name: 'Family', emoji: '👨‍👩‍👧', color: '#3B82F6', count: '512' },
  { id: 14, name: 'Fantasy', emoji: '🪄', color: '#A78BFA', count: '622' },
  { id: 36, name: 'History', emoji: '📜', color: '#84CC16', count: '390' },
  { id: 27, name: 'Horror', emoji: '👻', color: '#7C3AED', count: '612' },
  { id: 9648, name: 'Mystery', emoji: '🔍', color: '#EF4444', count: '522' },
  { id: 10749, name: 'Romance', emoji: '❤️', color: '#EC4899', count: '912' },
  { id: 878, name: 'Science Fiction', emoji: '🚀', color: '#6366F1', count: '1,428' },
  { id: 53, name: 'Thriller', emoji: '🎭', color: '#8B5CF6', count: '1,324' },
];

export default function Genres({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGenre) return;
    const fetchGenreMovies = async () => {
      setLoading(true);
      try {
        const res = await api.getDiscoverMovies(selectedGenre.id);
        setMovies(res.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenreMovies();
  }, [selectedGenre]);

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {selectedGenre ? (
        <div>
          <button 
            onClick={() => setSelectedGenre(null)} 
            style={{ 
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)', borderRadius: 10,
              padding: '8px 16px', fontSize: 13, color: 'white', cursor: 'pointer', marginBottom: 20, fontWeight: 700 
            }}
          >
            ← Back to Genres
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>{selectedGenre.emoji}</span>
              {selectedGenre.name} Classics & Hits
            </h1>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{movies.length} matches discovered</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 44, animation: 'pulse 1.5s infinite' }}>🤖</div>
              <p style={{ marginTop: 12 }}>Scanning TMDB library...</p>
            </div>
          ) : (
            <div className="movie-grid">
              {movies.map(m => (
                <MovieCard
                  key={m.id || m.movieId}
                  movie={m}
                  onSelect={onSelectMovie}
                  onFavorite={onFavorite}
                  onWatchlist={onWatchlist}
                  isFavorited={favorites.includes(m.id || m.movieId)}
                  isWatchlisted={watchlist.includes(m.id || m.movieId)}
                />
              ))}
              {movies.length === 0 && (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>No movies found in this genre.</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>🔠 Genres</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Browse and discover movies across all cinematic styles.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {GENRES.map(g => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGenre(g)}
                style={{
                  background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16,
                  padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                }}
                className="genre-hover-card"
              >
                {/* Glow background */}
                <div style={{
                  position: 'absolute', right: -20, bottom: -20, width: 80, height: 80, 
                  background: g.color, filter: 'blur(35px)', opacity: 0.15, pointerEvents: 'none'
                }} />
                
                <div style={{ 
                  width: 44, height: 44, borderRadius: 12, background: `${g.color}15`, border: `1px solid ${g.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 
                }}>
                  {g.emoji}
                </div>
                
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{g.name}</h3>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{g.count} Movies</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
