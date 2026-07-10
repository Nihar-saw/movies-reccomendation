import { useState } from 'react';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#EF4444' : 'none'} stroke={filled ? '#EF4444' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function MovieCard({ movie, onSelect, onFavorite, onWatchlist, isFavorited, isWatchlisted }) {
  const [hovered, setHovered] = useState(false);
  const [favAnim, setFavAnim] = useState(false);

  const movieId = movie.id || movie.movieId;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.posterPath ||
      `https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop&q=70`;

  const rating = movie.vote_average || movie.voteAverage || 0;

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
    onFavorite?.(movieId);
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    onWatchlist?.(movieId);
  };

  return (
    <div
      className="movie-card"
      onClick={() => onSelect?.(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Poster */}
      <div
        className="movie-card-poster"
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* AI Match Badge */}
      {(movie.matchScore || movie.confidence) && (
        <div className="movie-card-match">
          🤖 {movie.matchScore || Math.round((movie.confidence || 0) * 100)}% Match
        </div>
      )}

      {/* Favorite Button */}
      <button
        className="movie-card-favorite-btn"
        onClick={handleFavorite}
        style={{ transform: favAnim ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s ease' }}
      >
        <HeartIcon filled={isFavorited} />
      </button>

      {/* Hover Overlay */}
      <div
        className="movie-card-overlay"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.85) 50%, rgba(9,9,11,0.4) 100%)'
            : 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.6) 40%, rgba(9,9,11,0) 80%)',
          transition: 'background 0.3s ease',
        }}
      >
        {hovered && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {movie.overview}
            </p>
            {(movie.aiExplanation || movie.reason) && (
              <div style={{ fontSize: 11, color: '#C7D2FE', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 6, padding: '6px 10px', marginBottom: 10, lineHeight: 1.4 }}>
                🤖 {(movie.aiExplanation || movie.reason)?.slice(0, 80)}...
              </div>
            )}
            <button
              onClick={handleWatchlist}
              style={{
                width: '100%', padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isWatchlisted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                color: isWatchlisted ? 'var(--success-accent)' : 'white',
                fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              {isWatchlisted ? '✓ In Watchlist' : <><PlusIcon /> Add to Watchlist</>}
            </button>
          </div>
        )}

        {/* Card Footer */}
        <div>
          <div className="movie-card-title">{movie.title}</div>
          <div className="movie-card-meta">
            <span className="movie-card-genres">
              {Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(' • ') : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#FBBF24', fontWeight: 700, fontSize: 12 }}>
              <StarIcon /> {rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
