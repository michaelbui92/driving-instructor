'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthStatus, isAuthenticated } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  hasPinSet: boolean;
  expiresAt?: number;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  hasPinSet: false,
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    hasPinSet: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check auth status on mount and when window gains focus
    const checkAuth = () => {
      const status = getAuthStatus();
      setAuthState({
        ...status,
        isLoading: false,
      });
    };

    checkAuth();

    // Check auth when window regains focus
    const handleFocus = () => {
      checkAuth();
    };

    // Also refresh immediately when auth state changes (login/logout)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('auth-change', handleAuthChange);
    
    // Also check periodically (every 5 minutes) to catch expired sessions
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('auth-change', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}