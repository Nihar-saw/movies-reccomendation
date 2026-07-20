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

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth view state (landing, login, register)
  const [authView, setAuthView] = useState('landing');

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

  const handleLogin = async (userData, userToken) => {
    setUser(userData);
    setFavorites(userData.favorites || []);
    setWatchlist(userData.watchlist || []);
    setActiveView('home');

    // After login, also load full profile from /api/auth/profile to get
    // the most up-to-date favorites/watchlist from the database
    try {
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        setFavorites(res.user.favorites || []);
        setWatchlist(res.user.watchlist || []);
      }
    } catch (e) {
      // Login data already set above — safe to ignore
    }
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

  const mp = {
    onSelectMovie: handleSelectMovie,
    favorites, watchlist, user,
    onFavorite: handleFavorite,
    onWatchlist: handleWatchlist,
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
      case 'assistant': return <Assistant user={user} onSelectMovie={handleSelectMovie} />;
      case 'profile': return <Profile {...mp} user={user} />;
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
