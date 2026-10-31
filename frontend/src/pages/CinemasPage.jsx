import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../api/omdbApi';

const CINEMAS = [
  // ─── INDIA ───────────────────────────────────────────────
  {
    id: 1, name: 'PVR: Phoenix Palladium', city: 'Mumbai', country: 'India',
    region: 'India', type: 'Multiplex', screens: 11, rating: 4.5,
    address: 'Lower Parel, Mumbai, Maharashtra',
    features: ['IMAX', 'Dolby Atmos', '4DX', 'Recliner'],
    flag: '🇮🇳', emoji: '🎬', price: '₹250–₹800',
  },
  {
    id: 2, name: 'INOX: GVK One Mall', city: 'Hyderabad', country: 'India',
    region: 'India', type: 'Multiplex', screens: 8, rating: 4.4,
    address: 'Banjara Hills, Hyderabad, Telangana',
    features: ['Dolby Atmos', 'IMAX', 'Recliner'],
    flag: '🇮🇳', emoji: '🎭', price: '₹200–₹700',
  },
  {
    id: 3, name: 'Cinepolis: DLF Mall', city: 'Delhi', country: 'India',
    region: 'India', type: 'Multiplex', screens: 9, rating: 4.3,
    address: 'Saket, New Delhi',
    features: ['VIP Lounge', 'Dolby', '3D'],
    flag: '🇮🇳', emoji: '🎪', price: '₹200–₹750',
  },
  {
    id: 4, name: 'Miraj Cinemas: Gopalan', city: 'Bangalore', country: 'India',
    region: 'India', type: 'Multiplex', screens: 6, rating: 4.2,
    address: 'Mysore Road, Bangalore, Karnataka',
    features: ['3D', 'Dolby', 'Recliner'],
    flag: '🇮🇳', emoji: '🎥', price: '₹150–₹600',
  },
  {
    id: 5, name: 'PVR: Forum Vijaya Mall', city: 'Chennai', country: 'India',
    region: 'India', type: 'Multiplex', screens: 10, rating: 4.5,
    address: 'Vadapalani, Chennai, Tamil Nadu',
    features: ['IMAX', 'Dolby Atmos', '4DX'],
    flag: '🇮🇳', emoji: '🎬', price: '₹250–₹850',
  },
  {
    id: 6, name: 'Carnival Cinemas: Ahmedabad', city: 'Ahmedabad', country: 'India',
    region: 'India', type: 'Multiplex', screens: 5, rating: 4.0,
    address: 'Vastrapur, Ahmedabad, Gujarat',
    features: ['3D', 'Dolby'],
    flag: '🇮🇳', emoji: '🎦', price: '₹120–₹450',
  },
  {
    id: 7, name: 'INOX: City Pride', city: 'Pune', country: 'India',
    region: 'India', type: 'Multiplex', screens: 7, rating: 4.3,
    address: 'Satara Road, Pune, Maharashtra',
    features: ['IMAX', 'Dolby Atmos', 'Recliner'],
    flag: '🇮🇳', emoji: '🎭', price: '₹180–₹650',
  },
  {
    id: 8, name: 'Fun Cinemas: South City Mall', city: 'Kolkata', country: 'India',
    region: 'India', type: 'Multiplex', screens: 8, rating: 4.1,
    address: 'Jodhpur Park, Kolkata, West Bengal',
    features: ['Dolby', '3D', 'VIP'],
    flag: '🇮🇳', emoji: '🎪', price: '₹150–₹550',
  },

  // ─── UTTAR PRADESH, INDIA ─────────────────────────────────
  {
    id: 25, name: 'PVR: Phoenix United Mall', city: 'Lucknow', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 10, rating: 4.5,
    address: 'Lucknow-Kanpur Highway, Faizabad Road, Lucknow, UP',
    features: ['IMAX', 'Dolby Atmos', 'Recliner', '3D'],
    flag: '🇮🇳', emoji: '🕌', price: '₹180–₹650',
  },
  {
    id: 26, name: 'Cinepolis: Sahara Ganj Mall', city: 'Lucknow', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 7, rating: 4.3,
    address: 'Sahara Ganj Mall, Hazratganj, Lucknow, UP',
    features: ['Dolby Atmos', '3D', 'VIP Lounge'],
    flag: '🇮🇳', emoji: '🎬', price: '₹160–₹600',
  },
  {
    id: 27, name: 'INOX: Z Square Mall', city: 'Kanpur', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 6, rating: 4.2,
    address: 'Z Square Mall, Mall Road, Kanpur, UP',
    features: ['Dolby', '3D', 'Recliner'],
    flag: '🇮🇳', emoji: '🎭', price: '₹150–₹550',
  },
  {
    id: 28, name: 'Miraj Cinemas: Kanpur', city: 'Kanpur', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 5, rating: 4.0,
    address: 'Vikas Nagar, Kanpur, UP',
    features: ['3D', 'Dolby'],
    flag: '🇮🇳', emoji: '🎥', price: '₹120–₹450',
  },
  {
    id: 29, name: 'PVR: Agra', city: 'Agra', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 5, rating: 4.1,
    address: 'Taj Nagari Phase-2, Fatehabad Road, Agra, UP',
    features: ['Dolby Atmos', '3D', 'Recliner'],
    flag: '🇮🇳', emoji: '🕍', price: '₹140–₹500',
  },
  {
    id: 30, name: 'Cinepolis: Varanasi', city: 'Varanasi', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 4, rating: 4.0,
    address: 'Manduadih, Varanasi, UP',
    features: ['Dolby', '3D'],
    flag: '🇮🇳', emoji: '🪔', price: '₹130–₹480',
  },
  {
    id: 31, name: 'Fun Republic: Prayagraj', city: 'Prayagraj', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 5, rating: 4.1,
    address: 'Civil Lines, Prayagraj, UP',
    features: ['Dolby', '3D', 'VIP'],
    flag: '🇮🇳', emoji: '🏛️', price: '₹130–₹490',
  },
  {
    id: 32, name: 'PVR: DLF Mall of India', city: 'Noida', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 12, rating: 4.6,
    address: 'DLF Mall of India, Sector 18, Noida, UP',
    features: ['IMAX', 'Dolby Atmos', '4DX', 'Recliner'],
    flag: '🇮🇳', emoji: '🏙️', price: '₹200–₹750',
  },
  {
    id: 33, name: 'Wave Cinemas: Ghaziabad', city: 'Ghaziabad', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 8, rating: 4.2,
    address: 'Pacific Mall, Kaushambi, Ghaziabad, UP',
    features: ['Dolby Atmos', '3D', 'Recliner'],
    flag: '🇮🇳', emoji: '🎦', price: '₹150–₹550',
  },
  {
    id: 34, name: 'Carnival Cinemas: Meerut', city: 'Meerut', country: 'India',
    region: 'Uttar Pradesh', type: 'Multiplex', screens: 4, rating: 3.9,
    address: 'Shatabdi Nagar, Meerut, UP',
    features: ['3D', 'Dolby'],
    flag: '🇮🇳', emoji: '🎪', price: '₹110–₹400',
  },

  // ─── USA ─────────────────────────────────────────────────
  {
    id: 9, name: 'AMC Empire 25', city: 'New York', country: 'USA',
    region: 'Americas', type: 'Megaplex', screens: 25, rating: 4.6,
    address: '234 W 42nd St, New York, NY',
    features: ['IMAX', 'Dolby Cinema', 'Laser', '4DX'],
    flag: '🇺🇸', emoji: '🗽', price: '$15–$35',
  },
  {
    id: 10, name: 'TCL Chinese Theatre', city: 'Hollywood', country: 'USA',
    region: 'Americas', type: 'Iconic', screens: 6, rating: 4.8,
    address: '6925 Hollywood Blvd, Hollywood, CA',
    features: ['IMAX', 'Dolby Atmos', 'Historical'],
    flag: '🇺🇸', emoji: '⭐', price: '$18–$40',
  },
  {
    id: 11, name: 'Regal Union Square', city: 'San Francisco', country: 'USA',
    region: 'Americas', type: 'Multiplex', screens: 14, rating: 4.3,
    address: '850 Market St, San Francisco, CA',
    features: ['4DX', 'ScreenX', 'IMAX'],
    flag: '🇺🇸', emoji: '🌉', price: '$16–$32',
  },
  {
    id: 12, name: 'Cinemark XD: Dallas', city: 'Dallas', country: 'USA',
    region: 'Americas', type: 'Multiplex', screens: 18, rating: 4.4,
    address: 'Mockingbird Lane, Dallas, TX',
    features: ['XD', 'Dolby', 'Recliner'],
    flag: '🇺🇸', emoji: '🤠', price: '$14–$28',
  },

  // ─── UK ──────────────────────────────────────────────────
  {
    id: 13, name: 'Odeon: Leicester Square', city: 'London', country: 'UK',
    region: 'Europe', type: 'Flagship', screens: 7, rating: 4.7,
    address: '24-26 Leicester Square, London',
    features: ['IMAX', 'Dolby Atmos', 'Luxe'],
    flag: '🇬🇧', emoji: '🇬🇧', price: '£14–£30',
  },
  {
    id: 14, name: 'Cineworld: Glasgow', city: 'Glasgow', country: 'UK',
    region: 'Europe', type: 'Multiplex', screens: 18, rating: 4.2,
    address: 'Renfrew St, Glasgow, Scotland',
    features: ['IMAX', '4DX', 'ScreenX'],
    flag: '🇬🇧', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', price: '£12–£25',
  },

  // ─── UAE ─────────────────────────────────────────────────
  {
    id: 15, name: 'VOX Cinemas: Mall of Emirates', city: 'Dubai', country: 'UAE',
    region: 'Middle East', type: 'Luxury', screens: 24, rating: 4.8,
    address: 'Mall of Emirates, Al Barsha, Dubai',
    features: ['IMAX', '4DX', 'THEATRE by Rhodes', 'Kids'],
    flag: '🇦🇪', emoji: '🌆', price: 'AED 45–150',
  },
  {
    id: 16, name: 'Novo Cinemas: Ibn Battuta', city: 'Dubai', country: 'UAE',
    region: 'Middle East', type: 'Multiplex', screens: 21, rating: 4.5,
    address: 'Ibn Battuta Mall, Jebel Ali, Dubai',
    features: ['IMAX', 'Dolby Atmos', 'Recliner'],
    flag: '🇦🇪', emoji: '🕌', price: 'AED 40–120',
  },

  // ─── JAPAN ───────────────────────────────────────────────
  {
    id: 17, name: 'Toho Cinemas Shinjuku', city: 'Tokyo', country: 'Japan',
    region: 'Asia', type: 'Multiplex', screens: 13, rating: 4.6,
    address: 'Shinjuku, Tokyo',
    features: ['IMAX', 'Dolby Atmos', '4DX', 'Laser'],
    flag: '🇯🇵', emoji: '🗼', price: '¥1,900–¥3,500',
  },
  {
    id: 18, name: 'United Cinemas: Osaka', city: 'Osaka', country: 'Japan',
    region: 'Asia', type: 'Multiplex', screens: 10, rating: 4.4,
    address: 'Namba, Osaka',
    features: ['IMAX', 'Dolby', '3D'],
    flag: '🇯🇵', emoji: '🏯', price: '¥1,800–¥3,000',
  },

  // ─── AUSTRALIA ───────────────────────────────────────────
  {
    id: 19, name: 'Event Cinemas: George St', city: 'Sydney', country: 'Australia',
    region: 'Asia Pacific', type: 'Multiplex', screens: 16, rating: 4.4,
    address: '505 George St, Sydney, NSW',
    features: ['VMAX', 'Gold Class', 'Dolby Atmos'],
    flag: '🇦🇺', emoji: '🦘', price: 'A$18–$45',
  },
  {
    id: 20, name: 'Hoyts: Melbourne Central', city: 'Melbourne', country: 'Australia',
    region: 'Asia Pacific', type: 'Multiplex', screens: 12, rating: 4.3,
    address: 'Melbourne Central, Melbourne, VIC',
    features: ['LUX', 'Dolby', 'IMAX'],
    flag: '🇦🇺', emoji: '🏙️', price: 'A$16–$40',
  },

  // ─── FRANCE ──────────────────────────────────────────────
  {
    id: 21, name: 'UGC Ciné Cité: Les Halles', city: 'Paris', country: 'France',
    region: 'Europe', type: 'Multiplex', screens: 27, rating: 4.5,
    address: '7 Place de la Rotonde, Paris',
    features: ['IMAX', 'Dolby Atmos', '4DX'],
    flag: '🇫🇷', emoji: '🗼', price: '€11–€22',
  },

  // ─── CANADA ──────────────────────────────────────────────
  {
    id: 22, name: 'Cineplex: Scotiabank Theatre', city: 'Toronto', country: 'Canada',
    region: 'Americas', type: 'Multiplex', screens: 13, rating: 4.4,
    address: '259 Richmond St W, Toronto, ON',
    features: ['IMAX', 'UltraAVX', 'D-BOX'],
    flag: '🇨🇦', emoji: '🍁', price: 'C$14–$28',
  },

  // ─── SINGAPORE ───────────────────────────────────────────
  {
    id: 23, name: 'Golden Village: Vivocity', city: 'Singapore', country: 'Singapore',
    region: 'Asia', type: 'Multiplex', screens: 15, rating: 4.6,
    address: 'VivoCity, Harbourfront, Singapore',
    features: ['IMAX', 'Gold Class', 'Atmos', '4DX'],
    flag: '🇸🇬', emoji: '🦁', price: 'S$13–$30',
  },

  // ─── GERMANY ─────────────────────────────────────────────
  {
    id: 24, name: 'CinemaxX: Hamburg', city: 'Hamburg', country: 'Germany',
    region: 'Europe', type: 'Multiplex', screens: 14, rating: 4.3,
    address: 'Dammtorwall 15, Hamburg',
    features: ['IMAX', 'Dolby Atmos', '4DX'],
    flag: '🇩🇪', emoji: '🏰', price: '€10–€22',
  },
];

const REGIONS = ['All', 'India', 'Uttar Pradesh', 'Americas', 'Europe', 'Middle East', 'Asia', 'Asia Pacific'];
const TYPES   = ['All Types', 'Multiplex', 'Megaplex', 'Luxury', 'Flagship', 'Iconic'];

const FEATURE_COLORS = {
  'IMAX':         { bg: 'rgba(61,126,255,0.15)',  color: '#5b8def' },
  'Dolby Atmos':  { bg: 'rgba(245,200,66,0.15)',  color: '#f5c842' },
  'Dolby Cinema': { bg: 'rgba(245,200,66,0.15)',  color: '#f5c842' },
  'Dolby':        { bg: 'rgba(245,200,66,0.15)',  color: '#f5c842' },
  '4DX':          { bg: 'rgba(232,93,93,0.15)',   color: '#e85d5d' },
  'ScreenX':      { bg: 'rgba(155,89,232,0.15)',  color: '#9b59e8' },
  'Recliner':     { bg: 'rgba(52,201,122,0.15)',  color: '#34c97a' },
  'VIP':          { bg: 'rgba(52,201,122,0.15)',  color: '#34c97a' },
  'VIP Lounge':   { bg: 'rgba(52,201,122,0.15)',  color: '#34c97a' },
  'Luxe':         { bg: 'rgba(52,201,122,0.15)',  color: '#34c97a' },
  'Laser':        { bg: 'rgba(245,166,35,0.15)',  color: '#f5a623' },
  'Gold Class':   { bg: 'rgba(245,200,66,0.18)',  color: '#f5c842' },
  'Historical':   { bg: 'rgba(155,89,232,0.15)',  color: '#9b59e8' },
};

function FeatureBadge({ label }) {
  const style = FEATURE_COLORS[label] || { bg: 'rgba(139,144,168,0.15)', color: '#8b90a8' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '999px',
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.03em',
      background: style.bg, color: style.color,
      border: `1px solid ${style.color}33`,
    }}>
      {label}
    </span>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'flex', gap: '1px', alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{
          fontSize: '0.7rem',
          color: i < full ? '#f5c842' : (i === full && half ? '#f5c842' : '#2e3245'),
          opacity: i < full ? 1 : (i === full && half ? 0.6 : 0.4),
        }}>★</span>
      ))}
      <span style={{ fontSize: '0.75rem', color: '#f5c842', fontWeight: 700, marginLeft: 4 }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

// ─── Show times per cinema (deterministic mock) ──────────────────────────────
const SHOW_TIMES = ['10:00 AM', '1:00 PM', '4:30 PM', '7:00 PM', '9:45 PM'];

// ─── Movie Selection Modal ────────────────────────────────────────────────────
function MoviePickerModal({ cinema, onClose, onPick }) {
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickedMovie, setPicked] = useState(null);
  const [pickedTime,  setPickedTime]  = useState(SHOW_TIMES[3]);

  useEffect(() => {
    setLoading(true);
    searchMovies('movie 2025')
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = () => {
    if (!pickedMovie) return;
    const show = {
      id: cinema.id * 1000 + SHOW_TIMES.indexOf(pickedTime),
      time: pickedTime,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      theater: { name: cinema.name, screen: `Screen ${(cinema.id % 5) + 1}`, city: cinema.city },
      language: 'English',
    };
    const movie = {
      title:     pickedMovie.Title,
      posterUrl: pickedMovie.Poster !== 'N/A' ? pickedMovie.Poster : null,
      genre:     pickedMovie.Genre || '',
      imdbID:    pickedMovie.imdbID,
      Year:      pickedMovie.Year,
    };
    onPick(show, movie);
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 780,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              🎬 Now Showing at {cinema.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {cinema.city} · {cinema.address}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Show time selector */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 4, alignSelf: 'center' }}>Show time:</span>
          {SHOW_TIMES.map(t => (
            <button
              key={t}
              className={`btn btn-sm ${pickedTime === t ? 'btn-primary' : 'btn-ghost'}`}
              style={{ border: '1px solid var(--border-subtle)' }}
              onClick={() => setPickedTime(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Movie list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading && (
            <div className="state-container" style={{ padding: '40px 0' }}>
              <div className="spinner" />
              <span className="state-subtitle">Fetching movies…</span>
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="state-container" style={{ padding: '40px 0' }}>
              <div className="state-icon">🎭</div>
              <div className="state-title">No movies found</div>
            </div>
          )}

          {!loading && movies.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 14,
            }}>
              {movies.map(m => {
                const selected = pickedMovie?.imdbID === m.imdbID;
                return (
                  <div
                    key={m.imdbID}
                    onClick={() => setPicked(m)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selected ? 'var(--blue-400)' : 'var(--border-subtle)'}`,
                      overflow: 'hidden',
                      background: selected ? 'rgba(61,126,255,0.08)' : 'var(--bg-elevated)',
                      transition: 'all 200ms ease',
                      transform: selected ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: selected ? '0 0 0 3px rgba(61,126,255,0.25)' : 'none',
                    }}
                  >
                    <img
                      src={m.Poster}
                      alt={m.Title}
                      style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '8px 8px 10px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>
                        {m.Title}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.Year}</div>
                      {selected && (
                        <div style={{ marginTop: 4, fontSize: '0.65rem', color: 'var(--blue-400)', fontWeight: 700 }}>
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {pickedMovie
              ? <><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pickedMovie.Title}</span> · {pickedTime}</>
              : 'Select a movie to continue'
            }
          </div>
          <button
            className="btn btn-gold"
            disabled={!pickedMovie}
            onClick={handleConfirm}
          >
            Select Seats →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cinema Card ──────────────────────────────────────────────────────────────
function CinemaCard({ cinema }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handlePick = useCallback((show, movie) => {
    setShowModal(false);
    navigate(`/shows/${show.id}/seats`, { state: { show, movie } });
  }, [navigate]);

  return (
    <>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
        cursor: 'default',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.55)';
          e.currentTarget.style.borderColor = 'var(--border-active)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        {/* Header strip */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))',
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: 100, height: 100,
            background: 'radial-gradient(circle, rgba(61,126,255,0.08), transparent)',
            borderRadius: '50%',
          }} />

          {/* Top row: flag + type badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>{cinema.flag}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999,
              background: 'rgba(61,126,255,0.12)', color: 'var(--blue-400)',
              border: '1px solid rgba(61,126,255,0.20)',
            }}>
              {cinema.type}
            </span>
          </div>

          {/* Cinema name */}
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {cinema.emoji} {cinema.name}
          </div>

          {/* Location */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
            <span>📍</span>
            <span>{cinema.address}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px' }}>
          {/* Rating + Screens row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <StarRating rating={cinema.rating} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              🎞️ <strong style={{ color: 'var(--text-primary)' }}>{cinema.screens}</strong> screens
            </span>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
            {cinema.features.map(f => <FeatureBadge key={f} label={f} />)}
          </div>

          {/* Price + Book button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 1 }}>Ticket Price</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-400)' }}>{cinema.price}</div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Movie Picker Modal */}
      {showModal && (
        <MoviePickerModal
          cinema={cinema}
          onClose={() => setShowModal(false)}
          onPick={handlePick}
        />
      )}
    </>
  );
}

export default function CinemasPage() {
  const [search, setSearch]         = useState('');
  const [activeRegion, setRegion]   = useState('All');
  const [activeType, setType]       = useState('All Types');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CINEMAS.filter(c => {
      const matchSearch  = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
      const matchRegion  = activeRegion === 'All' || c.region === activeRegion;
      const matchType    = activeType === 'All Types' || c.type === activeType;
      return matchSearch && matchRegion && matchType;
    });
  }, [search, activeRegion, activeType]);

  // Group by region for display
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(c => {
      if (!map[c.region]) map[c.region] = [];
      map[c.region].push(c);
    });
    return map;
  }, [filtered]);

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ─── Hero Banner ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #12141e 0%, #1a1c2e 50%, #0e0f14 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px',
          marginBottom: 48,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(61,126,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(245,200,66,0.05) 0%, transparent 50%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 14,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-400)', display: 'inline-block' }} />
              {CINEMAS.length} Cinemas Worldwide
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 10 }}>
              Find <span style={{ color: 'var(--gold-400)' }}>your cinema</span>,<br />anywhere on Earth
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, marginBottom: 28 }}>
              Explore premium cinemas across India and worldwide — from IMAX megaplexes to iconic historic theatres.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { value: '24+', label: 'Cinemas' },
                { value: '7', label: 'Regions' },
                { value: '15+', label: 'Countries' },
                { value: 'IMAX', label: '& 4DX Ready' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(20,22,29,0.70)', backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  padding: '12px 20px', minWidth: 110,
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-400)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Filters ─── */}
        <div style={{ marginBottom: 32 }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by cinema name, city or country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search
              ? <button className="search-clear" onClick={() => setSearch('')} title="Clear">✕</button>
              : <span className="search-icon">🔍</span>
            }
          </div>

          {/* Region tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {REGIONS.map(r => (
              <button
                key={r}
                className={`btn btn-sm ${activeRegion === r ? 'btn-gold' : 'btn-ghost'}`}
                style={{ border: '1px solid var(--border-subtle)' }}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Type tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button
                key={t}
                className={`btn btn-sm ${activeType === t ? 'btn-primary' : 'btn-ghost'}`}
                style={{ border: '1px solid var(--border-subtle)' }}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Results count ─── */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> cinemas
            {activeRegion !== 'All' && ` in ${activeRegion}`}
          </span>
        </div>

        {/* ─── Empty state ─── */}
        {filtered.length === 0 && (
          <div className="state-container">
            <div className="state-icon">🎭</div>
            <div className="state-title">No cinemas found</div>
            <p className="state-subtitle">Try a different search or filter.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setRegion('All'); setType('All Types'); }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* ─── Grouped Cinema Grid ─── */}
        {Object.entries(grouped).map(([region, cinemas]) => (
          <section key={region} style={{ marginBottom: 48 }}>
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-title-accent" />
                {region}
              </h2>
              <span className="badge badge-muted">{cinemas.length} cinemas</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}>
              {cinemas.map(cinema => (
                <CinemaCard key={cinema.id} cinema={cinema} />
              ))}
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}
