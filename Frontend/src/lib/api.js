// src/lib/api.js

export const TMDB_API_KEY = "ee72e28ae1c38a2417af9c80095f2141";
export const BASE_URL = "https://api.themoviedb.org/3";

// Backend base URLs
export const BACKEND_BASE_URL = "http://localhost:5000/api/user";
export const AUTH_BASE_URL = "http://localhost:5000/api/auth";

export const urls = {
  // TMDB API endpoints
  trending: `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`,
  popular: `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`,
  discover: (filters = "") =>
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&${filters}`,
  search: (query) =>
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`,
  movieDetails: (id) =>
    `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos`,
  watchProviders: (id) =>
    `${BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
  discoverByLanguage: (lang, page = 1) =>
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`,

  // Backend user-related routes
  watchlist: `${BACKEND_BASE_URL}/watchlist`,
  favourites: `${BACKEND_BASE_URL}/favourites`,

  // Backend auth-related routes
  login: `${AUTH_BASE_URL}/login`,
  signup: `${AUTH_BASE_URL}/signup`,
  sendOTP: `${AUTH_BASE_URL}/send-otp`,
  verifyOTP: `${AUTH_BASE_URL}/verify-otp`,
};
