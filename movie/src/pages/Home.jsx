import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const HERO_MOVIE = {
  id: 157336,
  title: "Interstellar",
  overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
  backdropPath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&fit=crop&q=80",
  posterPath: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60",
  genres: ["Sci-Fi", "Drama", "Adventure"],
  releaseDate: "2014-11-07",
  voteAverage: 8.6,
  runtime: 169,
  matchScore: 98,
};

const SECTIONS = [
  { id: 'trending', label: '🔥 Trending Now' },
  { id: 'ai', label: '⭐ AI Picks For You' },
  { id: 'popular', label: '🏆 Top Rated' },
  { id: 'new', label: '🎬 New Releases' },
];

export default function Home({ onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllMovies = async () => {
      try {
        const [trending, popular] = await Promise.all([
          api.getTrendingMovies(),
          api.getPopularMovies(),
        ]);
        const trendingResults = trending.results || trending;
        const popularResults = popular.results || popular;
        setMovies({
          trending: trendingResults,
          ai: [...trendingResults].sort(() => 0.5 - Math.random()),
          popular: popularResults,
          new: [...popularResults].reverse(),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAllMovies();
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: 32 }}>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${HERO_MOVIE.backdropPath})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-tagline">
            <span style={{ width: 8, height: 8, background: 'var(--primary-accent)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI Featured Pick · 98% Match
          </div>
          <h1 className="hero-title">{HERO_MOVIE.title}</h1>
          <div className="hero-meta">
            <span className="hero-rating">⭐ {HERO_MOVIE.voteAverage}</span>
            <span>•</span>
            <span>{new Date(HERO_MOVIE.releaseDate).getFullYear()}</span>
            <span>•</span>
            <span>{Math.floor(HERO_MOVIE.runtime / 60)}h {HERO_MOVIE.runtime % 60}m</span>
            <span>•</span>
            {HERO_MOVIE.genres.map(g => (
              <span key={g} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: 50, fontSize: 12 }}>{g}</span>
            ))}
          </div>
          <p className="hero-description">{HERO_MOVIE.overview.slice(0, 140)}...</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => onSelectMovie(HERO_MOVIE)}>
              ▶ Watch Trailer
            </button>
            <button className="btn btn-secondary" onClick={() => onSelectMovie(HERO_MOVIE)}>
              🤖 AI Recommendations
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onWatchlist(HERO_MOVIE.id)}
              style={{ background: watchlist.includes(HERO_MOVIE.id) ? 'rgba(99,102,241,0.2)' : undefined }}
            >
              {watchlist.includes(HERO_MOVIE.id) ? '📺 In Watchlist' : '➕ Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {loading ? (
        <div style={{ display: 'flex', gap: 20 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: '0 0 200px', height: 300, borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(90deg, #18181B 25%, #27272A 50%, #18181B 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear'
            }} />
          ))}
        </div>
      ) : (
        SECTIONS.map(section => (
          <div key={section.id} className="section-container">
            <div className="section-header">
              <h2 className="section-title">{section.label}</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                See All →
              </button>
            </div>
            <div className="section-scroll-row">
              {(movies[section.id] || []).map(movie => (
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
        ))
      )}
    </div>
  );
}
