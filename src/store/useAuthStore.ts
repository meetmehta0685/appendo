import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial credentials from localStorage if present
  const savedToken = localStorage.getItem('tyroo_token');
  const savedEmail = localStorage.getItem('tyroo_email');

  return {
    isAuthenticated: !!savedToken,
    token: savedToken,
    email: savedEmail,
    login: (email, token) => {
      localStorage.setItem('tyroo_token', token);
      localStorage.setItem('tyroo_email', email);
      set({ isAuthenticated: true, token, email });
    },
    logout: () => {
      localStorage.removeItem('tyroo_token');
      localStorage.removeItem('tyroo_email');
      set({ isAuthenticated: false, token: null, email: null });
    }
  };
});
