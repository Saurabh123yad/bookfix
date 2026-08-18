const OMDB_API_KEY = 'aceb4e86';
const OMDB_BASE = 'https://www.omdbapi.com';

// Search movies by query string
export async function searchMovies(query) {
  const res = await fetch(`${OMDB_BASE}/?s=${encodeURIComponent(query)}&type=movie&apikey=${OMDB_API_KEY}`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'No results');
  // Filter out movies with no poster image
  return data.Search.filter(m => m.Poster && m.Poster !== 'N/A');
}

// Get full movie details by IMDb ID (e.g. "tt3896198")
export async function getMovieById(imdbId) {
  const res = await fetch(`${OMDB_BASE}/?i=${imdbId}&plot=full&apikey=${OMDB_API_KEY}`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Movie not found');
  return data;
}

// Get full movie details by title
export async function getMovieByTitle(title) {
  const res = await fetch(`${OMDB_BASE}/?t=${encodeURIComponent(title)}&plot=full&apikey=${OMDB_API_KEY}`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Movie not found');
  return data;
}

// Curated popular searches shown on the home page
export const POPULAR_SEARCHES = [
  'avengers', 'batman', 'inception', 'interstellar',
  'spider-man', 'iron man', 'dark knight', 'oppenheimer',
];
