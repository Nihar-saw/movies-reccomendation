import { useState, useEffect } from 'react';
import { api } from '../api/api.js';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function StarRatingInput({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          style={{
            fontSize: 30, background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#FBBF24' : '#D1D5DB',
            transition: 'all 0.15s ease',
            transform: star <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function MovieDetailModal({ movie, onClose, onFavorite, onWatchlist, isFavorited, isWatchlisted }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRating, setUserRating] = useState(0);
  const [communityRating, setCommunityRating] = useState(null);
  const [communityCount, setCommunityCount] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Load ratings when movie changes
  useEffect(() => {
    if (!movie) return;
    const movieId = movie.id || movie.movieId;

    // Fetch community average
    api.getAverageRating(movieId)
      .then(data => {
        if (data.success) {
          setCommunityRating(data.averageRating);
          setCommunityCount(data.totalRatings);
        }
      })
      .catch(() => {});

    // Fetch user's own rating
    api.getUserRating(movieId)
      .then(data => {
        if (data.success && data.rating) {
          setUserRating(data.rating);
        }
      })
      .catch(() => {});
  }, [movie]);

  const handleRatingSubmit = async (star) => {
    setUserRating(star);
    setRatingSubmitting(true);
    setRatingMessage('');
    try {
      const movieId = movie.id || movie.movieId;
      await api.rateMovie(movieId, star);
      setRatingMessage(`You rated this ${star}/5 ⭐`);
      // Refresh community average
      const data = await api.getAverageRating(movieId);
      if (data.success) {
        setCommunityRating(data.averageRating);
        setCommunityCount(data.totalRatings);
      }
    } catch (e) {
      setRatingMessage('Could not save rating. Please try again.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (!movie) return null;

  const movieId = movie.id || movie.movieId;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.backdropPath ||
      `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80`;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.posterPath ||
      `https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop&q=70`;

  const cast = movie.credits?.cast || movie.cast || [];
  const reviews = movie.reviews?.results || movie.reviews || [];
  const pros = movie.pros || ['Compelling storyline', 'Outstanding performances', 'Stunning cinematography'];
  const cons = movie.cons || ['Pacing slows in mid-section', 'Some plot points left unresolved'];

  const genresList = (movie.genres || []).map(g => typeof g === 'string' ? g : g.name);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const tmdbRating = movie.vote_average || movie.voteAverage || 0;
  const voteCount = movie.vote_count || movie.voteCount || 0;

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const tabs = ['overview', 'cast', 'ai-analysis'];

  const metaStyle = { fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 };
  const valueStyle = { fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }} onClick={onClose}>
          <CloseIcon />
        </button>

        {/* Backdrop */}
        <div style={{
          width: '100%', height: 280, backgroundImage: `url(${backdrop})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          position: 'relative', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.98) 100%)'
          }} />
        </div>

        {/* Main Info Section */}
        <div style={{ display: 'flex', gap: 32, padding: '0 36px 36px', marginTop: -80, position: 'relative', zIndex: 2 }}>
          {/* Poster Column */}
          <div style={{ flexShrink: 0, width: 180 }}>
            <img
              src={poster}
              alt={movie.title}
              style={{ width: 180, height: 270, objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', border: '3px solid white' }}
            />

            {/* Stat Card */}
            <div style={{ marginTop: 16, background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* TMDB Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={metaStyle}>TMDB Rating</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FBBF24', fontWeight: 700, fontSize: 15 }}>
                  ⭐ {Number(tmdbRating).toFixed(1)}
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({voteCount > 1000 ? `${(voteCount/1000).toFixed(0)}k` : voteCount})</span>
                </span>
              </div>

              {/* Community Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={metaStyle}>Community</span>
                <span style={{ color: '#6366F1', fontWeight: 700, fontSize: 15 }}>
                  {communityRating !== null
                    ? <>⭐ {communityRating} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({communityCount})</span></>
                    : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No ratings yet</span>
                  }
                </span>
              </div>

              {/* AI Match */}
              {(movie.matchScore || movie.confidence) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={metaStyle}>AI Match</span>
                  <span style={{ color: 'var(--success-accent)', fontWeight: 700, fontSize: 15 }}>
                    🤖 {movie.matchScore || Math.round((movie.confidence || 0) * 100)}%
                  </span>
                </div>
              )}

              {/* Runtime */}
              {runtime && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={metaStyle}>Runtime</span>
                  <span style={valueStyle}>🕐 {runtime}</span>
                </div>
              )}

              {/* Release Year */}
              {releaseYear && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={metaStyle}>Released</span>
                  <span style={valueStyle}>📅 {releaseYear}</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

              {/* Action Buttons */}
              <button
                onClick={() => onFavorite?.(movieId)}
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, border: `1px solid ${isFavorited ? '#EF4444' : 'rgba(0,0,0,0.1)'}`,
                  background: isFavorited ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.03)',
                  color: isFavorited ? '#EF4444' : 'var(--text-primary)',
                  transition: 'all 0.2s',
                }}
              >
                {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
              <button
                onClick={() => onWatchlist?.(movieId)}
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, border: `1px solid ${isWatchlisted ? '#6366F1' : 'rgba(0,0,0,0.1)'}`,
                  background: isWatchlisted ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0.03)',
                  color: isWatchlisted ? '#6366F1' : 'var(--text-primary)',
                  transition: 'all 0.2s',
                }}
              >
                {isWatchlisted ? '📺 In Watchlist' : '➕ Add to Watchlist'}
              </button>
            </div>
          </div>

          {/* Info Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Genres + Year row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {genresList.map(g => (
                <span key={g} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366F1', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{g}</span>
              ))}
              {releaseYear && (
                <span style={{ background: 'rgba(0,0,0,0.04)', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {releaseYear}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6, lineHeight: 1.1, color: 'var(--text-primary)' }}>{movie.title}</h1>
            {movie.tagline && <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: 15, marginBottom: 18 }}>"{movie.tagline}"</p>}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--radius-md)', padding: 4 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#6366F1' : 'var(--text-secondary)',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  {tab === 'overview' ? '📄 Overview' : tab === 'cast' ? '🎭 Cast' : '🤖 AI Analysis'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
                  {movie.overview}
                </p>
                {reviews.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Community Reviews</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {reviews.slice(0, 3).map((rev, i) => (
                        <div key={i} style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: 'var(--text-primary)' }}>@{rev.author}</div>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.content?.slice(0, 300)}...</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'cast' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div className="cast-row">
                  {cast.slice(0, 10).map((member, i) => {
                    const profilePath = member.profile_path
                      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                      : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`;
                    return (
                      <div key={i} className="cast-member-card">
                        <div className="cast-member-avatar" style={{ backgroundImage: `url(${profilePath})` }} />
                        <div className="cast-member-name">{member.name}</div>
                        <div className="cast-member-char">{member.character}</div>
                      </div>
                    );
                  })}
                  {cast.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cast information not available.</p>}
                </div>
              </div>
            )}

            {activeTab === 'ai-analysis' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                {(movie.aiExplanation || movie.reason) && (
                  <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#6366F1', marginBottom: 8 }}>🤖 Why CineAI Recommends This</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{movie.aiExplanation || movie.reason}</p>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#10B981', marginBottom: 10, fontSize: 14 }}>✅ AI Pros</div>
                    {pros.map((p, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>• {p}</div>)}
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: 10, fontSize: 14 }}>⚠️ AI Cons</div>
                    {cons.map((c, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>• {c}</div>)}
                  </div>
                </div>

                {/* Rate This Movie */}
                <div style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text-primary)' }}>
                    Rate This Movie
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                    Your rating influences community recommendations
                  </p>
                  <StarRatingInput value={userRating} onChange={handleRatingSubmit} disabled={ratingSubmitting} />
                  {ratingMessage && (
                    <div style={{
                      marginTop: 12, fontSize: 13, fontWeight: 600,
                      color: ratingMessage.includes('Could not') ? '#EF4444' : '#10B981',
                      background: ratingMessage.includes('Could not') ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                      border: `1px solid ${ratingMessage.includes('Could not') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                      borderRadius: 8, padding: '8px 12px',
                    }}>
                      {ratingMessage}
                    </div>
                  )}
                  {communityRating !== null && (
                    <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                      Community avg: <strong style={{ color: '#6366F1' }}>⭐ {communityRating}</strong> from {communityCount} rating{communityCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
