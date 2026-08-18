import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMovieById } from '../api/omdbApi';

function generateMockShows(imdbId) {
  const seed = imdbId ? imdbId.replace(/\D/g, '').slice(-4) : '1234';
  const seedNum = parseInt(seed) || 1234;
  const times = ['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '10:00 PM'];
  const theaters = [
    { name: 'PVR Cinemas IMAX',   screen: 'Screen 1 – IMAX Laser',  city: 'Mumbai' },
    { name: 'INOX Multiplex',     screen: 'Audi 3 – Dolby Atmos',   city: 'Mumbai' },
    { name: 'Cinepolis',          screen: 'Screen 7 – 4DX',          city: 'Pune' },
    { name: 'Carnival Cinemas',   screen: 'Screen 2 – Standard',     city: 'Delhi' },
  ];
  return times.map((t, i) => ({
    id: seedNum * 10 + i + 1,
    time: t,
    theater: theaters[i % theaters.length],
    price: 200 + (i * 40),
    seats: Math.floor((seedNum + i * 7) % 60) + 10,
  }));
}

function RatingBar({ source, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '120px' }}>{source}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-400)' }}>{value}</span>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id }      = useParams();  // imdbID like tt3896198
  const navigate    = useNavigate();
  const location    = useLocation();
  const cached      = location.state?.movie;   // passed from MovieCard

  const [movie, setMovie]   = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError]   = useState(null);

  const shows = generateMockShows(id);

  useEffect(() => {
    // If we already have full OMDB data from state (has Plot), skip fetch
    if (cached?.Plot) return;
    setLoading(true);
    getMovieById(id)
      .then(data => setMovie(data))
      .catch(() => setError('Movie not found or API error.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="state-container"><div className="spinner" /></div>
    </div>
  );

  if (error || !movie) return (
    <div className="page-wrapper">
      <div className="state-container">
        <div className="state-icon">🎭</div>
        <div className="state-title">Movie not found</div>
        <button className="btn btn-outline" onClick={() => navigate('/')}>← Back to Movies</button>
      </div>
    </div>
  );

  const title     = movie.Title    || movie.title    || 'Untitled';
  const poster    = (movie.Poster !== 'N/A' && movie.Poster) || movie.posterUrl || null;
  const year      = movie.Year     || '';
  const runtime   = movie.Runtime  || '';
  const genre     = movie.Genre    || movie.genre    || '';
  const language  = movie.Language || movie.language || '';
  const plot      = movie.Plot     || movie.description || '';
  const director  = movie.Director || '';
  const actors    = movie.Actors   || '';
  const rated     = movie.Rated    || 'UA';
  const imdbRating = movie.imdbRating || '';
  const ratings   = movie.Ratings  || [];
  const boxOffice = movie.BoxOffice || '';
  const awards    = movie.Awards   || '';
  const country   = movie.Country  || '';

  const genres = genre.split(',').map(g => g.trim()).filter(Boolean);

  return (
    <div className="page-wrapper fade-in">
      <div className="container">

        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}
          style={{ marginBottom: '20px' }}>
          ← Back
        </button>

        {/* ─── Hero Banner ─── */}
        <div className="movie-detail-hero">
          <div className="movie-detail-hero-bg" />
          <div className="movie-detail-content">

            {/* Poster */}
            <div className="movie-detail-poster">
              {poster
                ? <img src={poster} alt={title} />
                : <div className="poster-placeholder" style={{ height: '100%' }}>🎞️</div>
              }
            </div>

            {/* Info */}
            <div className="movie-detail-info">
              <div className="movie-detail-genre-row">
                {genres.slice(0, 3).map(g => (
                  <span key={g} className="badge badge-gold">{g}</span>
                ))}
                {rated && rated !== 'N/A' && (
                  <span className="badge badge-muted">{rated}</span>
                )}
                {language && <span className="badge badge-blue">{language.split(',')[0].trim()}</span>}
              </div>

              <h1 className="movie-detail-title">{title}</h1>

              <div className="movie-detail-meta-row">
                {year && year !== 'N/A' && (
                  <span className="meta-item"><span className="icon">📅</span> {year}</span>
                )}
                {runtime && runtime !== 'N/A' && (
                  <span className="meta-item"><span className="icon">⏱</span> {runtime}</span>
                )}
                {imdbRating && imdbRating !== 'N/A' && (
                  <span className="meta-item">
                    <span className="icon">⭐</span>
                    <strong style={{ color: 'var(--gold-400)' }}>{imdbRating}</strong>/10
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&nbsp;IMDb</span>
                  </span>
                )}
                {country && country !== 'N/A' && (
                  <span className="meta-item"><span className="icon">🌍</span> {country.split(',')[0].trim()}</span>
                )}
              </div>

              {plot && plot !== 'N/A' && (
                <p className="movie-detail-description">{plot}</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Extra Details ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', marginBottom: '40px' }}>

          {/* Cast & Crew */}
          <div>
            {director && director !== 'N/A' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '6px' }}>Director</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{director}</p>
              </div>
            )}
            {actors && actors !== 'N/A' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>Cast</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {actors.split(',').map(a => (
                    <span key={a.trim()} className="badge badge-muted" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                      {a.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {awards && awards !== 'N/A' && (
              <div style={{ padding: '14px 16px', background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.15)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-500)' }}>🏆 {awards}</span>
              </div>
            )}
          </div>

          {/* Ratings Panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              Ratings
            </p>
            {ratings.map(r => (
              <RatingBar key={r.Source} source={r.Source} value={r.Value} />
            ))}
            {boxOffice && boxOffice !== 'N/A' && (
              <>
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '14px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Box Office</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>{boxOffice}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── Shows ─── */}
        <section className="shows-section">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h2 className="section-title">
              <span className="section-title-accent" />
              Select a Show
            </h2>
            <span className="badge badge-muted">Today</span>
          </div>

          <div className="shows-grid">
            {shows.map(show => (
              <div
                key={show.id}
                className="show-item"
                onClick={() => navigate(`/shows/${show.id}/seats`, {
                  state: { show, movie: { ...movie, title, posterUrl: poster } }
                })}
              >
                <div className="show-time">{show.time}</div>
                <div className="show-divider" />
                <div className="show-venue">
                  <div className="show-venue-name">{show.theater.name}</div>
                  <div className="show-venue-screen">{show.theater.screen} · {show.theater.city}</div>
                </div>
                <div className="show-seats-info">
                  <div className="show-price">₹{show.price}</div>
                  <div className="show-availability">✓ {show.seats} seats left</div>
                </div>
                <button className="btn btn-outline btn-sm">Select →</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
