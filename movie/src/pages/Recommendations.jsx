import { useState, useEffect, useCallback, useRef } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const GENRE_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];
const MOOD_TAGS = ['Mind-bending', 'Emotional', 'Space', 'Action', 'Comedy', 'Dark', 'Thriller', 'Romance'];

// --- Radar Chart Component (AI Taste Profile) ---
const RadarChart = ({ data }) => {
  const cx = 90, cy = 90, r = 70;
  const n = data.length;
  if (n === 0) return <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Add movies to build your taste profile.</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (d.value / max) * r;
    return { x: cx + val * Math.cos(angle), y: cy + val * Math.sin(angle), label: d.label, lx: cx + (r + 18) * Math.cos(angle), ly: cy + (r + 18) * Math.sin(angle) };
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {gridLevels.map((lv, li) => (
        <polygon key={li} points={data.map((_, i) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return `${cx + r * lv * Math.cos(a)},${cy + r * lv * Math.sin(a)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {data.map((_, i) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(255,255,255,0.06)" />; })}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(99,102,241,0.25)" stroke="#6366F1" strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#6366F1" />)}
      {points.map((p, i) => <text key={`t${i}`} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">{p.label}</text>)}
    </svg>
  );
};

// --- Confidence Breakdown ---
const ConfidenceBreakdown = ({ match }) => {
  const items = [
    { label: 'Content Similarity', value: 40, color: '#6366F1' },
    { label: 'Collaborative Score', value: 30, color: '#8B5CF6' },
    { label: 'Popularity', value: 15, color: '#10B981' },
    { label: 'Personal Preference', value: 15, color: '#F59E0B' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 130, flexShrink: 0 }}>{it.label}</span>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${it.value}%`, background: it.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: it.color, width: 34, textAlign: 'right' }}>{it.value}%</span>
        </div>
      ))}
    </div>
  );
};

// --- Pipeline Step ---
const PipelineStep = ({ icon, label, sub }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, minWidth: 80 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
    <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{label}</div>
    <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>{sub}</div>
  </div>
);

export default function Recommendations({ onSelectMovie, user, favorites, watchlist, history, onFavorite, onWatchlist, setActiveView }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroRec, setHeroRec] = useState(null);
  const [moodRecs, setMoodRecs] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [miniChatInput, setMiniChatInput] = useState('');
  const [miniChatReply, setMiniChatReply] = useState(null);
  const [miniChatLoading, setMiniChatLoading] = useState(false);

  const loadRecs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getPersonalizedRecommendations();
      const data = result.recommendations || [];
      setRecs(data);
      if (data.length > 0) setHeroRec(data[0]);
    } catch (err) {
      // Fallback to generic recommendations
      try {
        const simple = await api.getRecommendations('Interstellar');
        const arr = Array.isArray(simple.data || simple) ? (simple.data || simple) : [];
        setRecs(arr);
        if (arr.length > 0) setHeroRec(arr[0]);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecs(); }, [loadRecs]);

  // Auto-refresh when interactions change
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => loadRecs(), 2500);
      return () => clearTimeout(t);
    }
  }, [watchlist?.length, favorites?.length, history?.length]);

  // Mood-based recommendations
  const fetchMoodRecs = async (mood) => {
    setActiveMood(mood);
    setMoodLoading(true);
    try {
      const result = await api.chat(`Recommend me 6 ${mood} movies`);
      const resp = result?.response || result;
      let movieIds = Array.isArray(resp?.movies) ? resp.movies : [];
      if (movieIds.length > 0) {
        const details = await Promise.all(movieIds.slice(0, 6).map(id => api.getMovieDetails(id).catch(() => null)));
        setMoodRecs(details.filter(Boolean).map(r => r.movie || r.data || r));
      }
    } catch (err) {
      console.error('Mood recs failed:', err);
    } finally {
      setMoodLoading(false);
    }
  };

  // Mini AI chat
  const handleMiniChat = async () => {
    if (!miniChatInput.trim()) return;
    setMiniChatLoading(true);
    setMiniChatReply(null);
    try {
      const result = await api.chat(miniChatInput);
      const resp = result?.response || result;
      const text = typeof resp === 'string' ? resp : (resp?.text || 'Here are some recommendations!');
      let movieIds = Array.isArray(resp?.movies) ? resp.movies : [];
      let movies = [];
      if (movieIds.length > 0) {
        const details = await Promise.all(movieIds.slice(0, 4).map(id => api.getMovieDetails(id).catch(() => null)));
        movies = details.filter(Boolean).map(r => r.movie || r.data || r);
      }
      setMiniChatReply({ text, movies });
    } catch (err) {
      setMiniChatReply({ text: 'Sorry, I had trouble connecting. Try again!', movies: [] });
    } finally {
      setMiniChatLoading(false);
      setMiniChatInput('');
    }
  };

  // Build taste profile data from recs genres
  const genreCounts = {};
  recs.forEach(r => (r.genres || []).forEach(g => {
    const name = typeof g === 'string' ? g : g.name;
    if (name) genreCounts[name] = (genreCounts[name] || 0) + 1;
  }));
  const radarData = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

  // Recently learned (last 3 from watchlist/favorites)
  const recentlyLearned = [...(history || [])].reverse().slice(0, 3);

  // Split recs into sections
  const topDirector = recs.length > 2 ? recs.slice(0, 6) : [];
  const tonightPick = recs.length > 1 ? recs[1] : null;
  const missedMovies = recs.slice(6, 14);
  const similarUsersLoved = recs.slice(3, 9);

  const cardStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, overflow: 'hidden' };

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: 32 }}>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🤖</div>
          <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Analyzing your taste profile...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Our AI is computing personalized recommendations just for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: 24 }}>
      {/* ===== ROW 1: Hero + Taste Profile + Confidence + Recently Learned ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Your Next Favorite Movie */}
        <div style={{ ...cardStyle, position: 'relative', display: 'flex', gap: 20, padding: 20 }}>
          <div style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', fontSize: 18 }} onClick={() => heroRec && onFavorite(heroRec.movieId || heroRec.id)}>
            {favorites.includes(heroRec?.movieId || heroRec?.id) ? '❤️' : '🤍'}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', position: 'absolute', top: 16, left: 20, letterSpacing: 0.5 }}>⭐ Your Next Favorite Movie</div>
          {heroRec && (
            <>
              <div style={{ width: 130, height: 190, borderRadius: 12, backgroundImage: `url(${heroRec.poster || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, marginTop: 28, border: '2px solid rgba(255,255,255,0.08)' }} />
              <div style={{ flex: 1, marginTop: 28 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{heroRec.title}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(heroRec.release_date || '').slice(0, 4) && <span style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{(heroRec.release_date || '').slice(0, 4)}</span>}
                  {(heroRec.genres || []).slice(0, 3).map((g, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{typeof g === 'string' ? g : g.name}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: `conic-gradient(#10B981 ${heroRec.match || 0}%, rgba(255,255,255,0.06) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--card-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#10B981' }}>{heroRec.match || 0}%</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Match Score</strong><br />
                    {heroRec.reason || 'Based on your taste profile'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => onSelectMovie(heroRec)}>▶ Watch Trailer</button>
                  <button className="btn btn-secondary" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => onWatchlist(heroRec.movieId || heroRec.id)}>+ Watchlist</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Taste Profile */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>AI Taste Profile</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart data={radarData} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            <strong>Profile Summary</strong><br />
            {radarData.length > 0 ? `You enjoy ${radarData.slice(0, 3).map(d => d.label).join(', ')} movies.` : 'Add movies to build your profile.'}
          </div>
        </div>

        {/* Recommendation Confidence */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recommendation Confidence</div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#6366F1' }}>{heroRec?.match || 0}%</span>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Confidence</div>
          </div>
          <ConfidenceBreakdown match={heroRec?.match || 0} />
        </div>

        {/* Recently Learned */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recently Learned</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>The AI has updated your taste profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentlyLearned.length > 0 ? recentlyLearned.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>You added</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>{m.title || `Movie #${m.movieId || m.id}`}</span>
              </div>
            )) : <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No recent activity yet.</div>}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 16 }}>Updated just now</div>
        </div>
      </div>

      {/* ===== ROW 2: Director Row + Tonight Pick + Missed Movies ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: 16, marginBottom: 16 }}>

        {/* Because You Like [Director] */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            Because You Like <span style={{ color: '#6366F1' }}>{radarData[0]?.label || 'Movies'}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {topDirector.map((m, i) => (
              <div key={m.movieId || i} style={{ flexShrink: 0, width: 100, cursor: 'pointer' }} onClick={() => onSelectMovie(m)}>
                <div style={{ width: 100, height: 150, borderRadius: 10, backgroundImage: `url(${m.poster || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 6, position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(99,102,241,0.9)', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{m.match || 0}% Match</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For Tonight */}
        {tonightPick && (
          <div style={{ ...cardStyle, position: 'relative', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${tonightPick.backdrop || tonightPick.poster || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Recommended For Tonight</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{tonightPick.title}</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                {(tonightPick.genres || []).slice(0, 3).map((g, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{typeof g === 'string' ? g : g.name}</span>)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Why we recommend this</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 12, lineHeight: 1.5 }}>{tonightPick.reason || 'Matches your viewing patterns.'}</div>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px', alignSelf: 'flex-start' }} onClick={() => onSelectMovie(tonightPick)}>▶ Play Trailer</button>
            </div>
          </div>
        )}

        {/* Movies You May Have Missed */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Movies You May Have Missed</span>
            <span style={{ fontSize: 11, color: '#6366F1', cursor: 'pointer' }} onClick={() => setActiveView && setActiveView('discover')}>View all</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {missedMovies.slice(0, 8).map((m, i) => (
              <div key={m.movieId || i} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => onSelectMovie(m)}>
                <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 8, backgroundImage: `url(${m.poster || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(99,102,241,0.9)', padding: '1px 6px', borderRadius: 8, fontSize: 9, fontWeight: 700 }}>{m.match || 0}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ROW 3: Pipeline + Watchlist Influence + Mood Recommendations ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: 16, marginBottom: 16 }}>

        {/* How Our AI Recommendation Engine Works */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>How Our AI Recommendation Engine Works</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
            <PipelineStep icon="📊" label="Your Data" sub="Watchlist, Ratings, History, Favorites" />
            <div style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12 }}>→</div>
            <PipelineStep icon="🧠" label="AI Analysis" sub="Patterns, Preferences, Behaviors" />
            <div style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12 }}>→</div>
            <PipelineStep icon="📐" label="Taste Vector" sub="5000-dim TF-IDF" />
            <div style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12 }}>→</div>
            <PipelineStep icon="🎬" label="MovieLens" sub="Database" />
            <div style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12 }}>→</div>
            <PipelineStep icon="🌐" label="TMDB" sub="Metadata" />
            <div style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12 }}>→</div>
            <PipelineStep icon="⭐" label="Personalized" sub="Movies" />
          </div>
        </div>

        {/* Your Watchlist Influence */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Your Watchlist Influence</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>See how your watchlist shapes your recommendations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(history || []).slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title || `Movie #${m.movieId || m.id}`}</span>
                <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, s) => <span key={s} style={{ fontSize: 10, color: s < 4 ? '#F59E0B' : 'rgba(255,255,255,0.1)' }}>★</span>)}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', width: 32, textAlign: 'right' }}>{Math.max(5, 35 - i * 5)}%</span>
              </div>
            ))}
            {(!history || history.length === 0) && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No watch history yet.</div>}
          </div>
        </div>

        {/* Mood Recommendations */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Mood Recommendations</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Explore movies based on your mood</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {MOOD_TAGS.map(mood => (
              <button key={mood} onClick={() => fetchMoodRecs(mood)} style={{
                background: activeMood === mood ? '#6366F1' : 'rgba(99,102,241,0.15)', color: activeMood === mood ? 'white' : '#6366F1',
                border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
              }}>{mood}</button>
            ))}
          </div>
          {moodLoading && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loading mood recommendations...</div>}
          {!moodLoading && moodRecs.length > 0 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {moodRecs.slice(0, 4).map((m, i) => (
                <div key={m.id || i} style={{ flexShrink: 0, width: 60, cursor: 'pointer' }} onClick={() => onSelectMovie(m)}>
                  <div style={{ width: 60, height: 90, borderRadius: 8, backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, backgroundSize: 'cover' }} />
                  <div style={{ fontSize: 9, fontWeight: 600, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => { setActiveMood(null); setMoodRecs([]); fetchMoodRecs(MOOD_TAGS[Math.floor(Math.random() * MOOD_TAGS.length)]); }} style={{ marginTop: 10, background: 'none', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 11, color: '#6366F1', cursor: 'pointer', fontWeight: 600 }}>
            🔄 Refresh recommendations
          </button>
        </div>
      </div>

      {/* ===== ROW 4: Similar Users + AI Insights + Discover + Ask AI ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 16, marginBottom: 16 }}>

        {/* Because Similar Users Loved */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Because Similar Users Loved</div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {similarUsersLoved.map((m, i) => (
              <div key={m.movieId || i} style={{ flexShrink: 0, width: 100, cursor: 'pointer' }} onClick={() => onSelectMovie(m)}>
                <div style={{ width: 100, height: 150, borderRadius: 10, backgroundImage: `url(${m.poster || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 6, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 10, padding: '1px 4px', background: 'rgba(0,0,0,0.6)', borderRadius: 4 }}>▶</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.match || 0}% Match · Popular</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>AI Insights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              radarData[0] ? `You prefer movies with ${radarData[0].label} themes.` : 'Add movies to get insights.',
              radarData[1] ? `${radarData[1].label} is your second most watched genre.` : null,
              history?.length > 3 ? `You've explored ${Object.keys(genreCounts).length} different genres.` : null,
            ].filter(Boolean).map((insight, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{['🔮', '📊', '🎬'][i]}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discover Something Different */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Discover Something Different</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Let AI surprise you!</div>
          <button onClick={() => fetchMoodRecs(MOOD_TAGS[Math.floor(Math.random() * MOOD_TAGS.length)])} style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s'
          }}>🎲 Surprise Me</button>
        </div>

        {/* Ask AI Assistant */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Ask AI Assistant</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Powered by CineMind AI</span>
          </div>
          {miniChatReply && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8, background: 'rgba(99,102,241,0.08)', borderRadius: 10, padding: 10 }}>
                {miniChatReply.text.slice(0, 150)}{miniChatReply.text.length > 150 ? '...' : ''}
              </div>
              {miniChatReply.movies.length > 0 && (
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                  {miniChatReply.movies.map((m, i) => (
                    <div key={m.id || i} onClick={() => onSelectMovie(m)} style={{ flexShrink: 0, width: 55, cursor: 'pointer' }}>
                      <div style={{ width: 55, height: 82, borderRadius: 6, backgroundImage: `url(https://image.tmdb.org/t/p/w200${m.poster_path})`, backgroundSize: 'cover', marginBottom: 3 }} />
                      <div style={{ fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {miniChatLoading && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Thinking...</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={miniChatInput}
              onChange={e => setMiniChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMiniChat()}
              placeholder="Ask anything..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: 'white', outline: 'none' }}
            />
            <button onClick={handleMiniChat} disabled={miniChatLoading} style={{ background: '#6366F1', border: 'none', borderRadius: 10, width: 36, height: 36, color: 'white', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↗</button>
          </div>
          <button onClick={() => setActiveView && setActiveView('assistant')} style={{
            marginTop: 10, background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 11, color: '#6366F1', cursor: 'pointer', fontWeight: 700, width: '100%'
          }}>💬 Show Recommendations</button>
        </div>
      </div>

      {/* ===== FULL GRID: All Personalized Picks ===== */}
      {recs.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>🎯 All Personalized Picks</h2>
          <div className="movie-grid">
            {recs.map(movie => (
              <MovieCard
                key={movie.movieId}
                movie={{
                  ...movie,
                  id: movie.movieId,
                  poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null,
                  vote_average: movie.vote_average,
                  matchScore: movie.match,
                  confidence: (movie.match || 0) / 100,
                }}
                onSelect={onSelectMovie}
                onFavorite={onFavorite}
                onWatchlist={onWatchlist}
                isFavorited={favorites.includes(movie.movieId)}
                isWatchlisted={watchlist.includes(movie.movieId)}
              />
            ))}
          </div>
        </div>
      )}

      {recs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎬</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>No Personalized Recommendations Yet</h3>
          <p>Add movies to your watchlist, favorite some films, or watch more movies to get personalized AI recommendations!</p>
        </div>
      )}
    </div>
  );
}
