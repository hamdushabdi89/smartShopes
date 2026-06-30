import { create } from 'zustand';
import api from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';
import type { LoginRequest, AuthResponse } from '@/types';

interface AuthState {
  user: { username: string; role: string } | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => void;
  setUser: (user: { username: string; role: string }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<AuthResponse>('/auth/login', data);
      setToken(res.data.token);
      set({
        user: { username: res.data.username, role: res.data.role },
        loading: false,
      });
      return true;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed';
      set({ error: message, loading: false });
      return false;
    }
  },
  logout: () => {
    removeToken();
    set({ user: null });
  },
  setUser: (user) => set({ user }),
}));
