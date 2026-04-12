import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cwa_token'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/profile');
          setUser(data.data);
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('cwa_token');
          localStorage.removeItem('cwa_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem('cwa_token', data.data.token);
      localStorage.setItem('cwa_user', JSON.stringify(data.data));
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem('cwa_token', data.data.token);
      localStorage.setItem('cwa_user', JSON.stringify(data.data));
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cwa_token');
    localStorage.removeItem('cwa_user');
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      setUser(data.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
