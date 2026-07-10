import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Create Axios Instance
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor to add JWT
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("cineai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock Database for Fallback Mode
const MOCK_MOVIES = [
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterPath: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    releaseDate: "2014-11-07",
    voteAverage: 8.6,
    runtime: 169,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    matchScore: 98,
    aiExplanation: "Matches your taste for high-concept science fiction, space travel, and emotional father-daughter dynamics.",
    pros: ["Stunning visual effects & cinematography", "Masterpiece score by Hans Zimmer", "Scientifically grounded concepts"],
    cons: ["Slightly long runtime", "Complex physics can be hard to follow"],
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&crop=faces" },
      { name: "Anne Hathaway", character: "Brand", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&crop=faces" },
      { name: "Jessica Chastain", character: "Murph", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "CinematicMaster", content: "A visual masterpiece that stretches the mind and tugs the heartstrings." },
      { author: "SciFiFanatic", content: "Hans Zimmer's organ score is absolutely breathtaking. Cooper's journey is epic." }
    ]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who steals valuable secrets from deep within the subconscious during the dream state, is given a inverse task: to plant an idea into the mind of a C.E.O.",
    posterPath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
    genres: ["Action", "Sci-Fi", "Thriller"],
    releaseDate: "2010-07-16",
    voteAverage: 8.8,
    runtime: 148,
    tagline: "Your mind is the scene of the crime.",
    matchScore: 96,
    aiExplanation: "Matches your viewing history of Christopher Nolan films and interest in psychological, mind-bending storylines.",
    pros: ["Mind-blowing original concept", "Incredible folding-city special effects", "Flawless ensemble cast performance"],
    cons: ["Requires high attention to follow rules", "Slightly cold emotional core"],
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&crop=faces" },
      { name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&fit=crop&crop=faces" },
      { name: "Elliot Page", character: "Ariadne", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "NolanFan", content: "Absolutely brilliant. The hallway fight scene is one of the best in cinema history." }
    ]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterPath: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    genres: ["Drama", "Action", "Crime", "Thriller"],
    releaseDate: "2008-07-18",
    voteAverage: 9.0,
    runtime: 152,
    tagline: "Why So Serious?",
    matchScore: 95,
    aiExplanation: "You enjoy gritty crime thrillers, intense psychological conflicts, and highly rated dark dramas.",
    pros: ["Heath Ledger's legendary Joker performance", "Complex moral questions", "Pacing feels like a bullet train"],
    cons: ["Two-Face subplot is slightly rushed", "Grave and somber tone throughout"],
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&crop=faces" },
      { name: "Heath Ledger", character: "Joker", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&fit=crop&crop=faces" },
      { name: "Gary Oldman", character: "Jim Gordon", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "GothamMayor", content: "The absolute peak of superhero cinema. More of a crime epic than a comic book movie." }
    ]
  },
  {
    id: 603,
    title: "The Matrix",
    overview: "Set in the 22nd century, a computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200&auto=format&fit=crop&q=80",
    genres: ["Sci-Fi", "Action"],
    releaseDate: "1999-03-30",
    voteAverage: 8.7,
    runtime: 136,
    tagline: "Free your mind.",
    matchScore: 92,
    aiExplanation: "Matches your profile's preference for cyberpunk aesthetics, martial arts action, and philosophical matrix themes.",
    pros: ["Revolutionary bullet-time effects", "Deep philosophical subtext", "Iconic visual style and costume design"],
    cons: ["Complex sequels might dampen the standalone experience", "Late 90s CGI is slightly visible in minor spots"],
    cast: [
      { name: "Keanu Reeves", character: "Neo", profile_path: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&crop=faces" },
      { name: "Laurence Fishburne", character: "Morpheus", profile_path: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "NeoLogician", content: "It redefined action movies forever. Still holds up perfectly today." }
    ]
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
    posterPath: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    genres: ["Drama"],
    releaseDate: "1994-09-23",
    voteAverage: 9.3,
    runtime: 142,
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    matchScore: 94,
    aiExplanation: "Top-rated movie on IMDb. Highly matches your taste for inspiring dramas with profound screenplays.",
    pros: ["Deeply moving story of hope and friendship", "Superb narration by Morgan Freeman", "Highly satisfying ending"],
    cons: ["Very slow pacing in parts", "Contains some harsh prison conditions depiction"],
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&crop=faces" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "HopeSeeker", content: "The best movie ever made. The redemption arc is absolutely flawless." }
    ]
  },
  {
    id: 11324,
    title: "Shutter Island",
    overview: "World War II soldier turned U.S. Marshal Teddy Daniels investigates the disappearance of a patient from Boston's Shutter Island Ashecliffe Hospital. He discovers shocking secrets and experiences visions.",
    posterPath: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60",
    backdropPath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    genres: ["Drama", "Thriller", "Mystery"],
    releaseDate: "2010-02-18",
    voteAverage: 8.2,
    runtime: 138,
    tagline: "Someone is missing.",
    matchScore: 90,
    aiExplanation: "Matches your affinity for psychological thrillers, dark mysteries, and mind-bending twist endings.",
    pros: ["Unbelievable double-twist ending", "Ominous and atmospheric cinematography", "Powerful acting by Leonardo DiCaprio"],
    cons: ["Extremely tense and claustrophobic feel", "Some unsettling horror-like dream sequences"],
    cast: [
      { name: "Leonardo DiCaprio", character: "Teddy Daniels", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&crop=faces" },
      { name: "Mark Ruffalo", character: "Chuck Aule", profile_path: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&fit=crop&crop=faces" }
    ],
    reviews: [
      { author: "TwistLover", content: "Mind blown! I had to watch it a second time immediately to spot all the clues." }
    ]
  }
];

const MOCK_PROFILE = {
  name: "Alexander",
  email: "alexander@cineai.com",
  avatar: "A",
  stats: {
    moviesWatched: 124,
    favorites: 36,
    hoursWatched: 278,
    genresExplored: 12,
    accuracy: 94
  },
  streaks: 7,
  favoriteGenres: ["Sci-Fi", "Thriller", "Drama", "Action"],
  favoriteDirectors: ["Christopher Nolan", "Martin Scorsese", "Denis Villeneuve"],
  badges: [
    { name: "Sci-Fi Connoisseur", description: "Watched over 30 sci-fi films", icon: "🚀" },
    { name: "Midnight Marauder", description: "Watched 5 movies after midnight", icon: "🦇" },
    { name: "Nolan Acolyte", description: "Watched all Christopher Nolan movies", icon: "🌀" },
    { name: "Cinematic Scholar", description: "Rated over 50 movies", icon: "🎓" }
  ]
};

// State wrappers for Favorites & Watchlist mocks (persist during SPA session)
let mockFavoritesList = [157336, 155];
let mockWatchlistList = [27205, 603];
let mockHistoryList = [
  { movieId: 157336, watchedAt: new Date().toISOString(), duration: 120, completed: false },
  { movieId: 278, watchedAt: new Date(Date.now() - 86400000).toISOString(), duration: 142, completed: true }
];

// Helper to check if API is alive, falls back transparently
const requestWrapper = async (apiCall, mockFallback) => {
  try {
    const isMockMode = localStorage.getItem("cineai_mock_mode") === "true";
    if (isMockMode) {
      console.warn("CineAI: Mock Mode is active.");
      return mockFallback();
    }
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.warn("CineAI Server offline, falling back to local simulation:", error.message);
    return mockFallback();
  }
};

export const api = {
  // Auth API
  register: async (name, email, password) => {
    return requestWrapper(
      () => axiosClient.post("/auth/register", { name, email, password }),
      () => {
        const fakeToken = "mock_jwt_token_for_" + email;
        localStorage.setItem("cineai_token", fakeToken);
        return {
          success: true,
          token: fakeToken,
          user: { id: "mock-id-1", name, email, avatar: name[0].toUpperCase() }
        };
      }
    );
  },

  login: async (email, password) => {
    return requestWrapper(
      () => axiosClient.post("/auth/login", { email, password }),
      () => {
        const fakeToken = "mock_jwt_token_for_" + email;
        localStorage.setItem("cineai_token", fakeToken);
        return {
          success: true,
          token: fakeToken,
          user: { id: "mock-id-1", name: MOCK_PROFILE.name, email, avatar: MOCK_PROFILE.name[0] }
        };
      }
    );
  },

  getProfile: async () => {
    return requestWrapper(
      () => axiosClient.get("/auth/profile"),
      () => ({
        success: true,
        user: { ...MOCK_PROFILE, favorites: mockFavoritesList, watchlist: mockWatchlistList, history: mockHistoryList }
      })
    );
  },

  // Favorites & Watchlist Actions
  addFavorite: async (movieId) => {
    return requestWrapper(
      () => axiosClient.post("/users/favorites", { movieId }),
      () => {
        if (!mockFavoritesList.includes(Number(movieId))) {
          mockFavoritesList.push(Number(movieId));
        }
        return { success: true, favorites: mockFavoritesList };
      }
    );
  },

  removeFavorite: async (movieId) => {
    return requestWrapper(
      () => axiosClient.delete(`/users/favorites/${movieId}`),
      () => {
        mockFavoritesList = mockFavoritesList.filter(id => id !== Number(movieId));
        return { success: true, favorites: mockFavoritesList };
      }
    );
  },

  addWatchlist: async (movieId) => {
    return requestWrapper(
      () => axiosClient.post("/users/watchlist", { movieId }),
      () => {
        if (!mockWatchlistList.includes(Number(movieId))) {
          mockWatchlistList.push(Number(movieId));
        }
        return { success: true, watchlist: mockWatchlistList };
      }
    );
  },

  removeWatchlist: async (movieId) => {
    return requestWrapper(
      () => axiosClient.delete(`/users/watchlist/${movieId}`),
      () => {
        mockWatchlistList = mockWatchlistList.filter(id => id !== Number(movieId));
        return { success: true, watchlist: mockWatchlistList };
      }
    );
  },

  // Watch History
  addHistory: async (movieId, duration, completed) => {
    return requestWrapper(
      () => axiosClient.post("/history", { movieId, duration, completed }),
      () => {
        const idx = mockHistoryList.findIndex(h => h.movieId === Number(movieId));
        if (idx !== -1) {
          mockHistoryList[idx] = { movieId: Number(movieId), watchedAt: new Date().toISOString(), duration, completed };
        } else {
          mockHistoryList.push({ movieId: Number(movieId), watchedAt: new Date().toISOString(), duration, completed });
        }
        return { success: true, history: mockHistoryList };
      }
    );
  },

  getHistory: async () => {
    return requestWrapper(
      () => axiosClient.get("/history"),
      () => ({ success: true, history: mockHistoryList })
    );
  },

  // Movie Data API
  getTrendingMovies: async (page = 1) => {
    return requestWrapper(
      () => axiosClient.get(`/movies/trending?page=${page}`),
      () => ({ results: MOCK_MOVIES })
    );
  },

  getPopularMovies: async (page = 1) => {
    return requestWrapper(
      () => axiosClient.get(`/movies/popular?page=${page}`),
      () => ({ results: [...MOCK_MOVIES].reverse() })
    );
  },

  searchMovies: async (query) => {
    return requestWrapper(
      () => axiosClient.get(`/movies/search?query=${encodeURIComponent(query)}`),
      () => {
        const results = MOCK_MOVIES.filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) || 
          m.overview.toLowerCase().includes(query.toLowerCase()) ||
          m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
        );
        return { results };
      }
    );
  },

  getMovieDetails: async (movieId) => {
    return requestWrapper(
      () => axiosClient.get(`/movies/${movieId}`),
      () => {
        const found = MOCK_MOVIES.find(m => m.id === Number(movieId));
        return found ? found : MOCK_MOVIES[0];
      }
    );
  },

  getGenres: async () => {
    return requestWrapper(
      () => axiosClient.get("/movies/genres"),
      () => ({
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 18, name: "Drama" },
          { id: 878, name: "Sci-Fi" },
          { id: 53, name: "Thriller" },
          { id: 9648, name: "Mystery" }
        ]
      })
    );
  },

  // Recommendations API
  getRecommendations: async (movieName) => {
    return requestWrapper(
      () => axiosClient.get(`/recommendations?movie=${encodeURIComponent(movieName)}`),
      () => MOCK_MOVIES
    );
  },

  getHybridRecommendations: async (movieName = "") => {
    return requestWrapper(
      () => axiosClient.get(`/recommendations/hybrid?movie=${encodeURIComponent(movieName)}`),
      () => ({
        content: MOCK_MOVIES,
        collaborative: [...MOCK_MOVIES].reverse().slice(0, 3)
      })
    );
  },

  // AI Chat API
  chat: async (prompt) => {
    return requestWrapper(
      () => axiosClient.post("/chat", { prompt }),
      async () => {
        // Simulate a slight network lag for the typewriter/AI feel
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const text = prompt.toLowerCase();
        if (text.includes("sci-fi") || text.includes("science")) {
          return {
            success: true,
            response: {
              text: "I highly recommend checking out Christopher Nolan's masterpieces. **Interstellar** (98% match) offers a scientifically accurate portrayal of black holes and a powerful father-daughter story. **Inception** (96% match) explores architectural dreams and is a phenomenal sci-fi heist movie.",
              movies: [157336, 27205]
            }
          };
        } else if (text.includes("thriller") || text.includes("mind")) {
          return {
            success: true,
            response: {
              text: "For mind-bending thrillers, check out **Shutter Island** (90% match) with Leonardo DiCaprio, which has one of the most stunning psychological twist endings, or **The Dark Knight** (95% match), an incredible crime thriller.",
              movies: [11324, 155]
            }
          };
        } else {
          return {
            success: true,
            response: {
              text: "CineAI Assistant matches your mood! Here are some top-rated recommendations that you might enjoy: **The Shawshank Redemption** (94% match) and **The Matrix** (92% match). Let me know if you would like me to specialize these by genre or release year!",
              movies: [278, 603]
            }
          };
        }
      }
    );
  }
};
