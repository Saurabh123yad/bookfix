import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import CinemasPage from './pages/CinemasPage';
import EventsPage from './pages/EventsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/shows/:showId/seats" element={<SeatSelectionPage />} />
        <Route path="/booking/confirm" element={<BookingConfirmPage />} />
        <Route path="/booking/:id" element={<BookingSuccessPage />} />
        <Route path="/cinemas" element={<CinemasPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="*" element={
          <div className="page-wrapper">
            <div className="state-container">
              <div className="state-icon">🔍</div>
              <div className="state-title">Page not found</div>
              <a href="/" className="btn btn-outline">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
