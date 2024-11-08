'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient'; 
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for an existing session on load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession(); // Call the async function

    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Define login and logout actions
  const login = async () => {
    // This would redirect to Supabase's auth or show a login modal, for example
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear the user state on logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
