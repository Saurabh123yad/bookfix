import React, { useState, useMemo } from 'react';

const EVENTS = [
  // ─── UTTAR PRADESH ───────────────────────────────────────
  {
    id: 1, name: 'Arijit Singh Live Concert',
    category: 'Music', city: 'Lucknow', state: 'UP',
    venue: 'Ekana Cricket Stadium, Lucknow',
    date: '2026-09-14', time: '7:00 PM',
    price: '₹999–₹4,999', seats: 12000, seatsLeft: 3200,
    rating: 4.9, flag: '🇮🇳', emoji: '🎤',
    tags: ['Bollywood', 'Live', 'Concert'],
    description: 'The soulful voice of Arijit Singh comes alive in Lucknow. An unforgettable evening of music.',
  },
  {
    id: 2, name: 'Stand-Up Night: Kapil Sharma',
    category: 'Comedy', city: 'Kanpur', state: 'UP',
    venue: 'Green Park Stadium, Kanpur',
    date: '2026-09-20', time: '8:00 PM',
    price: '₹499–₹1,999', seats: 5000, seatsLeft: 1100,
    rating: 4.7, flag: '🇮🇳', emoji: '😂',
    tags: ['Comedy', 'Stand-Up', 'Live'],
    description: 'Kapil Sharma brings his legendary comedy show to Kanpur — laugh till it hurts!',
  },
  {
    id: 3, name: 'IPL Screening Night — RCB vs MI',
    category: 'Sports', city: 'Agra', state: 'UP',
    venue: 'Taj Mahotsav Ground, Agra',
    date: '2026-10-02', time: '7:30 PM',
    price: '₹199–₹599', seats: 3000, seatsLeft: 800,
    rating: 4.5, flag: '🇮🇳', emoji: '🏏',
    tags: ['Cricket', 'IPL', 'Sports'],
    description: 'Watch the biggest IPL clash on a giant LED screen with fellow fans in Agra.',
  },
  {
    id: 4, name: 'Kashi Mahotsav — Classical Music Festival',
    category: 'Theatre', city: 'Varanasi', state: 'UP',
    venue: 'Dashashwamedh Ghat, Varanasi',
    date: '2026-10-10', time: '6:00 PM',
    price: '₹250–₹1,200', seats: 2000, seatsLeft: 650,
    rating: 4.8, flag: '🇮🇳', emoji: '🪔',
    tags: ['Classical', 'Cultural', 'Festival'],
    description: 'A grand celebration of Indian classical music and dance at the sacred ghats of Varanasi.',
  },
  {
    id: 5, name: 'Prayagraj Sangeet Sandhya',
    category: 'Music', city: 'Prayagraj', state: 'UP',
    venue: 'Alfred Park, Prayagraj',
    date: '2026-10-18', time: '5:30 PM',
    price: '₹300–₹1,500', seats: 4000, seatsLeft: 1200,
    rating: 4.6, flag: '🇮🇳', emoji: '🎶',
    tags: ['Classical', 'Semi-Classical', 'Live'],
    description: 'An evening of devotional and semi-classical music at the heart of Prayagraj.',
  },
  {
    id: 6, name: 'WWE Live: Road to WrestleMania',
    category: 'Sports', city: 'Noida', state: 'UP',
    venue: 'DLF Mall of India Arena, Noida',
    date: '2026-11-05', time: '7:00 PM',
    price: '₹799–₹3,999', seats: 8000, seatsLeft: 2200,
    rating: 4.7, flag: '🇮🇳', emoji: '💪',
    tags: ['WWE', 'Wrestling', 'Sports'],
    description: 'WWE superstars come to Noida for a night of thrilling action. Don\'t miss this!',
  },
  {
    id: 7, name: 'Neha Kakkar Music Night',
    category: 'Music', city: 'Ghaziabad', state: 'UP',
    venue: 'Pacific Mall Grounds, Ghaziabad',
    date: '2026-11-12', time: '7:30 PM',
    price: '₹699–₹2,999', seats: 6000, seatsLeft: 1800,
    rating: 4.6, flag: '🇮🇳', emoji: '🎵',
    tags: ['Bollywood', 'Pop', 'Concert'],
    description: 'Neha Kakkar brings her energy-packed live show to Ghaziabad — get ready to dance!',
  },
  {
    id: 8, name: 'Comedy Factory — Open Mic Night',
    category: 'Comedy', city: 'Meerut', state: 'UP',
    venue: 'Shatabdi Nagar Club, Meerut',
    date: '2026-11-20', time: '8:00 PM',
    price: '₹299–₹799', seats: 500, seatsLeft: 120,
    rating: 4.3, flag: '🇮🇳', emoji: '🎭',
    tags: ['Comedy', 'Open Mic', 'Local'],
    description: 'The funniest local and national comedians gather for an epic open mic night in Meerut.',
  },

  // ─── OTHER INDIA ─────────────────────────────────────────
  {
    id: 9, name: 'Coldplay India Tour — Mumbai',
    category: 'Music', city: 'Mumbai', state: 'Maharashtra',
    venue: 'DY Patil Stadium, Mumbai',
    date: '2026-09-28', time: '7:00 PM',
    price: '₹1,500–₹12,000', seats: 55000, seatsLeft: 4500,
    rating: 5.0, flag: '🇮🇳', emoji: '🌈',
    tags: ['International', 'Rock', 'Pop'],
    description: 'Coldplay\'s Music of the Spheres World Tour returns to Mumbai — the most anticipated concert of the year.',
  },
  {
    id: 10, name: 'IPL 2026 Final — Live Screening',
    category: 'Sports', city: 'Delhi', state: 'Delhi',
    venue: 'Jawaharlal Nehru Stadium, Delhi',
    date: '2026-10-25', time: '7:30 PM',
    price: '₹399–₹999', seats: 10000, seatsLeft: 3000,
    rating: 4.8, flag: '🇮🇳', emoji: '🏆',
    tags: ['Cricket', 'IPL', 'Final'],
    description: 'Watch the IPL 2026 Grand Final live on the big screen with thousands of fans.',
  },
  {
    id: 11, name: 'Filmfare Awards Night',
    category: 'Award Night', city: 'Mumbai', state: 'Maharashtra',
    venue: 'MMRDA Grounds, BKC, Mumbai',
    date: '2026-12-05', time: '6:30 PM',
    price: '₹2,000–₹25,000', seats: 15000, seatsLeft: 2000,
    rating: 4.9, flag: '🇮🇳', emoji: '🏅',
    tags: ['Awards', 'Bollywood', 'Glamour'],
    description: 'The most glamorous night in Bollywood — live on stage with your favourite stars.',
  },
  {
    id: 12, name: 'Sunburn Music Festival — Goa',
    category: 'Music', city: 'Goa', state: 'Goa',
    venue: 'Vagator Beach, Goa',
    date: '2026-12-26', time: '4:00 PM',
    price: '₹1,800–₹8,000', seats: 30000, seatsLeft: 9000,
    rating: 4.8, flag: '🇮🇳', emoji: '🏖️',
    tags: ['EDM', 'Festival', 'DJ'],
    description: 'Asia\'s biggest music festival returns to the beaches of Goa. 3 days, 100+ artists.',
  },

  // ─── INTERNATIONAL ───────────────────────────────────────
  {
    id: 13, name: 'Taylor Swift: Eras Tour',
    category: 'Music', city: 'London', state: 'UK',
    venue: 'Wembley Stadium, London',
    date: '2026-08-22', time: '7:00 PM',
    price: '£80–£350', seats: 90000, seatsLeft: 500,
    rating: 5.0, flag: '🇬🇧', emoji: '🌟',
    tags: ['Pop', 'International', 'Mega Concert'],
    description: 'The record-breaking Eras Tour continues at Wembley Stadium — history in the making.',
  },
  {
    id: 14, name: 'FIFA World Cup Qualifier — India vs Qatar',
    category: 'Sports', city: 'Dubai', state: 'UAE',
    venue: 'Al Maktoum Stadium, Dubai',
    date: '2026-10-08', time: '9:00 PM',
    price: 'AED 50–300', seats: 35000, seatsLeft: 7000,
    rating: 4.7, flag: '🇦🇪', emoji: '⚽',
    tags: ['Football', 'FIFA', 'Sports'],
    description: 'India faces Qatar in a crucial World Cup qualifier — experience the passion live in Dubai.',
  },
  {
    id: 15, name: 'Oscar Screening Party — NYC',
    category: 'Award Night', city: 'New York', state: 'USA',
    venue: 'AMC Empire 25, Times Square',
    date: '2027-03-05', time: '7:00 PM',
    price: '$25–$75', seats: 3000, seatsLeft: 800,
    rating: 4.6, flag: '🇺🇸', emoji: '🏆',
    tags: ['Awards', 'Hollywood', 'Cinema'],
    description: 'Watch the 99th Academy Awards live on the big screen at Times Square.',
  },
  {
    id: 16, name: 'Anime Japan Expo 2026',
    category: 'Premieres', city: 'Tokyo', state: 'Japan',
    venue: 'Tokyo Big Sight, Odaiba, Tokyo',
    date: '2026-09-06', time: '10:00 AM',
    price: '¥2,500–¥8,000', seats: 50000, seatsLeft: 15000,
    rating: 4.8, flag: '🇯🇵', emoji: '🎌',
    tags: ['Anime', 'Gaming', 'Pop Culture'],
    description: 'The world\'s largest anime convention — meet your favourite creators and voice actors.',
  },
];

const CATEGORIES = ['All', 'Music', 'Comedy', 'Sports', 'Theatre', 'Award Night', 'Premieres'];
const UP_CITIES   = ['All Cities', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Noida', 'Ghaziabad', 'Meerut'];

const CAT_COLORS = {
  'Music':      { bg: 'rgba(61,126,255,0.15)',  color: '#5b8def',  icon: '🎵' },
  'Comedy':     { bg: 'rgba(245,200,66,0.15)',  color: '#f5c842',  icon: '😂' },
  'Sports':     { bg: 'rgba(52,201,122,0.15)',  color: '#34c97a',  icon: '🏆' },
  'Theatre':    { bg: 'rgba(155,89,232,0.15)',  color: '#9b59e8',  icon: '🎭' },
  'Award Night':{ bg: 'rgba(245,166,35,0.15)',  color: '#f5a623',  icon: '🏅' },
  'Premieres':  { bg: 'rgba(232,93,93,0.15)',   color: '#e85d5d',  icon: '🎬' },
};

function SeatsBar({ total, left }) {
  const pct = Math.round((left / total) * 100);
  const color = pct > 50 ? '#34c97a' : pct > 20 ? '#f5a623' : '#e85d5d';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 4, color: 'var(--text-muted)' }}>
        <span>Seats left</span>
        <span style={{ color }}>{left.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const [booked, setBooked] = useState(false);
  const cat = CAT_COLORS[event.category] || CAT_COLORS['Music'];
  const dateObj = new Date(event.date);
  const day   = dateObj.toLocaleDateString('en-IN', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('en-IN', { month: 'short' });
  const year  = dateObj.getFullYear();

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
      display: 'flex', flexDirection: 'column',
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
      {/* Top accent strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />

      {/* Header */}
      <div style={{ padding: '20px 20px 14px', background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          {/* Date box */}
          <div style={{
            background: cat.bg, border: `1px solid ${cat.color}33`,
            borderRadius: 'var(--radius-md)', padding: '8px 14px', textAlign: 'center', minWidth: 60,
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cat.color, lineHeight: 1 }}>{day}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: cat.color, letterSpacing: '0.05em' }}>{month} {year}</div>
          </div>

          {/* Category badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
            background: cat.bg, color: cat.color, border: `1px solid ${cat.color}33`,
          }}>
            {cat.icon} {event.category}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
          {event.emoji} {event.name}
        </div>

        {/* Venue */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
          <span>📍</span>
          <span>{event.venue}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Description */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {event.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {event.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px',
              borderRadius: 999, background: 'var(--bg-elevated)',
              color: 'var(--text-muted)', border: '1px solid var(--border-subtle)',
            }}>#{t}</span>
          ))}
        </div>

        {/* Seats bar */}
        <SeatsBar total={event.seats} left={event.seatsLeft} />

        {/* Footer: Time + Price + Book */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>⏰ {event.time}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-400)' }}>{event.price}</div>
          </div>
          <button
            className="btn btn-sm"
            style={booked
              ? { background: 'var(--success)', color: '#fff' }
              : { background: cat.color, color: '#fff', boxShadow: `0 4px 14px ${cat.color}44` }
            }
            onClick={() => setBooked(b => !b)}
          >
            {booked ? '✓ Booked!' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [search, setSearch]       = useState('');
  const [activeCategory, setCat]  = useState('All');
  const [activeCity, setCity]     = useState('All Cities');
  const [showUPOnly, setUPOnly]   = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return EVENTS.filter(e => {
      const matchSearch   = !q || e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
      const matchCategory = activeCategory === 'All' || e.category === activeCategory;
      const matchCity     = activeCity === 'All Cities' || e.city === activeCity;
      const matchUP       = !showUPOnly || e.state === 'UP';
      return matchSearch && matchCategory && matchCity && matchUP;
    });
  }, [search, activeCategory, activeCity, showUPOnly]);

  const upCount = EVENTS.filter(e => e.state === 'UP').length;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ─── Hero ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #12141e 0%, #1e1228 50%, #0e0f14 100%)',
          borderRadius: 'var(--radius-xl)', padding: '48px',
          marginBottom: 48, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 80% 30%, rgba(155,89,232,0.10) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(245,200,66,0.06) 0%, transparent 50%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#9b59e8',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9b59e8', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              {EVENTS.length} Events Happening Now
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 10 }}>
              Live events <span style={{ color: 'var(--gold-400)' }}>near you</span>,<br />and worldwide
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, marginBottom: 28 }}>
              Concerts, comedy nights, sports, award shows — book your seat for the most exciting events across India and the world.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { value: `${EVENTS.length}+`, label: 'Events' },
                { value: `${upCount}`, label: 'UP Events' },
                { value: '6', label: 'Categories' },
                { value: '12+', label: 'Cities' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(20,22,29,0.70)', backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  padding: '12px 20px',
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
              placeholder="Search events, venues, cities…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search
              ? <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              : <span className="search-icon">🔍</span>
            }
          </div>

          {/* UP-only toggle */}
          <div style={{ marginBottom: 14 }}>
            <button
              className={`btn btn-sm ${showUPOnly ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => { setUPOnly(u => !u); setCity('All Cities'); }}
              style={{ gap: 6 }}
            >
              🇮🇳 {showUPOnly ? '✓ Showing UP Events Only' : 'Show UP Events Only'}
            </button>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${activeCategory === c ? 'btn-primary' : 'btn-ghost'}`}
                style={{ border: '1px solid var(--border-subtle)' }}
                onClick={() => setCat(c)}
              >
                {CAT_COLORS[c]?.icon} {c}
              </button>
            ))}
          </div>

          {/* UP Cities filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: 4 }}>UP Cities:</span>
            {UP_CITIES.map(city => (
              <button
                key={city}
                className={`btn btn-sm ${activeCity === city ? 'btn-gold' : 'btn-ghost'}`}
                style={{ border: '1px solid var(--border-subtle)' }}
                onClick={() => { setCity(city); if (city !== 'All Cities') setUPOnly(true); else setUPOnly(false); }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Results count ─── */}
        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> events
            {showUPOnly && ' in Uttar Pradesh'}
          </span>
        </div>

        {/* ─── Empty state ─── */}
        {filtered.length === 0 && (
          <div className="state-container">
            <div className="state-icon">🎭</div>
            <div className="state-title">No events found</div>
            <p className="state-subtitle">Try a different search or category.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setCat('All'); setCity('All Cities'); setUPOnly(false); }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* ─── Events Grid ─── */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22, marginBottom: 60,
          }}>
            {filtered.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
