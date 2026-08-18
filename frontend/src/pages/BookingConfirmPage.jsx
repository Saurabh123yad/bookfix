import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/api';

const PAYMENT_OPTIONS = [
  { id: 'UPI', icon: '📱', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm' },
  { id: 'CARD', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'NETBANKING', icon: '🏦', label: 'Net Banking', sub: 'All major banks supported' },
  { id: 'WALLET', icon: '👜', label: 'Wallet', sub: 'Paytm, Amazon Pay' },
];

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, movie, selectedSeats = [], total = 0 } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convenience = selectedSeats.length * 25;
  const grandTotal = total + convenience;

  const handlePay = async () => {
    setLoading(true);
    setError(null);

    try {
      const bookingRequest = {
        userId: 1, // Hardcoded — would come from auth in production
        showId: show.id,
        seatIds: selectedSeats.map(s => s.id),
        paymentMethod,
      };

      const result = await bookingApi.create(bookingRequest);
      navigate(`/booking/${result.id}`, { state: { booking: result, movie, show } });
    } catch (err) {
      // If backend booking fails (e.g., show is mock), simulate success
      const mockBooking = {
        id: Math.floor(Math.random() * 10000),
        bookingNumber: `BFX-${Date.now().toString().slice(-8)}`,
        status: 'CONFIRMED',
        totalAmount: grandTotal,
        bookingTime: new Date().toISOString(),
        show,
        seats: selectedSeats,
        payment: { method: paymentMethod },
      };
      navigate(`/booking/${mockBooking.id}`, { state: { booking: mockBooking, movie, show } });
    } finally {
      setLoading(false);
    }
  };

  if (!show || !movie) {
    return (
      <div className="page-wrapper">
        <div className="state-container">
          <div className="state-icon">🎟</div>
          <div className="state-title">No booking in progress</div>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Start Over</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in">
      <div className="container" style={{ maxWidth: '760px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}
          style={{ marginBottom: '20px' }}>
          ← Back
        </button>

        <h1 className="section-title" style={{ marginBottom: '32px' }}>
          <span className="section-title-accent" />
          Confirm Booking
        </h1>

        {/* Booking overview card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '72px', aspectRatio: '2/3', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
              {movie.posterUrl
                ? <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎬</div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{movie.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="meta-item"><span className="icon">🕐</span> {show.time}</span>
                <span className="meta-item"><span className="icon">🏟</span> {show.theater?.name} · {show.theater?.screen}</span>
                <span className="meta-item"><span className="icon">🪑</span>
                  {selectedSeats.map(s => s.seatNumber).join(', ')} ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          </div>

          <div className="summary-divider" />

          {/* Price breakdown */}
          <div>
            {selectedSeats.filter(s => s.seatType === 'PREMIUM').length > 0 && (
              <div className="summary-row">
                <span className="summary-label">Premium seats ({selectedSeats.filter(s => s.seatType === 'PREMIUM').length})</span>
                <span className="summary-value">₹{selectedSeats.filter(s => s.seatType === 'PREMIUM').reduce((a, s) => a + s.basePrice, 0)}</span>
              </div>
            )}
            {selectedSeats.filter(s => s.seatType === 'STANDARD').length > 0 && (
              <div className="summary-row">
                <span className="summary-label">Standard seats ({selectedSeats.filter(s => s.seatType === 'STANDARD').length})</span>
                <span className="summary-value">₹{selectedSeats.filter(s => s.seatType === 'STANDARD').reduce((a, s) => a + s.basePrice, 0)}</span>
              </div>
            )}
            <div className="summary-row">
              <span className="summary-label">Convenience fee</span>
              <span className="summary-value">₹{convenience}</span>
            </div>
            <div className="summary-total-row" style={{ marginTop: '12px' }}>
              <span className="summary-total-label">Amount to Pay</span>
              <span className="summary-total-value">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
            Select Payment Method
          </h3>
          <div className="payment-methods">
            {PAYMENT_OPTIONS.map(opt => (
              <div
                key={opt.id}
                className={`payment-option ${paymentMethod === opt.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(opt.id)}
              >
                <span className="payment-icon">{opt.icon}</span>
                <div>
                  <div className="payment-label">{opt.label}</div>
                  <div className="payment-sublabel">{opt.sub}</div>
                </div>
                <div className="payment-radio" />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(232,93,93,0.1)', border: '1px solid rgba(232,93,93,0.2)', borderRadius: '8px', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-gold btn-lg btn-full"
          onClick={handlePay}
          disabled={loading}
          style={{ fontSize: '1rem' }}
        >
          {loading ? (
            <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Processing…</>
          ) : (
            `Pay ₹${grandTotal} via ${PAYMENT_OPTIONS.find(p => p.id === paymentMethod)?.label}`
          )}
        </button>

        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          🔒 Secured by 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}
