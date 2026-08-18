import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function runtimeToLabel(runtime) {
  if (!runtime || runtime === 'N/A') return null;
  return runtime; // OMDB already gives "136 min"
}

function imdbStars(rating) {
  if (!rating || rating === 'N/A') return null;
  const num = parseFloat(rating);
  return isNaN(num) ? null : num.toFixed(1);
}

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Supports both OMDB shape and backend shape
  const title    = movie.Title   || movie.title   || 'Untitled';
  const year     = movie.Year    || movie.releaseDate || '';
  const poster   = (movie.Poster !== 'N/A' && movie.Poster) || movie.posterUrl || null;
  const genre    = movie.Genre   || movie.genre   || '';
  const rating   = movie.imdbRating || null;
  const runtime  = runtimeToLabel(movie.Runtime || '');
  const imdbId   = movie.imdbID  || null;
  const language = movie.Language || movie.language || '';

  // Hide the entire card if there's no poster URL or the image fails to load
  if (!poster || imgError) return null;

  const handleClick = () => {
    if (imdbId) {
      navigate(`/movies/${imdbId}`, { state: { movie } });
    } else {
      navigate(`/movies/${movie.id}`, { state: { movie } });
    }
  };

  const firstGenre = genre.split(',')[0].trim();
  const lang = language.split(',')[0].trim();

  return (
    <div
      className="movie-card fade-in"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="movie-poster-wrap">
        <img
          src={poster}
          alt={title}
          className="movie-poster"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* IMDb rating badge on poster */}
        {rating && rating !== 'N/A' && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'rgba(14,15,20,0.85)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(245,200,66,0.30)',
            borderRadius: '6px', padding: '3px 8px',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold-400)',
          }}>
            ⭐ {imdbStars(rating)}
          </div>
        )}

        <div className="movie-poster-overlay">
          <button className="btn btn-primary btn-sm">Book Now</button>
        </div>
      </div>

      <div className="movie-info">
        <div className="movie-title" title={title}>{title}</div>
        <div className="movie-meta">
          {firstGenre && <span className="badge badge-gold">{firstGenre}</span>}
          {year && <span className="badge badge-muted">{year}</span>}
          {lang && lang !== 'English' && <span className="badge badge-blue">{lang}</span>}
        </div>
        {runtime && (
          <div className="movie-duration">
            <span>⏱</span> {runtime}
          </div>
        )}
      </div>
    </div>
  );
}
