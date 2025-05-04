
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // In a real app, these would call an authentication API
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll just create a mock user
      // In a real app, this would validate credentials with a backend
      if (email && password) {
        const user: User = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll just create a mock user
      // In a real app, this would register the user with a backend
      if (email && password && name) {
        const user: User = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          email,
          name,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Account created successfully!');
      } else {
        throw new Error('Invalid signup information');
      }
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out.');
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
