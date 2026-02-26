import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminLogin = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const { login, setup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if setup is needed
    const checkSetup = async () => {
      try {
        await axios.get('/auth/me');
      } catch (err) {
        if (err.response?.status === 401) {
          // Check if any admin exists
          try {
            const res = await axios.post('/auth/setup', {});
          } catch (setupErr) {
            if (setupErr.response?.data?.message === 'Setup already completed') {
              setIsSetup(false);
            } else {
              setIsSetup(true);
            }
          }
        }
      }
      setLoading(false);
    };
    checkSetup();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSetup) {
      if (!formData.name) {
        setError('Name is required');
        return;
      }
      const result = await setup(formData.name, formData.email, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-primary mb-2">
              Streamrock Realty
            </h1>
            <p className="text-gray-600">
              {isSetup ? 'Create Admin Account' : 'Admin Login'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSetup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              {isSetup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {isSetup && (
            <p className="mt-6 text-center text-sm text-gray-500">
              This is the initial setup. Create your admin account to get started.
            </p>
          )}
        </div>

        {/* Back to site link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-600 hover:text-primary transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
