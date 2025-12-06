import api from '../api';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
}

export const appointmentsService = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
