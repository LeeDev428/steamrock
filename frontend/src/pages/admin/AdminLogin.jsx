import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';

const AdminLogin = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full opacity-75 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Branding Card */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-2xl mb-4">
            <img 
              src="/src.png" 
              alt="Streamrock Realty" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Streamrock Realty
          </h1>
          <p className="text-white/80 text-lg">
            Administration Portal
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSetup ? 'Create Admin Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isSetup ? 'Set up your administrator account to get started' : 'Sign in to your account to continue'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-shake">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSetup && (
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] mt-8"
              >
                {isSetup ? 'Create Account & Continue' : 'Sign In to Dashboard'}
              </button>
            </form>

            {isSetup && (
              <div className="mt-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-center text-sm text-blue-800">
                  <span className="font-semibold">Initial Setup:</span> Create your admin account to access the dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <a 
              href="/" 
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to website</span>
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>© 2026 Streamrock Realty. All rights reserved.</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
