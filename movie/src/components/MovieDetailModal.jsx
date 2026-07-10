import { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const StarRating = ({ value }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FBBF24', fontWeight: 700, fontSize: 16 }}>
    ⭐ {Number(value).toFixed(1)}
  </span>
);

export default function MovieDetailModal({ movie, onClose, onFavorite, onWatchlist, isFavorited, isWatchlisted }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!movie) return null;

  const backdrop = movie.backdropPath ||
    `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80`;
  const poster = movie.posterPath ||
    `https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop&q=70`;

  const cast = movie.cast || [];
  const reviews = movie.reviews || [];
  const pros = movie.pros || ['Compelling storyline', 'Outstanding performances', 'Stunning cinematography'];
  const cons = movie.cons || ['Pacing slows in mid-section', 'Some plot points left unresolved'];

  const tabs = ['overview', 'cast', 'ai-analysis'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* Backdrop */}
        <div className="movie-detail-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="movie-detail-backdrop-overlay" />
        </div>

        {/* Main Info Section */}
        <div className="movie-detail-main">
          {/* Poster Column */}
          <div className="movie-detail-poster-column">
            <img src={poster} alt={movie.title} className="movie-detail-poster" style={{ objectFit: 'cover', height: 340 }} />
            {/* Rating Card */}
            <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>IMDb Rating</span>
                <StarRating value={movie.voteAverage || 8.5} />
              </div>
              {movie.matchScore && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>AI Match</span>
                  <span style={{ color: 'var(--success-accent)', fontWeight: 700, fontSize: 16 }}>🤖 {movie.matchScore}%</span>
                </div>
              )}
              {movie.runtime && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Runtime</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
              )}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
              {/* Action Buttons */}
              <button
                className={`btn ${isFavorited ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => onFavorite?.(movie.id)}
                style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 14, borderRadius: 10, background: isFavorited ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isFavorited ? '#EF4444' : 'var(--card-border)'}`, color: isFavorited ? '#EF4444' : 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onWatchlist?.(movie.id)}
                style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 14, borderRadius: 10, background: isWatchlisted ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isWatchlisted ? 'var(--primary-accent)' : 'var(--card-border)'}`, color: isWatchlisted ? 'var(--primary-accent)' : 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                {isWatchlisted ? '📺 In Watchlist' : '➕ Add to Watchlist'}
              </button>
            </div>
          </div>

          {/* Info Column */}
          <div className="movie-detail-info-column">
            {/* Genres */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {(movie.genres || []).map(g => (
                <span key={g} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#C7D2FE', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{g}</span>
              ))}
              {movie.releaseDate && (
                <span style={{ background: 'rgba(255,255,255,0.07)', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.1 }}>{movie.title}</h1>
            {movie.tagline && <p className="movie-detail-tagline">"{movie.tagline}"</p>}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: 4 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}>
                  {tab === 'overview' ? 'Overview' : tab === 'cast' ? '🎭 Cast' : '🤖 AI Analysis'}
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
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Community Reviews</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {reviews.map((rev, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>@{rev.author}</div>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.content}</p>
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
                  {cast.map((member, i) => (
                    <div key={i} className="cast-member-card">
                      <div className="cast-member-avatar" style={{ backgroundImage: `url(${member.profile_path})` }} />
                      <div className="cast-member-name">{member.name}</div>
                      <div className="cast-member-char">{member.character}</div>
                    </div>
                  ))}
                  {cast.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cast information not available.</p>}
                </div>
              </div>
            )}

            {activeTab === 'ai-analysis' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                {movie.aiExplanation && (
                  <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#C7D2FE', marginBottom: 8 }}>🤖 Why CineAI Recommends This</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{movie.aiExplanation}</p>
                  </div>
                )}
                <div className="pros-cons-grid">
                  <div className="pros-card">
                    <div className="pros-cons-title pro">✅ AI Pros</div>
                    <div className="pros-cons-list">
                      {pros.map((p, i) => <div key={i}>• {p}</div>)}
                    </div>
                  </div>
                  <div className="cons-card">
                    <div className="pros-cons-title con">⚠️ AI Cons</div>
                    <div className="pros-cons-list">
                      {cons.map((c, i) => <div key={i}>• {c}</div>)}
                    </div>
                  </div>
                </div>
                {/* Your Rating */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Rate This Movie</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} style={{
                        fontSize: 28, background: 'none', border: 'none', cursor: 'pointer',
                        filter: star <= rating ? 'none' : 'grayscale(1) opacity(0.4)',
                        transition: 'all 0.15s ease', transform: star <= rating ? 'scale(1.1)' : 'scale(1)'
                      }}>⭐</button>
                    ))}
                    {rating > 0 && <span style={{ color: 'var(--success-accent)', fontWeight: 600, fontSize: 14, marginLeft: 8 }}>You rated {rating}/5</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
