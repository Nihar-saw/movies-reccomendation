import { useState, useEffect, useCallback } from 'react';
import './index.css';

import Sidebar from './components/Sidebar.jsx';
import TopNav from './components/TopNav.jsx';
import MovieDetailModal from './components/MovieDetailModal.jsx';

import Home from './pages/Home.jsx';
import Discover from './pages/Discover.jsx';
import Search from './pages/Search.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Favorites from './pages/Favorites.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Assistant from './pages/Assistant.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Admin from './pages/Admin.jsx';
import Auth from './pages/Auth.jsx';
import Landing from './pages/Landing.jsx';
import Genres from './pages/Genres.jsx';
import Trending from './pages/Trending.jsx';
import TopRated from './pages/TopRated.jsx';

import { api } from './api/api.js';

function HistoryPage({ movies, onSelectMovie }) {
  const [historyMovies, setHistoryMovies] = useState([]);
  
  useEffect(() => {
    const load = async () => {
      const promises = movies.map(async (m) => {
        try {
          const res = await api.getMovieDetails(m.movieId || m.id);
          const detail = res.movie || res.data || res;
          return { ...detail, progress: m.progress || 60, id: detail.id || detail.movieId || m.movieId };
        } catch (e) {
          return null;
        }
      });
      const res = await Promise.all(promises);
      setHistoryMovies(res.filter(Boolean));
    };
    if (movies.length > 0) {
      load();
    } else {
      setHistoryMovies([]);
    }
  }, [movies]);

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>🕒 Continue Watching</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36 }}>Pick up where you left off.</p>
      {historyMovies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🕒</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Nothing here yet</h3>
          <p>Start watching movies and they will appear here.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {historyMovies.map(m => (
            <div key={m.id} onClick={() => onSelectMovie(m)} style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 280, borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundImage: `url(${m.posterPath || m.poster_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#27272A' }}>
                  <div style={{ height: '100%', width: `${m.progress}%`, background: 'var(--primary-accent)' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.progress}% watched</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth view state (landing, login, register)
  const [authView, setAuthView] = useState('landing');

  // Restore session & load profile data
  // Disabled auto-restore on mount so the site always starts on the landing page as requested
  /*
  useEffect(() => {
    const loadProfile = async () => {
      const savedToken = localStorage.getItem('cineai_token');
      if (savedToken) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            setFavorites(res.user.favorites || []);
            setWatchlist(res.user.watchlist || []);
          }
          const historyRes = await api.getHistory();
          if (historyRes) {
            setHistory(historyRes.history || historyRes || []);
          }
        } catch (e) {
          console.error('Failed to load user profile on mount:', e);
        }
      }
    };
    loadProfile();
  }, []);
  */

  // Pre-load all movies for favorites/watchlist resolution
  useEffect(() => {
    api.getTrendingMovies().then(t => {
      api.getPopularMovies().then(p => {
        const arr = [...(t.results || t || []), ...(p.results || p || [])];
        const seen = new Set();
        setAllMovies(arr.filter(m => {
          const k = m.id || m.movieId;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        }));
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setFavorites(userData.favorites || []);
    setWatchlist(userData.watchlist || []);
    setActiveView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('cineai_token');
    localStorage.removeItem('cineai_mock_mode');
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    setActiveView('home');
    setSelectedMovie(null);
    setAuthView('landing');
  };

  const handleFavorite = useCallback(async (movieId) => {
    try {
      if (favorites.includes(movieId)) {
        setFavorites(prev => prev.filter(id => id !== movieId));
        await api.removeFavorite(movieId);
      } else {
        setFavorites(prev => [...prev, movieId]);
        await api.addFavorite(movieId);
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  }, [favorites]);

  const handleWatchlist = useCallback(async (movieId) => {
    try {
      if (watchlist.includes(movieId)) {
        setWatchlist(prev => prev.filter(id => id !== movieId));
        await api.removeWatchlist(movieId);
      } else {
        setWatchlist(prev => [...prev, movieId]);
        await api.addWatchlist(movieId);
      }
    } catch (e) {
      console.error('Error toggling watchlist:', e);
    }
  }, [watchlist]);

  const handleSelectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
    const movieId = movie.id || movie.movieId;
    // Post to watch history endpoint
    api.addHistory(movieId, 120, false).catch(() => {});
    setHistory(prev => {
      return prev.find(m => (m.id || m.movieId) === movieId) ? prev : [movie, ...prev].slice(0, 20);
    });
  }, []);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    setActiveView('search');
  }, []);

  if (!user) {
    if (authView === 'landing') {
      return <Landing onAuthClick={(mode) => setAuthView(mode)} />;
    }
    return <Auth initialMode={authView} onLogin={handleLogin} onBack={() => setAuthView('landing')} />;
  }

  const handleRemoveHistory = async (movieId) => {
    try {
      await api.removeHistory(movieId);
      setHistory(prev => prev.filter(m => m.movieId !== movieId && m.id !== movieId));
    } catch (error) {
      console.error("Failed to remove history:", error);
    }
  };

  const mp = {
    onSelectMovie: handleSelectMovie,
    favorites, watchlist, history, user,
    onFavorite: handleFavorite,
    onWatchlist: handleWatchlist,
    onRemoveHistory: handleRemoveHistory,
    movies: allMovies,
    setActiveView,
  };

  const renderPage = () => {
    switch (activeView) {
      case 'home': return <Home {...mp} />;
      case 'discover': return <Discover {...mp} />;
      case 'search': return <Search {...mp} initialQuery={searchQuery} />;
      case 'recommendations': return <Recommendations {...mp} user={user} />;
      case 'genres': return <Genres {...mp} />;
      case 'trending': return <Trending {...mp} />;
      case 'topRated': return <TopRated {...mp} />;
      case 'favorites': return <Favorites {...mp} />;
      case 'watchlist': return <Watchlist {...mp} />;
      case 'history': return <HistoryPage movies={history} onSelectMovie={handleSelectMovie} />;
      case 'assistant': return <Assistant user={user} onSelectMovie={handleSelectMovie} />;
      case 'profile': return <Profile {...mp} user={user} history={history} />;
      case 'settings': return <Settings />;
      case 'admin': return <Admin />;
      default: return <Home {...mp} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="main-content">
        <TopNav
          user={user}
          setActiveView={setActiveView}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </div>
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onFavorite={handleFavorite}
          onWatchlist={handleWatchlist}
          isFavorited={favorites.includes(selectedMovie.id || selectedMovie.movieId)}
          isWatchlisted={watchlist.includes(selectedMovie.id || selectedMovie.movieId)}
        />
      )}
    </div>
  );
}

