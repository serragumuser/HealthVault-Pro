export * from './appointments.service';
export * from './profile.service';

// Central exports for all services
import api from '../api';

// Medical Records Service
export const recordsService = {
  getAll: () => api.get('/medical-records'),
  download: (id: string) => api.get(`/medical-records/${id}/download`, { responseType: 'blob' }),
};

// Prescriptions Service  
export const prescriptionsService = {
  getAll: () => api.get('/prescriptions'),
  getActive: () => api.get('/prescriptions?status=active'),
};

// Lab Results Service
export const labResultsService = {
  getAll: () => api.get('/lab-results'),
  getById: (id: string) => api.get(`/lab-results/${id}`),
};

// Vital Signs Service
export const vitalsService = {
  getAll: () => api.get('/vitals'),
  create: (data: any) => api.post('/vitals', data),
  getHistory: () => api.get('/vitals/history'),
};

// Doctors Service
export const doctorsService = {
  getAll: () => api.get('/doctors'),
  getById: (id: string) => api.get(`/doctors/${id}`),
  search: (query: string) => api.get(`/doctors/search?q=${query}`),
};

// AI Assistant Service
export const aiService = {
  chat: (message: string) => api.post('/ai/chat', { message }),
};
