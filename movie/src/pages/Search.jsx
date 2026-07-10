import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { api } from '../api/api.js';

const FILTERS = {
  genre: ['Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Mystery', 'Romance', 'Horror'],
  year: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2010s', '2000s', '1990s'],
  rating: ['9+', '8+', '7+', '6+'],
  runtime: ['< 90 min', '90-120 min', '120-150 min', '150+ min'],
};

const SEMANTIC_QUERIES = [
  '🌌 Mind-bending sci-fi movies',
  '😢 Movies with emotional endings',
  '🔍 Best psychological thrillers after 2018',
  '😂 Funny family movies',
  '🤯 Movies like Interstellar',
  '🎭 Oscar-winning dramas',
];

export default function Search({ initialQuery = '', onSelectMovie, favorites, watchlist, onFavorite, onWatchlist }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '', runtime: '' });
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const runSearch = async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const result = await api.searchMovies(q);
      setResults(result.results || result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) { setQuery(initialQuery); runSearch(initialQuery); }
  }, [initialQuery]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 500);
  };

  const handleSemanticQuery = (sq) => {
    const clean = sq.replace(/^[^ ]+ /, '');
    setQuery(clean);
    runSearch(clean);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>🔍 Search</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Find any movie or ask CineAI in natural language.</p>
      </div>

      {/* Large Search Input */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)', padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
        transition: 'border-color 0.2s ease'
      }}>
        <span style={{ fontSize: 22 }}>🔍</span>
        <input
          value={query}
          onChange={handleQueryChange}
          placeholder="Search movies, actors, genres or ask AI naturally..."
          style={{
            flex: 1, background: 'none', border: 'none', color: 'white',
            fontSize: 18, outline: 'none', fontFamily: 'inherit'
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
        )}
      </div>

      {/* Semantic Suggestion Tags */}
      {!searched && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Try asking:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {SEMANTIC_QUERIES.map(sq => (
              <button
                key={sq}
                onClick={() => handleSemanticQuery(sq)}
                className="chat-suggestion-tag"
                style={{ fontSize: 14, padding: '10px 18px' }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Row */}
      {searched && (
        <div className="filters-row">
          {Object.entries(FILTERS).map(([key, options]) => (
            <select
              key={key}
              className="filter-select"
              value={filters[key]}
              onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
            >
              <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}: All</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🤖</div>
          <div style={{ fontSize: 16 }}>CineAI is searching...</div>
        </div>
      ) : searched ? (
        <>
          <div style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
            Found <strong style={{ color: 'white' }}>{results.length}</strong> results for "{query}"
          </div>
          {results.length > 0 ? (
            <div className="movie-grid">
              {results.map(movie => (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
              <h3 style={{ fontSize: 22, marginBottom: 8 }}>No results found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try a different query or use natural language like "funny movies from the 90s"</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎬</div>
          <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Discover your next favorite movie</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Type anything above to start searching</p>
        </div>
      )}
    </div>
  );
}
