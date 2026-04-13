import axios from 'axios';

const API_URL = 'https://cosmosfm-production.up.railway.app/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shows
export const showsApi = {
  getAll: () => api.get('/shows'),
  getCurrent: () => api.get('/shows/current'),
  create: (data: any) => api.post('/shows', data),
  update: (id: string, data: any) => api.put(`/shows/${id}`, data),
  delete: (id: string) => api.delete(`/shows/${id}`),
};

// Podcasts
export const podcastsApi = {
  getAll: () => api.get('/podcasts'),
  create: (data: any) => api.post('/podcasts', data),
  update: (id: string, data: any) => api.put(`/podcasts/${id}`, data),
  delete: (id: string) => api.delete(`/podcasts/${id}`),
};

// Hosts
export const hostsApi = {
  getAll: () => api.get('/hosts'),
  create: (data: any) => api.post('/hosts', data),
  update: (id: string, data: any) => api.put(`/hosts/${id}`, data),
  delete: (id: string) => api.delete(`/hosts/${id}`),
};

// Data export/import
export const dataApi = {
  getAll: () => api.get('/data'),
  update: (data: any) => api.post('/data', data),
};