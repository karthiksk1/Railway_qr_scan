import { useState, useEffect } from 'react';

type UserRole = 'admin' | 'inspector' | 'vendor';

export interface User {
  username: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    
    let role: UserRole = 'inspector'; // default
    
    if (username === 'admin' && password === 'admin123') {
      role = 'admin';
    } else if (username === 'inspector' && password === 'inspect123') {
      role = 'inspector';
    } else if (username === 'vendor' && password === 'vendor123') {
      role = 'vendor';
    }
    
    setUser({ username, role }); // This line was already present and correct.
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
};