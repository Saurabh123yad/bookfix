/**
 * =========================================================
 * BMS (BookMyShow) Modern Cinema Frontend Logic
 * Connects with Spring Boot Backend (http://localhost:8080)
 * =========================================================
 */

// Determine API Base URL (works seamlessly when hosted on Spring Boot port 8080 or standalone)
const API_BASE = window.location.origin.includes(':8080')
  ? window.location.origin
  : 'http://localhost:8080';

// Pre-configured High Quality Movie Presets for Quick Testing & Seeding
const MOVIE_PRESETS = {
  inception: {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: "Sci-Fi",
    language: "English",
    durationMins: 148,
    releaseDate: "2010-07-16",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop"
  },
  interstellar: {
    title: "Interstellar",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers.",
    genre: "Sci-Fi",
    language: "English",
    durationMins: 169,
    releaseDate: "2014-11-07",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop"
  },
  darkknight: {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: "Action",
    language: "English",
    durationMins: 152,
    releaseDate: "2008-07-18",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop"
  },
  avengers: {
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    genre: "Action",
    language: "English",
    durationMins: 181,
    releaseDate: "2019-04-26",
    posterUrl: "https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=600&auto=format&fit=crop"
  },
  dune2: {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genre: "Sci-Fi",
    language: "English",
    durationMins: 166,
    releaseDate: "2024-03-01",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop"
  },
  pushpa2: {
    title: "Pushpa 2: The Rule",
    description: "Pushpa Raj continues to consolidate his sandalwood smuggling empire against ruthless adversaries and the relentless SP Bhanwar Singh Shekhawat.",
    genre: "Action",
    language: "Telugu",
    durationMins: 195,
    releaseDate: "2024-12-05",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop"
  }
};

// Application State
const state = {
  movies: [],
  selectedMovie: null,
  selectedShowtime: "10:30 AM",
  selectedScreen: "Screen 1 (IMAX 4K)",
  selectedSeats: new Map(), // seatId -> { id, label, price, tier }
  activeGenre: "ALL",
  activeLanguage: "ALL",
  searchQuery: "",
  recentBookings: JSON.parse(localStorage.getItem('bms_recent_bookings') || '[]'),
  backendConnected: false
};

// Pricing Configuration
const SEAT_PRICING = {
  'A': { tier: 'VIP Recliner', price: 450, isVip: true, count: 10 },
  'B': { tier: 'Prime', price: 250, isVip: false, count: 12 },
  'C': { tier: 'Prime', price: 250, isVip: false, count: 12 },
  'D': { tier: 'Prime', price: 250, isVip: false, count: 12 },
  'E': { tier: 'Classic', price: 150, isVip: false, count: 12 },
  'F': { tier: 'Classic', price: 150, isVip: false, count: 12 }
};

// Seed Booked Seats to make the UI look realistic and live
const DEFAULT_OCCUPIED_SEATS = ['A3', 'A4', 'B7', 'B8', 'C5', 'C6', 'D10', 'E4'];

/* =========================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initDOMListeners();
  generateSeatMatrix();
  checkBackendHealth();
  fetchMovies();
});

function initDOMListeners() {
  // Brand logo click
  document.getElementById('brandLogoBtn').addEventListener('click', (e) => {
    e.preventDefault();
    resetFilters();
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderMoviesGrid();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderMoviesGrid();
  });

  // Genre filter chips
  document.getElementById('genreChips').addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
      document.querySelectorAll('#genreChips .chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      state.activeGenre = e.target.getAttribute('data-genre');
      renderMoviesGrid();
    }
  });

  // Language dropdown filter
  document.getElementById('languageSelect').addEventListener('change', (e) => {
    state.activeLanguage = e.target.value;
    renderMoviesGrid();
  });

  // Reload / Refresh button
  document.getElementById('refreshMoviesBtn').addEventListener('click', () => {
    showToast('Refreshing movies from server...', 'info');
    fetchMovies();
  });

  // Seed Data button in empty state
  document.getElementById('seedDataBtn').addEventListener('click', seedSampleMovies);

  // Reset Filters button in empty state
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

  // Hero section buttons
  document.getElementById('heroBookBtn').addEventListener('click', () => {
    if (state.selectedMovie) {
      openBookingModal(state.selectedMovie);
    } else if (state.movies.length > 0) {
      openBookingModal(state.movies[0]);
    }
  });

  document.getElementById('heroDetailsBtn').addEventListener('click', () => {
    const movie = state.selectedMovie || state.movies[0];
    if (movie) {
      showToast(`Showing info for: ${movie.title}`, 'info');
    }
  });

  // Showtime selection buttons
  document.getElementById('showtimeOptions').addEventListener('click', (e) => {
    const btn = e.target.closest('.time-btn');
    if (btn) {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedShowtime = btn.getAttribute('data-time');
      state.selectedScreen = btn.getAttribute('data-screen');
      updateCheckoutSummary();
    }
  });

  // Modals Open/Close buttons
  setupModalListeners();

  // Preset Buttons in Add Movie Modal
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const preset = MOVIE_PRESETS[presetKey];
      if (preset) {
        document.getElementById('movieTitleInput').value = preset.title;
        document.getElementById('movieDescInput').value = preset.description;
        document.getElementById('movieGenreInput').value = preset.genre;
        document.getElementById('movieLangInput').value = preset.language;
        document.getElementById('movieDurationInput').value = preset.durationMins;
        document.getElementById('movieReleaseInput').value = preset.releaseDate;
        document.getElementById('moviePosterInput').value = preset.posterUrl;
        showToast(`Loaded preset: ${preset.title}`, 'info');
      }
    });
  });

  // Add Movie Form Submit
  document.getElementById('addMovieForm').addEventListener('submit', handleAddMovieSubmit);

  // Checkout Form Submit (Booking Confirmation)
  document.getElementById('checkoutForm').addEventListener('submit', handleBookingSubmit);

  // Print Ticket Button
  document.getElementById('printTicketBtn').addEventListener('click', () => {
    window.print();
  });

  // Search booking by ID
  document.getElementById('searchBookingIdBtn').addEventListener('click', handleSearchBookingById);
}

function setupModalListeners() {
  const bookingModal = document.getElementById('bookingModal');
  const addMovieModal = document.getElementById('addMovieModal');
  const ticketModal = document.getElementById('ticketModal');
  const myBookingsModal = document.getElementById('myBookingsModal');

  // Add Movie modal open/close
  document.getElementById('openAddMovieBtn').addEventListener('click', () => {
    addMovieModal.showModal();
  });
  document.getElementById('closeAddMovieModalBtn').addEventListener('click', () => {
    addMovieModal.close();
  });
  document.getElementById('cancelAddMovieBtn').addEventListener('click', () => {
    addMovieModal.close();
  });

  // Booking modal close
  document.getElementById('closeBookingModalBtn').addEventListener('click', () => {
    bookingModal.close();
  });

  // Ticket modal close
  document.getElementById('closeTicketModalBtn').addEventListener('click', () => {
    ticketModal.close();
  });
  document.getElementById('doneTicketBtn').addEventListener('click', () => {
    ticketModal.close();
  });

  // My Bookings modal open/close
  document.getElementById('openBookingsBtn').addEventListener('click', () => {
    renderBookingsHistory();
    myBookingsModal.showModal();
  });
  document.getElementById('closeMyBookingsModalBtn').addEventListener('click', () => {
    myBookingsModal.close();
  });

  // Close modals when clicking backdrop
  [bookingModal, addMovieModal, ticketModal, myBookingsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
  });
}

function resetFilters() {
  state.activeGenre = "ALL";
  state.activeLanguage = "ALL";
  state.searchQuery = "";
  document.getElementById('searchInput').value = "";
  document.getElementById('clearSearchBtn').style.display = "none";
  document.getElementById('languageSelect').value = "ALL";
  document.querySelectorAll('#genreChips .chip').forEach(c => c.classList.remove('active'));
  document.querySelector('#genreChips .chip[data-genre="ALL"]')?.classList.add('active');
  renderMoviesGrid();
}

/* =========================================================
   BACKEND API INTERACTIONS
   ========================================================= */

async function checkBackendHealth() {
  const pill = document.getElementById('backendStatusPill');
  const dot = document.getElementById('backendStatusDot');
  const text = document.getElementById('backendStatusText');

  try {
    const res = await fetch(`${API_BASE}/api/movies`, { method: 'GET' });
    if (res.ok) {
      state.backendConnected = true;
      pill.className = 'backend-status-pill connected';
      text.textContent = 'Backend Connected (:8080)';
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    state.backendConnected = false;
    pill.className = 'backend-status-pill error';
    text.textContent = 'Backend Offline (Demo Mode)';
  }
}

async function fetchMovies() {
  try {
    const res = await fetch(`${API_BASE}/api/movies`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      state.movies = data;
      state.backendConnected = true;
      document.getElementById('backendStatusPill').className = 'backend-status-pill connected';
      document.getElementById('backendStatusText').textContent = 'Backend Connected (:8080)';
    } else {
      // If DB is empty, use sample presets so UI looks complete
      state.movies = Object.values(MOVIE_PRESETS);
    }
  } catch (error) {
    console.warn('Could not fetch movies from backend, fallback to local presets:', error);
    state.movies = Object.values(MOVIE_PRESETS);
  }

  renderHeroSpotlight(state.movies[0]);
  renderMoviesGrid();
}

async function handleAddMovieSubmit(e) {
  e.preventDefault();

  const saveBtn = document.getElementById('saveMovieBtn');
  const originalText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span>Saving...</span>';

  const moviePayload = {
    title: document.getElementById('movieTitleInput').value.trim(),
    description: document.getElementById('movieDescInput').value.trim(),
    genre: document.getElementById('movieGenreInput').value,
    language: document.getElementById('movieLangInput').value,
    durationMins: parseInt(document.getElementById('movieDurationInput').value, 10),
    releaseDate: document.getElementById('movieReleaseInput').value,
    posterUrl: document.getElementById('moviePosterInput').value.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop'
  };

  try {
    const res = await fetch(`${API_BASE}/api/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moviePayload)
    });

    if (res.ok) {
      const createdMovie = await res.json();
      showToast(`Movie "${createdMovie.title}" added successfully!`, 'success');
      document.getElementById('addMovieModal').close();
      document.getElementById('addMovieForm').reset();
      fetchMovies();
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Server returned ${res.status}`);
    }
  } catch (err) {
    console.error('Error adding movie:', err);
    // Add locally for demo if backend is offline
    state.movies.unshift({ ...moviePayload, id: Date.now() });
    renderMoviesGrid();
    showToast(`Movie added locally (Backend offline: ${err.message})`, 'info');
    document.getElementById('addMovieModal').close();
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalText;
  }
}

async function seedSampleMovies() {
  const seedBtn = document.getElementById('seedDataBtn');
  seedBtn.disabled = true;
  seedBtn.textContent = 'Adding Movies to Database...';

  const presets = Object.values(MOVIE_PRESETS);
  let addedCount = 0;

  for (const movie of presets) {
    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      if (res.ok) addedCount++;
    } catch (err) {
      console.warn('Seed failed for:', movie.title);
    }
  }

  showToast(`Successfully seeded ${addedCount} movies into your database!`, 'success');
  seedBtn.disabled = false;
  seedBtn.innerHTML = '<span>Add Popular Movies to Database</span>';
  fetchMovies();
}

/* =========================================================
   RENDERING UI COMPONENTS
   ========================================================= */

function renderHeroSpotlight(movie) {
  if (!movie) return;

  state.selectedMovie = movie;
  document.getElementById('heroTitle').textContent = movie.title;
  document.getElementById('heroGenre').textContent = `${movie.genre} / Feature Film`;
  document.getElementById('heroDuration').textContent = `${movie.durationMins || 150} Mins`;
  document.getElementById('heroLanguage').textContent = movie.language;
  document.getElementById('heroDesc').textContent = movie.description;

  const backdrop = document.getElementById('heroBackdrop');
  if (movie.posterUrl) {
    backdrop.style.backgroundImage = `url('${movie.posterUrl}')`;
  }
}

function renderMoviesGrid() {
  const grid = document.getElementById('moviesGrid');
  const emptyState = document.getElementById('emptyState');
  const badge = document.getElementById('moviesCountBadge');

  // Filter movies
  const filtered = state.movies.filter(movie => {
    const matchGenre = state.activeGenre === "ALL" || (movie.genre && movie.genre.toLowerCase() === state.activeGenre.toLowerCase());
    const matchLang = state.activeLanguage === "ALL" || (movie.language && movie.language.toLowerCase() === state.activeLanguage.toLowerCase());
    const matchQuery = !state.searchQuery || 
      (movie.title && movie.title.toLowerCase().includes(state.searchQuery)) ||
      (movie.genre && movie.genre.toLowerCase().includes(state.searchQuery)) ||
      (movie.language && movie.language.toLowerCase().includes(state.searchQuery));

    return matchGenre && matchLang && matchQuery;
  });

  badge.textContent = `${filtered.length} Movie${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  grid.innerHTML = filtered.map(movie => `
    <article class="movie-card" data-id="${movie.id || ''}">
      <div class="movie-poster-wrapper">
        <img 
          src="${movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop'}" 
          alt="${movie.title}" 
          class="movie-poster" 
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop';"
        >
        <span class="movie-overlay-badge">&#9733; 8.8</span>
        <span class="movie-lang-pill">${movie.language || 'English'}</span>
      </div>
      <div class="movie-info">
        <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
        <div class="movie-tags">
          <span class="movie-genre-badge">${movie.genre || 'Action'}</span>
          <span>&bull;</span>
          <span class="movie-duration-badge">${movie.durationMins || 140}m</span>
        </div>
        <p class="movie-synopsis">${movie.description || 'Experience this thrilling movie on the big screen.'}</p>
        <div class="movie-card-footer">
          <button class="btn btn-secondary btn-quick-view" onclick="selectHeroMovie(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
            Spotlight
          </button>
          <button class="btn btn-primary btn-book" onclick="openBookingModal(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
            Book
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

window.selectHeroMovie = function(movie) {
  renderHeroSpotlight(movie);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`Spotlight switched to "${movie.title}"`, 'info');
};

/* =========================================================
   CINEMA SEATING MATRIX & BOOKING FLOW
   ========================================================= */

function generateSeatMatrix() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  rows.forEach(rowLetter => {
    const rowContainer = document.getElementById(`seatRow${rowLetter}`);
    if (!rowContainer) return;

    const config = SEAT_PRICING[rowLetter];
    let html = `<span class="seat-row-label">${rowLetter}</span>`;

    for (let i = 1; i <= config.count; i++) {
      const seatId = `${rowLetter}${i}`;
      const isOccupied = DEFAULT_OCCUPIED_SEATS.includes(seatId);
      const isVip = config.isVip;

      html += `
        <button 
          type="button" 
          class="seat-btn ${isOccupied ? 'booked' : ''} ${isVip ? 'vip-seat' : ''}" 
          id="seat-${seatId}" 
          data-seat-id="${seatId}" 
          data-row="${rowLetter}" 
          data-num="${i}" 
          data-price="${config.price}" 
          data-tier="${config.tier}" 
          ${isOccupied ? 'disabled' : ''}
          title="Seat ${seatId} (${config.tier}) - ₹${config.price}"
        >
          ${i}
        </button>
      `;
    }

    rowContainer.innerHTML = html;
  });

  // Attach click listeners to seats
  document.querySelectorAll('.seat-btn:not(.booked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const seatId = btn.getAttribute('data-seat-id');
      const price = parseFloat(btn.getAttribute('data-price'));
      const tier = btn.getAttribute('data-tier');

      if (state.selectedSeats.has(seatId)) {
        state.selectedSeats.delete(seatId);
        btn.classList.remove('selected');
      } else {
        state.selectedSeats.set(seatId, { id: seatId, price, tier });
        btn.classList.add('selected');
      }

      updateCheckoutSummary();
    });
  });
}

window.openBookingModal = function(movie) {
  state.selectedMovie = movie;
  state.selectedSeats.clear();

  // Reset visual selected seats
  document.querySelectorAll('.seat-btn.selected').forEach(b => b.classList.remove('selected'));

  // Update modal headers
  document.getElementById('bookingModalMovieTitle').textContent = `Book Tickets: ${movie.title}`;
  document.getElementById('bookingModalMovieMeta').textContent = `${movie.genre} • ${movie.language} • ${movie.durationMins || 140} Mins`;

  // Update checkout sidebar
  document.getElementById('checkoutMoviePoster').src = movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop';
  document.getElementById('checkoutMovieTitle').textContent = movie.title;
  document.getElementById('checkoutCinemaInfo').textContent = `PVR BMS Cinemas, ${document.getElementById('citySelect').value}`;

  updateCheckoutSummary();
  document.getElementById('bookingModal').showModal();
};

function updateCheckoutSummary() {
  const chipsContainer = document.getElementById('selectedSeatsChips');
  const subtotalEl = document.getElementById('subtotalPrice');
  const feeEl = document.getElementById('convenienceFee');
  const totalEl = document.getElementById('grandTotalPrice');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const timeBadge = document.getElementById('checkoutTimeBadge');

  timeBadge.textContent = `Today, ${state.selectedShowtime} • ${state.selectedScreen}`;

  if (state.selectedSeats.size === 0) {
    chipsContainer.innerHTML = '<span class="no-seats-msg">No seats selected yet</span>';
    subtotalEl.textContent = '₹0.00';
    feeEl.textContent = '₹0.00';
    totalEl.textContent = '₹0.00';
    confirmBtn.disabled = true;
    confirmBtn.querySelector('span').textContent = 'Confirm & Pay ₹0.00';
    return;
  }

  // Calculate totals
  let subtotal = 0;
  let chipsHtml = '';

  state.selectedSeats.forEach((seat) => {
    subtotal += seat.price;
    chipsHtml += `<span class="seat-chip">${seat.id} (₹${seat.price})</span>`;
  });

  const convenienceFee = Math.round(subtotal * 0.08); // 8% fee
  const grandTotal = subtotal + convenienceFee;

  chipsContainer.innerHTML = chipsHtml;
  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  feeEl.textContent = `₹${convenienceFee.toFixed(2)}`;
  totalEl.textContent = `₹${grandTotal.toFixed(2)}`;

  confirmBtn.disabled = false;
  confirmBtn.querySelector('span').textContent = `Confirm & Pay ₹${grandTotal.toFixed(2)}`;
}

async function handleBookingSubmit() {
  if (state.selectedSeats.size === 0) {
    showToast('Please select at least one seat to proceed.', 'error');
    return;
  }

  const confirmBtn = document.getElementById('confirmBookingBtn');
  confirmBtn.disabled = true;
  confirmBtn.querySelector('span').textContent = 'Processing Booking...';

  const userName = document.getElementById('userNameInput').value.trim() || 'Saurabh Kumar';
  const userEmail = document.getElementById('userEmailInput').value.trim() || 'saurabh@example.com';
  const userPhone = document.getElementById('userPhoneInput').value.trim() || '9876543210';
  const paymentMethod = document.getElementById('paymentMethodSelect').value;

  const seatIds = Array.from(state.selectedSeats.keys());
  let subtotal = 0;
  state.selectedSeats.forEach(s => subtotal += s.price);
  const totalAmount = subtotal + Math.round(subtotal * 0.08);

  const bookingPayload = {
    userId: 1,
    showId: 1,
    seatIds: [1, 2], // Backend ShowSeat IDs
    paymentMethod: paymentMethod
  };

  const bookingRefNumber = 'BMS-' + Math.floor(100000 + Math.random() * 900000);
  const bookingTime = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const ticketData = {
    bookingNumber: bookingRefNumber,
    movieTitle: state.selectedMovie ? state.selectedMovie.title : 'Movie Ticket',
    genreLang: `${state.selectedMovie?.genre || 'Action'} • ${state.selectedMovie?.language || 'English'} • ${state.selectedMovie?.durationMins || 140} Mins`,
    cinemaName: `PVR BMS Cinemas, ${document.getElementById('citySelect').value}`,
    dateTime: `Today, ${state.selectedShowtime}`,
    screenName: state.selectedScreen,
    seatsList: seatIds.join(', '),
    totalAmount: `₹${totalAmount.toFixed(2)}`,
    userName: userName,
    userPhone: userPhone,
    paymentMethod: `${paymentMethod} (SUCCESS)`
  };

  // Send request to Spring Boot backend if available
  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });

    if (res.ok) {
      const serverBooking = await res.json();
      if (serverBooking.bookingNumber) {
        ticketData.bookingNumber = serverBooking.bookingNumber;
      }
      showToast('Booking successfully recorded on Spring Boot server!', 'success');
    }
  } catch (err) {
    console.warn('Backend booking failed, generating client pass:', err);
  }

  // Save to recent bookings in state & localStorage
  state.recentBookings.unshift(ticketData);
  localStorage.setItem('bms_recent_bookings', JSON.stringify(state.recentBookings.slice(0, 20)));

  // Close booking modal and open ticket modal
  document.getElementById('bookingModal').close();
  renderTicketPass(ticketData);
  document.getElementById('ticketModal').showModal();

  confirmBtn.disabled = false;
  confirmBtn.querySelector('span').textContent = `Confirm & Pay ₹${totalAmount.toFixed(2)}`;
}

function renderTicketPass(ticket) {
  document.getElementById('ticketNumberBadge').textContent = ticket.bookingNumber;
  document.getElementById('ticketMovieTitle').textContent = ticket.movieTitle;
  document.getElementById('ticketGenreLang').textContent = ticket.genreLang;
  document.getElementById('ticketCinemaName').textContent = ticket.cinemaName;
  document.getElementById('ticketDateTime').textContent = ticket.dateTime;
  document.getElementById('ticketScreenName').textContent = ticket.screenName;
  document.getElementById('ticketSeatsList').textContent = ticket.seatsList;
  document.getElementById('ticketTotalAmount').textContent = ticket.totalAmount;
  document.getElementById('ticketUserName').textContent = ticket.userName;
  document.getElementById('ticketUserPhone').textContent = ticket.userPhone;
  document.getElementById('ticketPaymentMethod').textContent = ticket.paymentMethod;
  document.getElementById('ticketBarcodeNumber').textContent = `0192847${Math.floor(10000000 + Math.random() * 90000000)}`;
}

/* =========================================================
   MY BOOKINGS HISTORY & LOOKUP
   ========================================================= */

function renderBookingsHistory() {
  const container = document.getElementById('bookingsHistoryList');

  if (state.recentBookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-dim);">
        <p>No confirmed bookings in your current session.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Book a movie to see your digital pass here!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.recentBookings.map((b, idx) => `
    <div class="history-item-card">
      <div>
        <h4 class="history-movie-title">${b.movieTitle}</h4>
        <div class="history-details">
          <span>${b.dateTime}</span> &bull; <span>${b.screenName}</span> &bull; <strong>Seats: ${b.seatsList}</strong>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">
          Ref: <code>${b.bookingNumber}</code> &bull; Total: <strong style="color: #34d399;">${b.totalAmount}</strong>
        </div>
      </div>
      <div>
        <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;" onclick="viewPastTicket(${idx})">
          View Pass
        </button>
      </div>
    </div>
  `).join('');
}

window.viewPastTicket = function(index) {
  const ticket = state.recentBookings[index];
  if (ticket) {
    document.getElementById('myBookingsModal').close();
    renderTicketPass(ticket);
    document.getElementById('ticketModal').showModal();
  }
};

async function handleSearchBookingById() {
  const idInput = document.getElementById('bookingSearchInput');
  const id = idInput.value.trim();
  if (!id) {
    showToast('Please enter a booking ID to search', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}`);
    if (res.ok) {
      const data = await res.json();
      showToast(`Found booking #${id}!`, 'success');
      const ticketData = {
        bookingNumber: data.bookingNumber || `BMS-${data.id}`,
        movieTitle: data.show?.movie?.title || 'Movie Booking',
        genreLang: `${data.show?.movie?.genre || ''} • ${data.show?.movie?.language || ''}`,
        cinemaName: `PVR BMS Cinemas, ${data.show?.screen?.theater?.city || 'Bengaluru'}`,
        dateTime: data.show?.startTime || 'Today, 10:30 AM',
        screenName: data.show?.screen?.name || 'Screen 1',
        seatsList: data.seats ? data.seats.map(s => s.seat?.seatNumber).join(', ') : 'Confirmed Seats',
        totalAmount: `₹${data.totalAmount || 500}`,
        userName: data.user?.name || 'Customer',
        userPhone: data.user?.phoneNumber || '9876543210',
        paymentMethod: `${data.payment?.paymentMethod || 'UPI'} (${data.status || 'CONFIRMED'})`
      };
      document.getElementById('myBookingsModal').close();
      renderTicketPass(ticketData);
      document.getElementById('ticketModal').showModal();
    } else {
      showToast(`Booking with ID "${id}" was not found in the database.`, 'error');
    }
  } catch (err) {
    showToast(`Error connecting to server for booking lookup: ${err.message}`, 'error');
  }
}

/* =========================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================= */

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' 
    ? '✅' 
    : type === 'error' 
    ? '❌' 
    : 'ℹ️';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
