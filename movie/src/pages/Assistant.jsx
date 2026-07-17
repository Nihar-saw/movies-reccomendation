import { useState, useEffect, useRef } from 'react';
import { api } from '../api/api.js';

const QUICK_PROMPTS = [
  '🌌 Mind-bending sci-fi',
  '😢 Emotional endings',
  '🔍 Psychological thrillers',
  '😂 Family comedies',
  '🤯 Movies like Interstellar',
];

export default function Assistant({ user, onSelectMovie }) {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your CineMind AI assistant. Ask me to recommend movies, explain genres, or find matching films for your mood!`,
      movies: []
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sideRecs, setSideRecs] = useState([]);
  const bottomRef = useRef(null);

  // Fetch side recommendations on mount
  useEffect(() => {
    const loadSideRecs = async () => {
      try {
        const result = await api.getPersonalizedRecommendations();
        setSideRecs(result.recommendations || []);
      } catch (err) {
        // Fallback
        try {
          const simple = await api.getRecommendations('Interstellar');
          setSideRecs(Array.isArray(simple) ? simple : (simple.data || []));
        } catch (_) {}
      }
    };
    loadSideRecs();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text, movies: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const result = await api.chat(text);
      const resp = result?.response || result;
      const responseText = typeof resp === 'string' ? resp : (resp?.text || 'Here are some movies you might enjoy!');
      let movieIds = Array.isArray(resp?.movies) ? resp.movies : [];

      let fetchedMovies = [];
      if (movieIds.length > 0) {
        if (typeof movieIds[0] === 'object' && movieIds[0].title) {
          fetchedMovies = movieIds;
        } else {
          const promises = movieIds.map(id => api.getMovieDetails(id).catch(() => null));
          const responses = await Promise.all(promises);
          fetchedMovies = responses.filter(Boolean).map(r => r.movie || r.data || r);
        }
      }

      const aiMsg = { id: Date.now() + 1, role: 'ai', text: responseText, movies: fetchedMovies };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Unknown error';
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        text: `I had trouble connecting right now. (${errMsg}) Please try again shortly!`,
        movies: []
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  const renderText = (text) => {
    return text.split(/\*\*(.+?)\*\*/).map((part, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: '#818CF8' }}>{part}</strong> : part
    );
  };

  const containerStyle = { background: 'var(--card-color)', border: '1px solid var(--card-border)', borderRadius: 16, overflow: 'hidden' };

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 80px)', display: 'flex', gap: 16, paddingTop: 24, paddingBottom: 24 }}>
      
      {/* Left Chat Screen */}
      <div style={{ ...containerStyle, flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>CineMind AI Assistant</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Online · Ready to recommend</div>
          </div>
        </div>

        {/* Message Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              <div style={{
                maxWidth: '75%', padding: '12px 18px', borderRadius: 16, fontSize: 13, lineHeight: 1.5,
                background: msg.role === 'user' ? '#6366F1' : 'rgba(255,255,255,0.03)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                border: msg.role === 'user' ? 'none' : '1px solid var(--card-border)'
              }}>
                {renderText(msg.text)}
              </div>
              {/* Movies cards */}
              {msg.movies?.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '80%', alignSelf: 'flex-start', marginTop: 4 }}>
                  {msg.movies.map(m => {
                    if (!m) return null;
                    const poster = m.posterPath || m.poster_path;
                    return (
                      <div key={m.id || m.movieId} onClick={() => onSelectMovie(m)} style={{ width: 100, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                        <div style={{ width: '100%', height: 110, borderRadius: 6, backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 6 }} />
                        <div style={{ fontSize: 10, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '12px 18px', display: 'flex', gap: 4 }}>
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Controls */}
        <div style={{ padding: 16, borderTop: '1px solid var(--card-border)' }}>
          <form style={{ display: 'flex', gap: 8 }} onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: 'white', outline: 'none' }}
              disabled={typing}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', borderRadius: 12 }} disabled={!input.trim() || typing}>Send</button>
          </form>
        </div>
      </div>

      {/* Right Suggestions Sidebar */}
      <div style={{ ...containerStyle, width: 260, display: 'flex', flexDirection: 'column', padding: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Suggestions For You</h3>
        
        {/* Suggestion list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          {sideRecs.slice(0, 4).map((m, i) => (
            <div key={m.movieId || i} onClick={() => onSelectMovie(m)} style={{ display: 'flex', gap: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: 8, borderRadius: 10, border: '1px solid var(--card-border)' }}>
              <div style={{ width: 34, height: 50, borderRadius: 4, backgroundImage: `url(${m.poster || m.posterPath || ''})`, backgroundSize: 'cover', flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{m.title}</div>
                <span style={{ fontSize: 10, color: 'var(--success-accent)', fontWeight: 700 }}>{m.match || 90}% Match</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>QUICK PROMPTS</div>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)} style={{
              background: 'rgba(99,102,241,0.08)', color: '#818CF8', border: 'none', borderRadius: 8,
              padding: '8px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.2s'
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
