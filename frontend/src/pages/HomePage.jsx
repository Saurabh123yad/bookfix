import React, { useEffect, useState, useCallback, useRef } from 'react';
import { searchMovies, POPULAR_SEARCHES } from '../api/omdbApi';
import MovieCard from '../components/MovieCard';

const CATEGORIES = [
  { label: 'Trending',    query: 'avengers' },
  { label: 'Action',      query: 'action 2024' },
  { label: 'Sci-Fi',      query: 'interstellar' },
  { label: 'Thriller',    query: 'dark knight' },
  { label: 'Comedy',      query: 'comedy 2023' },
  { label: 'Animation',   query: 'pixar' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function HomePage() {
  const [movies, setMovies]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchResults, setSearchResults]   = useState([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [searchError, setSearchError]       = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const inputRef = useRef(null);

  // Load default category movies
  const loadCategory = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(cat.query);
      setMovies(results);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategory(activeCategory);
  }, [activeCategory, loadCategory]);

  // Live search via OMDB
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    searchMovies(debouncedSearch)
      .then(results => setSearchResults(results))
      .catch(err => { setSearchError(err.message); setSearchResults([]); })
      .finally(() => setSearchLoading(false));
  }, [debouncedSearch]);

  const isSearching = searchQuery.trim().length > 0;
  const displayMovies = isSearching ? searchResults : movies;
  const isLoading = isSearching ? searchLoading : loading;
  const displayError = isSearching ? searchError : error;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ─── Hero ─── */}
        <div className="hero fade-in">
          <div className="hero-bg">
            <div className="hero-bg-pattern" />
            <div className="hero-bg-film" />
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">Movies</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Cinemas</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-value">OMDB</div>
              <div className="hero-stat-label">Powered</div>
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">Live Movie Database</span>
            </div>
            <h1 className="hero-title">
              Find & book <span>any movie</span>,<br />any time
            </h1>
            <p className="hero-subtitle">
              Powered by OMDB — search millions of movies, see ratings,
              pick your seats and book instantly.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-gold btn-lg"
                onClick={() => {
                  document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => inputRef.current?.focus(), 500);
                }}
              >
                🔍 Search Movies
              </button>
              <button className="btn btn-outline btn-lg"
                onClick={() => document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' })}>
                Browse All
              </button>
            </div>
          </div>
        </div>

        {/* ─── Main Section ─── */}
        <section className="section" id="movies-section">

          {/* Search Bar */}
          <div className="search-wrap">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search for any movie… e.g. Inception, Batman, Avengers"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery ? (
              <button className="search-clear" onClick={() => setSearchQuery('')} title="Clear">✕</button>
            ) : (
              <span className="search-icon">🔍</span>
            )}
          </div>

          {/* Category Tabs — hidden while searching */}
          {!isSearching && (
            <>
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <h2 className="section-title">
                  <span className="section-title-accent" />
                  {activeCategory.label}
                </h2>
              </div>
              <div className="genre-tabs">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    className={`btn btn-sm ${activeCategory.label === cat.label ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Search heading */}
          {isSearching && (
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 className="section-title">
                <span className="section-title-accent" />
                {searchLoading ? 'Searching…' : `Results for "${searchQuery}"`}
              </h2>
              {!searchLoading && searchResults.length > 0 && (
                <span className="badge badge-muted">{searchResults.length} found</span>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="state-container">
              <div className="spinner" />
              <span className="state-subtitle">
                {isSearching ? `Searching "${searchQuery}"…` : `Loading ${activeCategory.label}…`}
              </span>
            </div>
          )}

          {/* Error */}
          {!isLoading && displayError && (
            <div className="state-container">
              <div className="state-icon">🎬</div>
              <div className="state-title">
                {isSearching ? `No results for "${searchQuery}"` : 'Could not load movies'}
              </div>
              <p className="state-subtitle">{displayError}</p>
              {isSearching ? (
                <button className="btn btn-ghost" onClick={() => setSearchQuery('')}>Clear search</button>
              ) : (
                <button className="btn btn-primary" onClick={() => loadCategory(activeCategory)}>Retry</button>
              )}
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && !displayError && displayMovies.length > 0 && (
            <div className="movies-grid">
              {displayMovies.map(movie => (
                <MovieCard key={movie.imdbID || movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Empty search */}
          {!isLoading && !displayError && isSearching && searchResults.length === 0 && !searchLoading && (
            <div className="state-container">
              <div className="state-icon">🎭</div>
              <div className="state-title">No movies found</div>
              <p className="state-subtitle">Try a different title or keyword.</p>
            </div>
          )}

          {/* Popular Searches hint when idle */}
          {!isSearching && !isLoading && (
            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Popular searches
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {POPULAR_SEARCHES.map(term => (
                  <button
                    key={term}
                    className="btn btn-ghost btn-sm"
                    style={{ border: '1px solid var(--border-subtle)', textTransform: 'capitalize' }}
                    onClick={() => { setSearchQuery(term); inputRef.current?.focus(); }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
