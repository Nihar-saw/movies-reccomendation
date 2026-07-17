import MovieCard from '../components/MovieCard.jsx';

const BADGES = [
  { name: 'Sci-Fi Connoisseur', description: 'Watched 30+ sci-fi films', icon: '🚀' },
  { name: 'Midnight Marauder', description: 'Watched 5 films after midnight', icon: '🦇' },
  { name: 'Nolan Acolyte', description: 'Watched all Nolan films', icon: '🌀' },
  { name: 'Cinematic Scholar', description: 'Rated 50+ movies', icon: '🎓' },
  { name: 'Genre Explorer', description: 'Explored 10+ genres', icon: '🗺️' },
  { name: 'Weekend Binger', description: '10h+ watch in a single weekend', icon: '🍿' },
];

const DIRECTORS = ['Christopher Nolan', 'Martin Scorsese', 'Denis Villeneuve', 'David Fincher', 'Wes Anderson'];
const GENRES = ['Science Fiction', 'Psychological Thriller', 'Drama', 'Crime', 'Adventure'];

const ProgressBar = ({ value, color = 'var(--primary-accent)' }) => (
  <div style={{ height: 6, background: '#27272A', borderRadius: 3, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
  </div>
);

export default function Profile({ user, favorites, watchlist, history, onSelectMovie, onFavorite, onWatchlist, movies = [] }) {
  const favMovies = movies.filter(m => favorites.includes(m.id || m.movieId));
  const watchlistMovies = movies.filter(m => watchlist.includes(m.id || m.movieId));

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-xl)', padding: '40px',
        marginBottom: 36, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42, fontWeight: 900, color: 'white',
          border: '4px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 30px rgba(99,102,241,0.4)'
        }}>
          {user?.avatar || user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>{user?.name || 'Movie Enthusiast'}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Films Watched', value: history.length },
              { label: 'Favorites', value: favorites.length },
              { label: 'Watchlist', value: watchlist.length },
              { label: 'Watch Streak', value: `${history.length > 0 ? 1 : 0} days 🔥` },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        {/* Left: Streak + Directors + Genre */}
        <div>
          {/* Streak Card */}
          <div className="streak-card">
            <div className="streak-icon">🔥</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{history.length > 0 ? 1 : 0} Day Watch Streak!</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Keep watching to maintain your streak and unlock achievements</div>
            </div>
          </div>

          {/* Genre Breakdown */}
          <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🎭 Favorite Genres</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {GENRES.map((genre, i) => {
                const pct = [88, 72, 60, 55, 40][i];
                const colors = ['var(--primary-accent)', 'var(--secondary-accent)', 'var(--success-accent)', '#F59E0B', '#EF4444'];
                return (
                  <div key={genre}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{genre}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color={colors[i]} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favorite Directors */}
          <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🎬 Top Directors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DIRECTORS.map((dir, i) => (
                <div key={dir} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{dir}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{[12, 9, 8, 7, 5][i]} films</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Badges */}
        <div>
          <div style={{ background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🏆 Achievements</h3>
            <div className="badge-grid">
              {BADGES.map(badge => (
                <div key={badge.name} className="badge-item">
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-description">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favMovies.length > 0 && (
        <div className="section-container">
          <h2 className="section-title" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>❤️ Your Favorites</h2>
          <div className="section-scroll-row">
            {favMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} onFavorite={onFavorite} onWatchlist={onWatchlist} isFavorited watchlist={watchlist} />
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      {watchlistMovies.length > 0 && (
        <div className="section-container">
          <h2 className="section-title" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📺 Your Watchlist</h2>
          <div className="section-scroll-row">
            {watchlistMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} onFavorite={onFavorite} onWatchlist={onWatchlist} isWatchlisted favorites={favorites} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
