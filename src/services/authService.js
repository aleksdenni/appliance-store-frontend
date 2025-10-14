import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  getRole() {
    return localStorage.getItem('userRole');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};