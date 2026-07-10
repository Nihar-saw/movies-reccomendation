import { authApi } from './authApi';
import { movieApi } from './movieApi';
import { recommendationApi } from './recommendationApi';
import { userApi } from './userApi';

export const api = {
  // Auth API
  register: authApi.register,
  login: authApi.login,
  getProfile: authApi.getProfile,

  // Favorites & Watchlist Actions
  addFavorite: userApi.addFavorite,
  removeFavorite: userApi.removeFavorite,
  addWatchlist: userApi.addWatchlist,
  removeWatchlist: userApi.removeWatchlist,

  // Watch History
  addHistory: userApi.addHistory,
  getHistory: userApi.getHistory,

  // Movie Data API
  getTrendingMovies: movieApi.getTrendingMovies,
  getPopularMovies: movieApi.getPopularMovies,
  getTopRatedMovies: movieApi.getTopRatedMovies,
  getUpcomingMovies: movieApi.getUpcomingMovies,
  getGenres: movieApi.getGenres,
  getMovieDetails: movieApi.getMovieDetails,
  searchMovies: movieApi.searchMovies,

  // Recommendations API
  getRecommendations: recommendationApi.getRecommendations,
  getHybridRecommendations: recommendationApi.getHybridRecommendations,

  // AI Chat API
  chat: recommendationApi.chat,
};
