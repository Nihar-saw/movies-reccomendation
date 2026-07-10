import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const SECTIONS = [
  { id: 'trending', label: '🔥 Trending Now' },
  { id: 'popular', label: '🏆 Popular Movies' },
  { id: 'topRated', label: '⭐ Top Rated' },
  { id: 'upcoming', label: '🎬 Upcoming Releases' },
];

export default function Home({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
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
      {/* Hero Section */}
      {heroMovie && (
        <div className="hero">
          <div className="hero-backdrop" style={{ backgroundImage: `url(${backdrop})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-tagline">
              <span style={{ width: 8, height: 8, background: 'var(--primary-accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Featured Pick
            </div>
            <h1 className="hero-title">{heroMovie.title}</h1>
            <div className="hero-meta">
              <span className="hero-rating">⭐ {heroMovie.vote_average?.toFixed(1) || heroMovie.voteAverage?.toFixed(1) || 'N/A'}</span>
              <span>•</span>
              <span>{heroMovie.release_date ? new Date(heroMovie.release_date).getFullYear() : heroMovie.releaseDate ? new Date(heroMovie.releaseDate).getFullYear() : 'N/A'}</span>
            </div>
            <p className="hero-description">{heroMovie.overview ? heroMovie.overview.slice(0, 140) + '...' : ''}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onSelectMovie(heroMovie)}>
                ▶ View Details
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onWatchlist(heroMovie.id || heroMovie.movieId)}
                style={{ background: watchlist.includes(heroMovie.id || heroMovie.movieId) ? 'rgba(99,102,241,0.2)' : undefined }}
              >
                {watchlist.includes(heroMovie.id || heroMovie.movieId) ? '✓ In Watchlist' : '➕ Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {SECTIONS.map(section => {
        const list = movies[section.id] || [];
        if (list.length === 0) return null;
        return (
          <div key={section.id} className="section-container">
            <div className="section-header">
              <h2 className="section-title">{section.label}</h2>
            </div>
            <div className="section-scroll-row">
              {list.map(movie => (
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
        );
      })}
    </div>
  );
}

