import axiosInstance from './axios';

export const movieApi = {
  getTrendingMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/trending?page=${page}`);
    return response.data;
  },

  getPopularMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Fallback to popular since backend doesn't have dedicated /movies/top-rated endpoint
  getTopRatedMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Fallback to trending since backend doesn't have dedicated /movies/upcoming endpoint
  getUpcomingMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/trending?page=${page}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await axiosInstance.get('/movies/genres');
    return response.data;
  },

  getMovieDetails: async (id) => {
    const response = await axiosInstance.get(`/movies/${id}`);
    return response.data;
  },

  searchMovies: async (query) => {
    const response = await axiosInstance.get(`/movies/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
