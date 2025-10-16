import api from '../api/axios';

let accessToken = null;

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.accessToken) {
            accessToken = response.data.accessToken;
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.accessToken) {
            accessToken = response.data.accessToken;
        }
        return response.data;
    },

    async logout() {
        await api.post('/auth/logout');
        accessToken = null;
    },

    async getCurrentUser() {
        return api.get('/users/me');
    },

    async refreshAccessToken() {
        try {
            const response = await api.post('/auth/refresh');
            accessToken = response.data.accessToken;
            return accessToken;
        } catch (error) {
            accessToken = null;
            throw error;
        }
    },

    getAccessToken() {
        return accessToken;
    },

    isAuthenticated() {
        return !!accessToken;
    },
};