// src/lib/api.js

export const TMDB_API_KEY = "ee72e28ae1c38a2417af9c80095f2141";
export const BASE_URL = "https://api.themoviedb.org/3";

// Backend base URLs
export const BACKEND_USER_URL = "http://localhost:5000/api/user";
export const BACKEND_AUTH_URL = "http://localhost:5000/api/auth";

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

    // User-related routes (require auth token)
    watchlist: `${BACKEND_USER_URL}/watchlist`,
    favourites: `${BACKEND_USER_URL}/favourites`,
    profile: `${BACKEND_USER_URL}/profile`,
    changePassword: `${BACKEND_USER_URL}/change-password`,
    sendResetOtp: `${BACKEND_USER_URL}/send-reset-otp`,
    resetPassword: `${BACKEND_USER_URL}/reset-password`,
    verifyPasswordOtp: `${BACKEND_USER_URL}/verify-reset-otp`,

    // Auth-related routes (login & signup)
    login: `${BACKEND_AUTH_URL}/login`,
    signup: `${BACKEND_AUTH_URL}/signup`,
    sendOTP: `${BACKEND_AUTH_URL}/send-otp`, // for login/signup
    verifyOTP: `${BACKEND_AUTH_URL}/verify-otp`, // for login/signup
};
