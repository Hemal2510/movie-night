// src/lib/api.js
export const TMDB_API_KEY = "ee72e28ae1c38a2417af9c80095f2141";
export const BASE_URL = "https://api.themoviedb.org/3";

export const urls = {
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

  

};
