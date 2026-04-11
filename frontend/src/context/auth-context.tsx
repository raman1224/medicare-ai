// frontend/src/context/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  country?: string;
  language?: string;
  avatar?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;
  const clearError = () => setError(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for OAuth callback first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          setUser(parsedUser);
          sessionStorage.setItem('medicare_user', JSON.stringify(parsedUser));
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsLoading(false);
          return;
        }
        
        // Try to get user from sessionStorage first (faster)
        const storedUser = sessionStorage.getItem('medicare_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoading(false);
          
          // Still verify with backend in background
          api.getCurrentUser().then(response => {
            // ✅ FIX: Check if response exists and has success property
            if (response && response.success && response.data) {
              setUser(response.data);
              sessionStorage.setItem('medicare_user', JSON.stringify(response.data));
            }
          }).catch(() => {
            // If backend fails, we already have stored user
          });
          return;
        }
        
        // Check with backend - cookie will be sent automatically
        const response = await api.getCurrentUser();
        
        // ✅ FIX: Check if response exists before accessing properties
        if (response && response.success && response.data) {
          setUser(response.data);
          sessionStorage.setItem('medicare_user', JSON.stringify(response.data));
        } else {
          setUser(null);
          sessionStorage.removeItem('medicare_user');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        sessionStorage.removeItem('medicare_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await api.login(email, password);
      
      if (response && response.success && response.user) {
        setUser(response.user);
        sessionStorage.setItem('medicare_user', JSON.stringify(response.user));
        router.push('/dashboard');
      } else {
        throw new Error(response?.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await api.register(userData);
      
      if (response && response.success && response.user) {
        setUser(response.user);
        sessionStorage.setItem('medicare_user', JSON.stringify(response.user));
        router.push('/dashboard');
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    clearError();
    api.googleLogin();
  };

  const loginWithGithub = () => {
    clearError();
    api.githubLogin();
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    sessionStorage.removeItem('medicare_user');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      loginWithGoogle,
      loginWithGithub,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}