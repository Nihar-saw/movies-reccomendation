import axiosInstance from './axios';

export const userApi = {
  // Favorites (using the backend's /users/favorites endpoints)
  getFavorites: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data.user?.favorites || [];
  },

  addFavorite: async (movieId) => {
    const response = await axiosInstance.post('/users/favorites', { movieId });
    return response.data;
  },

  removeFavorite: async (movieId) => {
    const response = await axiosInstance.delete(`/users/favorites/${movieId}`);
    return response.data;
  },

  // Watchlist (using the backend's /users/watchlist endpoints)
  getWatchlist: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data.user?.watchlist || [];
  },

  addWatchlist: async (movieId) => {
    const response = await axiosInstance.post('/users/watchlist', { movieId });
    return response.data;
  },

  removeWatchlist: async (movieId) => {
    const response = await axiosInstance.delete(`/users/watchlist/${movieId}`);
    return response.data;
  },

  // History (using the backend's /history endpoints)
  getHistory: async () => {
    const response = await axiosInstance.get('/history');
    return response.data.history || [];
  },

  addHistory: async (movieId, duration = 120, completed = false) => {
    const response = await axiosInstance.post('/history', { movieId, duration, completed });
    return response.data;
  },

  // Ratings
  rateMovie: async (movieId, rating) => {
    const response = await axiosInstance.post('/ratings', { movieId, rating });
    return response.data;
  },

  getAverageRating: async (movieId) => {
    const response = await axiosInstance.get(`/ratings/average/${movieId}`);
    return response.data;
  },

  getUserRating: async (movieId) => {
    const response = await axiosInstance.get(`/ratings/user/${movieId}`);
    return response.data;
  },
};

