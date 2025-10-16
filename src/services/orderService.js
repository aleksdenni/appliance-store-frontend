import api from '../api/axios';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};