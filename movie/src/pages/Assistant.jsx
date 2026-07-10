import { useState, useEffect, useRef } from 'react';
import { api } from '../api/api.js';

const QUICK_PROMPTS = [
  '🌌 Mind-bending sci-fi movies',
  '😢 Movies with emotional endings',
  '🔍 Best psychological thrillers after 2018',
  '😂 Funny family movies',
  '🤯 Movies like Interstellar',
  '🎭 Oscar-winning dramas',
];


export default function Assistant({ user, onSelectMovie }) {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your CineAI assistant. Ask me to recommend movies, explain why you'd love something, or find films based on your mood!`,
      movies: []
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

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
        // AI might return full movie objects or just IDs, handle both
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
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        text: 'I had trouble connecting right now. Please try again shortly!',
        movies: []
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  const renderText = (text) => {
    // Bold markdown with **text**
    return text.split(/\*\*(.+?)\*\*/).map((part, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: 'white' }}>{part}</strong> : part
    );
  };

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ marginBottom: 0 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>💬 AI Assistant</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Ask CineAI anything — recommendations, explanations, or mood-based picks.</p>
      </div>

      <div className="chat-assistant-container" style={{ flex: 1, height: 'auto' }}>
        {/* Header */}
        <div className="chat-header">
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>CineAI Assistant</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
              <span className="chat-status-dot" />
              Online · Powered by Gemini AI
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              <div className={`chat-bubble ${msg.role}`}>
                {renderText(msg.text)}
              </div>
              {/* Movie mini cards */}
              {msg.movies?.length > 0 && (
                <div className="chat-bubble-movies" style={{ width: msg.role === 'ai' ? '90%' : '80%', alignSelf: 'flex-start' }}>
                  {msg.movies.map(m => {
                    if (!m) return null;
                    const id = m.id || m.movieId;
                    const title = m.title;
                    const poster = m.posterPath || m.poster_path;
                    return (
                      <div key={id} className="chat-movie-mini-card" onClick={() => onSelectMovie(m)}>
                        <div className="chat-movie-mini-poster" style={{ backgroundImage: `url(${poster})` }} />
                        <div className="chat-movie-mini-info">
                          <div className="chat-movie-mini-title">{title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="chat-bubble ai" style={{ padding: '14px 20px' }}>
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        <div className="chat-suggestions">
          {QUICK_PROMPTS.map(q => (
            <button key={q} className="chat-suggestion-tag" onClick={() => sendMessage(q.replace(/^[^ ]+ /, ''))}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <form className="chat-input-container" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about movies, genres, actors, or your mood..."
            disabled={typing}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim() || typing}
            style={{ padding: '10px 20px', fontSize: 14, flexShrink: 0, opacity: (!input.trim() || typing) ? 0.5 : 1 }}>
            Send 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
