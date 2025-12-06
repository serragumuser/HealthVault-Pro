import api from '../api';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export const profileService = {
  get: async () => {
    const response = await api.get('/patients/me');
    return response.data.data;
  },

  update: async (data: Partial<ProfileData>) => {
    const response = await api.put('/patients/me', data);
    return response.data.data;
  },
};
