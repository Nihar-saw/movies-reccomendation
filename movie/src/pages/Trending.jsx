import { useState, useEffect } from 'react';
import { api } from '../api/api.js';

const ACTORS = [
  { name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { name: 'Zendaya', role: 'Chani', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { name: 'Chris Hemsworth', role: 'Dementus', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
];

export default function Trending({ onSelectMovie, favorites, watchlist }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await api.getTrendingMovies();
        setMovies(res.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [timeRange]);

  const cardStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 };

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* Header and Time Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>📈 Trending</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Most popular movies and artists in the community right now.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid var(--card-border)' }}>
          {['today', 'week', 'month'].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              style={{
                background: timeRange === t ? '#6366F1' : 'transparent',
                color: timeRange === t ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 44, animation: 'pulse 1.5s infinite' }}>📈</div>
          <p style={{ marginTop: 12 }}>Fetching trending topics...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Rank List Table */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Trending This Week</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {movies.slice(0, 10).map((m, idx) => {
                const isUp = idx % 3 === 0;
                const changeVal = ((idx + 2) * 2.3).toFixed(1);
                return (
                  <div 
                    key={m.id || m.movieId} 
                    onClick={() => onSelectMovie(m)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', padding: '10px 12px',
                      borderRadius: 12, border: '1px solid transparent', transition: 'all 0.15s'
                    }}
                    className="trending-row"
                  >
                    {/* Rank */}
                    <div style={{ fontSize: 18, fontWeight: 900, color: idx < 3 ? '#6366F1' : 'var(--text-muted)', width: 24, textAlign: 'center' }}>
                      {idx + 1}
                    </div>

                    {/* Poster */}
                    <div style={{ 
                      width: 36, height: 50, borderRadius: 6, 
                      backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, 
                      backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 
                    }} />

                    {/* Metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {m.release_date?.substring(0, 4)} · Match 95%
                      </div>
                    </div>

                    {/* Trend indicator */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isUp ? '#10B981' : '#EF4444' }}>
                        {isUp ? `↑ +${changeVal}%` : `↓ -${changeVal}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Actors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Actors List */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Popular Actors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ACTORS.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundImage: `url(${a.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{a.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Insights */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Trending Insights</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Sci-Fi and Action movies have experienced a **+42% spike** in activity this week, led by searches for Dune and Interstellar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
