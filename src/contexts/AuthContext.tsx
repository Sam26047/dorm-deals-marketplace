
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserWithMetadata extends User {
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: UserWithMetadata | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserWithMetadata | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      
      if (session?.user) {
        // Add name from user metadata if available
        const userWithMetadata: UserWithMetadata = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar || undefined
        };
        setCurrentUser(userWithMetadata);
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        toast.success('Signed in successfully!');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Signed out successfully.');
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      
      if (session?.user) {
        // Add name from user metadata if available
        const userWithMetadata: UserWithMetadata = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar || undefined
        };
        setCurrentUser(userWithMetadata);
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Login successful:', data);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('Attempting logout...');
      
      // Clear local state first
      setCurrentUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, we've cleared local state
        toast.info('Signed out locally.');
      } else {
        console.log('Logout successful');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout completely, but you have been signed out locally.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser && !!session
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
