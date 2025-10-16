import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadUserOnStartup = async () => {
      try {
        await authService.refreshAccessToken();
        const response = await authService.getCurrentUser();
        setUser(response.data); 
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUserOnStartup();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user); 
    closeAuthModal();
    return response.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    await authService.register(userData);
    const response = await authService.getCurrentUser();
    setUser(response.data); 
    closeAuthModal();
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};