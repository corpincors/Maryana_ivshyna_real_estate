"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERNAME = 'Maryana';
const PASSWORD = 'Colar90estate';
const AUTH_STORAGE_KEY = 'realty_crm_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    }
  }, [isAuthenticated]);

  const login = (usernameInput: string, passwordInput: string): boolean => {
    if (usernameInput === USERNAME && passwordInput === PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};