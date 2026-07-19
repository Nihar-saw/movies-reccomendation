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

const TABS = [
  { id: 'popular', label: 'Popular', emoji: '🔥' },
  { id: 'now_playing', label: 'Now Playing', emoji: '🎭' },
  { id: 'upcoming', label: 'Upcoming', emoji: '📅' },
  { id: 'top_rated', label: 'Top Rated', emoji: '⭐' },
];

export default function Discover({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [movies, setMovies] = useState({ popular: [], nowPlaying: [], upcoming: [], topRated: [] });
  const [genreMovies, setGenreMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [pop, np, up, tr] = await Promise.all([
          api.getPopularMovies(),
          api.getTrendingMovies(), // Use trending as now playing fallback
          api.getUpcomingMovies(),
          api.getTopRatedMovies(),
        ]);
        setMovies({
          popular: pop.results || pop || [],
          nowPlaying: np.results || np || [],
          upcoming: up.results || up || [],
          topRated: tr.results || tr || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Fetch genre movies dynamically when selectedGenreId changes
  useEffect(() => {
    if (!selectedGenreId) {
      setGenreMovies([]);
      return;
    }
    const loadGenreMovies = async () => {
      setGenreLoading(true);
      try {
        const result = await api.getDiscoverMovies(selectedGenreId);
        setGenreMovies(result.results || result || []);
      } catch (err) {
        console.error("Genre discover failed:", err);
      } finally {
        setGenreLoading(false);
      }
    };
    loadGenreMovies();
  }, [selectedGenreId]);

  const getFilteredMovies = (list) => {
    return list;
  };

  const currentList = 
    activeTab === 'popular' ? movies.popular :
    activeTab === 'now_playing' ? movies.nowPlaying :
    activeTab === 'upcoming' ? movies.upcoming : movies.topRated;

  const filteredCurrentList = currentList;
  const newReleases = movies.upcoming;

  const cardStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 };

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* Category Tabs (only shown when no genre is selected) */}
      {!selectedGenreId && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--card-border)', paddingBottom: 12 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#6366F1' : 'transparent',
                color: activeTab === t.id ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
              }}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 2s infinite' }}>🎬</div>
          <div>Loading amazing collections...</div>
        </div>
      ) : (
        <>
          {selectedGenreId ? (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                  🌟 {GENRES.find(g => g.id === selectedGenreId)?.name} Classics & Hits
                </h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{genreMovies.length} titles discovered</span>
              </div>
              {genreLoading ? (
                <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14, textAlign: 'center' }}>Searching database...</div>
              ) : (
                <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px 16px' }}>
                  {genreMovies.map(movie => (
                    <MovieCard
                      key={movie.id || movie.movieId}
                      movie={{
                        ...movie,
                        // Ensure cards match standard rendering structure
                        id: movie.id || movie.movieId
                      }}
                      onSelect={onSelectMovie}
                      onFavorite={onFavorite}
                      onWatchlist={onWatchlist}
                      isFavorited={favorites.includes(movie.id || movie.movieId)}
                      isWatchlisted={watchlist.includes(movie.id || movie.movieId)}
                    />
                  ))}
                  {genreMovies.length === 0 && (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>No matches found.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Main Popular Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800 }}>Popular Movies</h2>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{filteredCurrentList.length} matches</span>
                </div>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                  {filteredCurrentList.map(movie => (
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
                  {filteredCurrentList.length === 0 && (
                    <div style={{ color: 'var(--text-muted)', padding: '20px 0', fontSize: 13 }}>No matches in this genre.</div>
                  )}
                </div>
              </div>

              {/* New Releases Section */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800 }}>New Releases</h2>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{newReleases.length} matches</span>
                </div>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                  {newReleases.map(movie => (
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
            </>
          )}

          {/* Genres Grid (Bottom) */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎭 Browse by Genre</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
              <button
                onClick={() => setSelectedGenreId(null)}
                style={{
                  padding: '14px 10px', borderRadius: 12, border: '1px solid',
                  borderColor: !selectedGenreId ? '#6366F1' : 'var(--card-border)',
                  background: !selectedGenreId ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                  color: !selectedGenreId ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 13, transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>🎞️</div>
                All Genres
              </button>
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenreId(genre.id)}
                  style={{
                    padding: '14px 10px', borderRadius: 12, border: '1px solid',
                    borderColor: selectedGenreId === genre.id ? genre.color : 'var(--card-border)',
                    background: selectedGenreId === genre.id ? `${genre.color}20` : 'rgba(255,255,255,0.02)',
                    color: selectedGenreId === genre.id ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 13, transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{genre.emoji}</div>
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
