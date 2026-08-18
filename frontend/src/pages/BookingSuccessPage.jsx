import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return dateStr; }
}

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, movie, show } = location.state || {};

  if (!booking) {
    return (
      <div className="page-wrapper">
        <div className="state-container">
          <div className="state-icon">🎫</div>
          <div className="state-title">No booking found</div>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const displaySeats = booking.seats || booking.showSeats || [];
  const seatNumbers = displaySeats.map(s => s.seatNumber || s.seat?.seatNumber || s.id).join(', ');

  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <div className="ticket-wrapper">

          {/* Success Icon */}
          <div className="ticket-success-icon">✓</div>
          <h1 className="ticket-success-title">Booking Confirmed!</h1>
          <p className="ticket-success-sub">
            Your tickets have been booked. Enjoy the show! 🎉
          </p>

          {/* Ticket Card */}
          <div className="ticket-card">

            {/* Header */}
            <div className="ticket-header">
              <div className="ticket-poster">
                {movie?.posterUrl
                  ? <img src={movie.posterUrl} alt={movie.title} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--bg-elevated)' }}>🎬</div>
                }
              </div>
              <div>
                <div className="ticket-movie-name">{movie?.title || 'Movie'}</div>
                <div className="ticket-meta">
                  {movie?.genre && `${movie.genre} · `}
                  {movie?.language || ''}<br />
                  {movie?.durationMins && `${Math.floor(movie.durationMins / 60)}h ${movie.durationMins % 60}m`}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <span className={`badge ${booking.status === 'CONFIRMED' ? 'badge-success' : 'badge-gold'}`}>
                    {booking.status || 'CONFIRMED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Perforated divider */}
            <div style={{ position: 'relative', padding: '0 16px' }}>
              <hr className="ticket-dashed-line" />
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--bg-base)', border: '1px solid var(--border-subtle)'
              }} />
              <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translate(50%, -50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--bg-base)', border: '1px solid var(--border-subtle)'
              }} />
            </div>

            {/* Body */}
            <div className="ticket-body">
              <div className="ticket-row">
                <div>
                  <div className="ticket-field-label">Date & Time</div>
                  <div className="ticket-field-value">{show?.time || formatDateTime(booking.bookingTime)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="ticket-field-label">Venue</div>
                  <div className="ticket-field-value">{show?.theater?.name || 'Cinema'}</div>
                </div>
              </div>

              <div className="ticket-row">
                <div>
                  <div className="ticket-field-label">Screen</div>
                  <div className="ticket-field-value">{show?.theater?.screen || booking.show?.screen?.name || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="ticket-field-label">Seats</div>
                  <div className="ticket-field-value">{seatNumbers || `${displaySeats.length} seats`}</div>
                </div>
              </div>

              <div className="ticket-row">
                <div>
                  <div className="ticket-field-label">Amount Paid</div>
                  <div className="ticket-field-value highlight">₹{booking.totalAmount}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="ticket-field-label">Payment</div>
                  <div className="ticket-field-value">{booking.payment?.method || 'UPI'}</div>
                </div>
              </div>
            </div>

            {/* Booking Number */}
            <div className="ticket-booking-id">
              <div className="ticket-field-label" style={{ marginBottom: '4px' }}>BOOKING ID</div>
              <div className="ticket-booking-number">{booking.bookingNumber}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button className="btn btn-outline btn-full" onClick={() => window.print()}>
              🖨 Print Ticket
            </button>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/')}>
              Browse More Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
