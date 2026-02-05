import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const productService = {
  getAll: (category) => api.get("/products", { params: { category } }),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const saleService = {
  getAll: (category) => api.get("/sales", { params: { category } }),
  getDeleted: () => api.get("/sales/deleted"),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post("/sales", data),
  delete: (id) => api.delete(`/sales/${id}`),
  deleteAll: () => api.delete("/sales"),
};

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  register: (userData) => api.post("/auth/register", userData),
  getUsers: () => api.get("/auth/users"),
  createSeller: (userData) => api.post("/auth/users", userData),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  getSecurityQuestion: (email) => api.get(`/auth/security-question/${email}`),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const expenseService = {
  getAll: () => api.get("/expenses"),
  create: (data) => api.post("/expenses", data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const shopService = {
  get: () => api.get("/shop"),
  update: (data) => api.put("/shop", data),
};

export const clientService = {
  getAll: () => api.get("/clients"),
  create: (data) => api.post("/clients", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  addRepayment: (id, amount) =>
    api.post(`/clients/${id}/repayment`, { amount }),
  getTransactions: (id) => api.get(`/clients/${id}/transactions`),
};

export const supplierService = {
  getAll: () => api.get("/suppliers"),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const categoryService = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
