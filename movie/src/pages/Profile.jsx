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

  const watchCount = history?.length || 0;
  const hoursWatched = Math.round(watchCount * 2.1);

  const cardStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 };

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* Profile Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
        border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 32,
        marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 900, color: 'white',
          border: '3px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)'
        }}>
          {user?.avatar || user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>{user?.name || 'Nihar Sawant'}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '0 0 16px 0' }}>Joined May 2024 · {user?.email}</p>
          
          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Watch Time', value: `${hoursWatched}h` },
              { label: 'Movies Watched', value: watchCount },
              { label: 'Movies Rated', value: favorites.length }, // Estimate rated by favorites count
              { label: 'Watchlist', value: watchlist.length },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid split: Taste/Stats left, Badges right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Left Side Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Favorite Genres */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎭 Favorite Genres</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {GENRES.map((genre, i) => {
                const pct = [88, 72, 60, 55, 40][i];
                const colors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
                return (
                  <div key={genre}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{genre}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color={colors[i]} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favorite Directors */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎬 Top Directors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DIRECTORS.map((dir, i) => (
                <div key={dir} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{dir}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{[12, 9, 8, 7, 5][i]} films</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Panel: Achievements */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🏆 Achievements & Badges</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {BADGES.map(badge => (
              <div key={badge.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{badge.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{badge.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom rows */}
      {/* Favorites Section */}
      {favMovies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>❤️ Your Favorites</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {favMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} onFavorite={onFavorite} onWatchlist={onWatchlist} isFavorited watchlist={watchlist} />
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      {watchlistMovies.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📺 Your Watchlist</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {watchlistMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} onFavorite={onFavorite} onWatchlist={onWatchlist} isWatchlisted favorites={favorites} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
