import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const productService = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const saleService = {
  getAll: () => api.get('/sales'),
  create: (data) => api.post('/sales', data),
  deleteAll: () => api.delete('/sales'),
};

export default api;
