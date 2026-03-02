import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const chatAPI = {
  createConversation: (data) => api.post('/chat/conversations', data),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (id) => api.get(`/chat/conversations/${id}`),
  sendMessage: (data) => api.post('/chat/messages', data),
  deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),
  archiveConversation: (id) => api.put(`/chat/conversations/${id}/archive`),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deactivateUser: (id) => api.patch(`/admin/users/${id}/deactivate`),
  getAnalytics: () => api.get('/admin/analytics'),
  getUserStats: (id) => api.get(`/admin/users/${id}/stats`),
};

export default api;
