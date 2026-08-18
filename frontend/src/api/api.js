import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const movieApi = {
  getAll: () => api.get('/movies').then(r => r.data),
  getById: (id) => api.get(`/movies/${id}`).then(r => r.data),
  create: (data) => api.post('/movies', data).then(r => r.data),
};

export const bookingApi = {
  create: (data) => api.post('/bookings', data).then(r => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then(r => r.data),
};

export default api;
