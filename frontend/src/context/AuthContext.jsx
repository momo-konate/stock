import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        // Ne mettre à jour que si les données ont changé pour éviter les re-renders infinis
        if (storedUser.role !== data.role || storedUser.username !== data.username || storedUser.email !== data.email) {
          const updatedUser = { ...storedUser, ...data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du profil:", error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        refreshUser(); // Synchroniser avec la DB au chargement
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [refreshUser]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
