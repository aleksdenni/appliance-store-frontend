import api from '../api/axios';

const hasActiveFilters = (filter) => {
  if (!filter) return false;
  return (
    (filter.search && filter.search.trim() !== '') ||
    filter.categoryId != null ||
    filter.minPrice != null ||
    filter.maxPrice != null ||
    filter.inStock != null ||
    (filter.manufacturerIds && filter.manufacturerIds.length > 0)
  );
};

export const productService = {
  async getAll(params) {
    const useFilterEndpoint = hasActiveFilters(params);
    const url = useFilterEndpoint ? '/appliances/filter' : '/appliances';
    const cleanedParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get(url, { params: cleanedParams });
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