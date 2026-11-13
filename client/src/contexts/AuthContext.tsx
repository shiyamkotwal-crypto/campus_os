import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { apiRequest } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  register: (data: any) => Promise<UserProfile>;
  logout: () => void;
  quickSwitchDemoUser: (role: UserRole) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('campus_os_user');
      if (!saved || saved === 'undefined' || saved === 'null') {
        localStorage.removeItem('campus_os_user');
        return null;
      }
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('campus_os_user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('campus_os_token');
    if (!saved || saved === 'undefined' || saved === 'null') {
      localStorage.removeItem('campus_os_token');
      return null;
    }
    return saved;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await apiRequest<{ user: UserProfile }>('/auth/me');
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('campus_os_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err);
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (email: string, password: string = 'CampusOS@2026'): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const userProfile = res?.user;
      const userToken = res?.token;

      if (!userProfile) {
        throw new Error('Authentication failed: No user profile received from server.');
      }

      setToken(userToken || null);
      setUser(userProfile);
      if (userToken) {
        localStorage.setItem('campus_os_token', userToken);
      }
      localStorage.setItem('campus_os_user', JSON.stringify(userProfile));
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const userProfile = res?.user;
      const userToken = res?.token;

      if (!userProfile) {
        throw new Error('Registration failed: No user profile received from server.');
      }

      setToken(userToken || null);
      setUser(userProfile);
      if (userToken) {
        localStorage.setItem('campus_os_token', userToken);
      }
      localStorage.setItem('campus_os_user', JSON.stringify(userProfile));
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const quickSwitchDemoUser = async (role: UserRole): Promise<UserProfile> => {
    const emailMap: Record<UserRole, string> = {
      student: 'alex.rivera@student.apex.edu',
      faculty: 'sarah.jenkins@apex.edu',
      admin: 'admin@apex.edu'
    };
    return await login(emailMap[role]);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_os_token');
    localStorage.removeItem('campus_os_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

