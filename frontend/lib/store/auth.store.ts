/**
 * Authentication Store
 * Global state management for user authentication
 */

import { create } from 'zustand';
import api from '../api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN' | 'PHARMACIST';
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR';
  phoneNumber?: string;
  dateOfBirth?: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/register', data);

      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
