import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await getMe();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
