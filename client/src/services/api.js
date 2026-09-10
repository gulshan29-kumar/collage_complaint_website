import axios from 'axios';

// Get base URL from environment variable, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically inject JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clean local storage
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register attempt failure
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (credentials) => api.post('/api/auth/login', credentials);
export const registerUser = (userData) => api.post('/api/auth/register', userData);
export const getMe = () => api.get('/api/auth/me');

// Complaint APIs (Student & General)
export const getComplaints = () => api.get('/api/complaints');
export const getComplaintById = (id) => api.get(`/api/complaints/${id}`);
export const createComplaint = (data) => api.post('/api/complaints', data);
export const deleteComplaint = (id) => api.delete(`/api/complaints/${id}`);

// Admin APIs
export const getAdminStats = () => api.get('/api/admin/stats');
export const getStaffList = () => api.get('/api/admin/staff');
export const assignStaff = (id, data) => api.put(`/api/admin/complaints/${id}/assign`, data);
export const updateAdminPriority = (id, data) => api.put(`/api/admin/complaints/${id}/priority`, data);
export const updateAdminStatus = (id, data) => api.put(`/api/admin/complaints/${id}/status`, data);

// Staff APIs
export const getStaffComplaints = () => api.get('/api/staff/complaints');
export const updateStaffStatus = (id, data) => api.put(`/api/staff/complaints/${id}/status`, data);
export const resolveComplaint = (id, data) => api.put(`/api/staff/complaints/${id}/resolve`, data);

export default api;
