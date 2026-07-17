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

  getTopRatedMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/top-rated?page=${page}`);
    return response.data;
  },

  getUpcomingMovies: async (page = 1) => {
    const response = await axiosInstance.get(`/movies/upcoming?page=${page}`);
    return response.data;
  },

  getDiscoverMovies: async (genreId, page = 1) => {
    const response = await axiosInstance.get(`/movies/discover?genre=${genreId}&page=${page}`);
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
