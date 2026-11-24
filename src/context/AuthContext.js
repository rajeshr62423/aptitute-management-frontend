'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorage, setStorage } from '@/services/storageService';

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  isHydrated: false,
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let hasAuth = false;
    if (typeof window !== 'undefined') {
      const token =
        sessionStorage.getItem('ap_admin_token') ||
        localStorage.getItem('ap_admin_token');
      const sessionAuth = sessionStorage.getItem('ap_admin');
      const localAuth = getStorage('admin', false);
      hasAuth = Boolean(token && (sessionAuth || localAuth));
    }
    const timer = setTimeout(() => {
      setIsAuthenticated(hasAuth);
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = (email, password, rememberMe = false) => {
    if (email === 'admin@aptitudepro.com' && password === 'Admin@123') {
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          setStorage('admin', true);
          localStorage.setItem('ap_admin_token', 'mock-jwt-admin-token-12345');
          sessionStorage.removeItem('ap_admin_token');
          sessionStorage.removeItem('ap_admin');
        } else {
          sessionStorage.setItem('ap_admin', JSON.stringify(true));
          sessionStorage.setItem('ap_admin_token', 'mock-jwt-admin-token-12345');
          setStorage('admin', false);
          localStorage.removeItem('ap_admin_token');
        }
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ap_admin_token');
      localStorage.removeItem('ap_admin_remember');
      setStorage('admin', false);
      sessionStorage.removeItem('ap_admin_token');
      sessionStorage.removeItem('ap_admin');
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isHydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
