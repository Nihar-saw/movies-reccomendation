import axiosInstance from './axios';

export const recommendationApi = {
  getRecommendations: async (movieName = '') => {
    const response = await axiosInstance.get(`/recommendations?movie=${encodeURIComponent(movieName)}`);
    return response.data;
  },

  getHybridRecommendations: async (movieName = '') => {
    const response = await axiosInstance.get(`/recommendations/hybrid?movie=${encodeURIComponent(movieName)}`);
    return response.data;
  },

  getPersonalizedRecommendations: async () => {
    const response = await axiosInstance.get('/recommendations/personalized');
    return response.data;
  },

  chat: async (prompt) => {
    const response = await axiosInstance.post('/chat', { prompt });
    return response.data;
  },
};
