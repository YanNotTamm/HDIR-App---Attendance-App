import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // In a real app, retrieve token from localStorage or cookie
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: number) => apiClient.get(`/users/${id}`),
  create: (data: any) => apiClient.post('/users', data),
  update: (id: number, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
};

// Offices API
export const officesApi = {
  getAll: () => apiClient.get('/offices'),
  getById: (id: number) => apiClient.get(`/offices/${id}`),
  create: (data: any) => apiClient.post('/offices', data),
  update: (id: number, data: any) => apiClient.put(`/offices/${id}`, data),
  delete: (id: number) => apiClient.delete(`/offices/${id}`),
};

// Face AI API
export const faceApi = {
  enroll: (userId: number, imageBase64: string) => apiClient.post('/face/enroll', { userId, imageBase64 }),
  verify: (userId: number, imageBase64: string) => apiClient.post('/face/verify', { userId, imageBase64 }),
};

// Leave API
export const leaveApi = {
  request: (data: any) => apiClient.post('/leave', data),
  getMyLeaves: (page = 1) => apiClient.get(`/leave?page=${page}`),
  getMyQuota: (userId?: number) => apiClient.get(`/leave/quota${userId ? `?userId=${userId}` : ''}`),
  getPending: () => apiClient.get('/leave/pending'),
  approve: (id: number, approvedBy = 1) => apiClient.post(`/leave/${id}/approve`, { approvedBy }),
  reject: (id: number, approvedBy = 1) => apiClient.post(`/leave/${id}/reject`, { approvedBy }),
  updateQuota: (id: number, quotaDays: number) => apiClient.put(`/leave/quota/${id}`, { quota_days: quotaDays }),
};

// Attendance API
export const attendanceApi = {
  checkIn: (data: any) => apiClient.post('/attendance/check-in', data),
  checkOut: (data: any) => apiClient.post('/attendance/check-out', data),
  getToday: () => apiClient.get('/attendance/today'),
  getHistory: (page = 1) => apiClient.get(`/attendance/history?page=${page}`),
  getPending: () => apiClient.get('/attendance/pending'),
  approve: (id: number, approvedBy = 1) => apiClient.post(`/attendance/${id}/approve`, { approvedBy }),
  reject: (id: number, approvedBy = 1) => apiClient.post(`/attendance/${id}/reject`, { approvedBy }),
};
