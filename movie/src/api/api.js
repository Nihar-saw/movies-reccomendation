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
  removeHistory: userApi.removeHistory,

  // Ratings
  rateMovie: userApi.rateMovie,
  getAverageRating: userApi.getAverageRating,
  getUserRating: userApi.getUserRating,

  // Movie Data API
  getTrendingMovies: movieApi.getTrendingMovies,
  getPopularMovies: movieApi.getPopularMovies,
  getTopRatedMovies: movieApi.getTopRatedMovies,
  getUpcomingMovies: movieApi.getUpcomingMovies,
  getGenres: movieApi.getGenres,
  getMovieDetails: movieApi.getMovieDetails,
  searchMovies: movieApi.searchMovies,
  getDiscoverMovies: movieApi.getDiscoverMovies,

  // Recommendations API
  getRecommendations: recommendationApi.getRecommendations,
  getHybridRecommendations: recommendationApi.getHybridRecommendations,
  getPersonalizedRecommendations: recommendationApi.getPersonalizedRecommendations,

  // AI Chat API
  chat: recommendationApi.chat,

  // Comments API
  addComment: userApi.addComment,
  getComments: userApi.getComments,
};

