import api from './api';

export const productService = {
  async getAll(params = {}) {
    const response = await api.get('/appliances', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/appliances/${id}`);
    return response.data;
  },

  async create(productData) {
    const response = await api.post('/appliances', productData);
    return response.data;
  },

  async update(id, productData) {
    const response = await api.patch(`/appliances/${id}`, productData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/appliances/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

    async getManufacturers() {
    const response = await api.get('/manufacturers');
    return response.data;
  },
};