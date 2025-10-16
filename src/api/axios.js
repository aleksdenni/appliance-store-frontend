import axios from 'axios';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor для обробки помилок
api.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken(); // Беремо токен з сервісу
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor для відповідей
api.interceptors.response.use(
    (response) => response, // відповідь успішна то повертаємо її
    async (error) => {
        const originalRequest = error.config;
        
        // помилка 401 і це не повторний запит
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Позначаємо, що це повторний запит

            try {
                const newAccessToken = await authService.refreshAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                // Повторюємо оригінальний запит з новим токеном
                return api(originalRequest);
            } catch (refreshError) {
                // якщо оновлення не вдалося (напр., refresh-токен застарів)
                authService.logout(); // Виконую вихід
                window.location.href = '/login'; // Перенаправляю на сторінку входу
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;