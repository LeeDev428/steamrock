import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios defaults
axios.defaults.baseURL = '/api';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/auth/me');
          setAdmin(res.data);
        } catch (err) {
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      setAdmin(res.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    setAdmin(null);
  };

  // Setup first admin
  const setup = async (name, email, password) => {
    try {
      setError(null);
      const res = await axios.post('/auth/setup', { name, email, password });
      setAuthToken(res.data.token);
      setAdmin(res.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Setup failed';
      setError(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      loading, 
      error, 
      login, 
      logout, 
      setup,
      isAuthenticated: !!admin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
