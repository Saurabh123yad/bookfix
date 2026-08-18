import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Generate a deterministic seat layout for a show
function generateSeats(showId) {
  const seed = showId || 1;
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  const seats = [];
  let id = (seed * 1000);

  rows.forEach((row, rowIndex) => {
    for (let col = 1; col <= seatsPerRow; col++) {
      id++;
      const isPremium = rowIndex < 2;
      const isBooked = (id % 7 === 0) || (id % 13 === 0);
      seats.push({
        id,
        seatNumber: `${row}${col}`,
        row,
        col,
        seatType: isPremium ? 'PREMIUM' : 'STANDARD',
        basePrice: isPremium ? 350 : 200,
        status: isBooked ? 'BOOKED' : 'AVAILABLE',
      });
    }
  });
  return seats;
}

function groupByRow(seats) {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});
}

export default function SeatSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, movie } = location.state || {};

  const [selectedIds, setSelectedIds] = useState([]);

  const seats = useMemo(() => generateSeats(show?.id), [show?.id]);
  const byRow = useMemo(() => groupByRow(seats), [seats]);

  const selectedSeats = seats.filter(s => selectedIds.includes(s.id));
  const total = selectedSeats.reduce((sum, s) => sum + s.basePrice, 0);

  const toggleSeat = (seat) => {
    if (seat.status === 'BOOKED') return;
    setSelectedIds(prev =>
      prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id]
    );
  };

  const getSeatClass = (seat) => {
    if (seat.status === 'BOOKED') return 'seat seat-booked';
    if (selectedIds.includes(seat.id))
      return seat.seatType === 'PREMIUM' ? 'seat seat-premium-selected' : 'seat seat-selected';
    return seat.seatType === 'PREMIUM' ? 'seat seat-premium-available' : 'seat seat-available';
  };

  const handleProceed = () => {
    if (selectedIds.length === 0) return;
    navigate('/booking/confirm', { state: { show, movie, selectedSeats, total } });
  };

  if (!show || !movie) {
    return (
      <div className="page-wrapper">
        <div className="state-container">
          <div className="state-icon">🎟</div>
          <div className="state-title">No show selected</div>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Go to Movies</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in">
      <div className="container">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}
          style={{ marginBottom: '20px' }}>
          ← Back
        </button>

        <div className="section-header" style={{ marginBottom: '32px' }}>
          <div>
            <h1 className="section-title">
              <span className="section-title-accent" />
              Select Seats
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              {movie.title} · {show.time} · {show.theater?.name}
            </p>
          </div>
          <span className="badge badge-muted">{show.theater?.screen}</span>
        </div>

        <div className="seat-page-layout">
          {/* ── Seat Map ── */}
          <div>
            {/* Screen indicator */}
            <div className="screen-label">
              <div className="screen-bar" />
              <div className="screen-text">All eyes this way please!</div>
            </div>

            <div className="seat-map">
              {/* Premium label */}
              <div style={{ alignSelf: 'flex-start', marginBottom: '4px' }}>
                <span className="badge" style={{ background: 'rgba(155,89,232,0.10)', color: '#9b59e8', border: '1px solid rgba(155,89,232,0.20)', fontSize: '0.68rem' }}>
                  PREMIUM — ₹350
                </span>
              </div>

              {Object.entries(byRow).map(([row, rowSeats]) => (
                <div className="seat-row" key={row}>
                  <span className="seat-row-label">{row}</span>
                  {rowSeats.slice(0, 5).map(seat => (
                    <button
                      key={seat.id}
                      className={getSeatClass(seat)}
                      onClick={() => toggleSeat(seat)}
                      title={`${seat.seatNumber} · ${seat.seatType} · ₹${seat.basePrice}`}
                      disabled={seat.status === 'BOOKED'}
                    />
                  ))}
                  <div className="seat-gap" />
                  {rowSeats.slice(5).map(seat => (
                    <button
                      key={seat.id}
                      className={getSeatClass(seat)}
                      onClick={() => toggleSeat(seat)}
                      title={`${seat.seatNumber} · ${seat.seatType} · ₹${seat.basePrice}`}
                      disabled={seat.status === 'BOOKED'}
                    />
                  ))}
                  <span className="seat-row-label">{row}</span>
                </div>
              ))}

              {/* Standard label */}
              <div style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                  STANDARD — ₹200
                </span>
              </div>

              {/* Legend */}
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-available)' }} />
                  Available
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-selected)' }} />
                  Selected
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-booked)', opacity: 0.4 }} />
                  Booked
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--seat-premium)' }} />
                  Premium
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary Panel ── */}
          <div className="booking-summary">
            <div className="booking-summary-title">Booking Summary</div>

            <div className="summary-movie-row">
              <div className="summary-poster">
                {movie.posterUrl
                  ? <img src={movie.posterUrl} alt={movie.title} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎬</div>
                }
              </div>
              <div>
                <div className="summary-movie-name">{movie.title}</div>
                <div className="summary-movie-meta">
                  {show.time}<br />
                  {show.theater?.name}<br />
                  {show.theater?.screen}
                </div>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="summary-label">Seats Selected</span>
              <span className="summary-value">{selectedSeats.length}</span>
            </div>

            {selectedSeats.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div className="summary-label" style={{ marginBottom: '6px' }}>Seat Numbers</div>
                <div className="selected-seats-chips">
                  {selectedSeats.map(s => (
                    <span key={s.id} className="seat-chip">{s.seatNumber}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="summary-divider" />

            {selectedSeats.some(s => s.seatType === 'PREMIUM') && (
              <div className="summary-row">
                <span className="summary-label">Premium ({selectedSeats.filter(s => s.seatType === 'PREMIUM').length}×)</span>
                <span className="summary-value">₹{selectedSeats.filter(s => s.seatType === 'PREMIUM').reduce((a, s) => a + s.basePrice, 0)}</span>
              </div>
            )}
            {selectedSeats.some(s => s.seatType === 'STANDARD') && (
              <div className="summary-row">
                <span className="summary-label">Standard ({selectedSeats.filter(s => s.seatType === 'STANDARD').length}×)</span>
                <span className="summary-value">₹{selectedSeats.filter(s => s.seatType === 'STANDARD').reduce((a, s) => a + s.basePrice, 0)}</span>
              </div>
            )}
            <div className="summary-row">
              <span className="summary-label">Convenience fee</span>
              <span className="summary-value">₹{selectedSeats.length > 0 ? selectedSeats.length * 25 : 0}</span>
            </div>

            <div className="summary-total-row">
              <span className="summary-total-label">Total Payable</span>
              <span className="summary-total-value">₹{total + selectedSeats.length * 25}</span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Pay →
            </button>

            {selectedSeats.length === 0 && (
              <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Select at least 1 seat to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
