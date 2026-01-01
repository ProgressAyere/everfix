'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn');
    if (loggedIn) setIsAlreadyLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsAlreadyLoggedIn(false);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboardC');
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('userLoggedIn', 'true');
      
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else if (isSignUp) {
        router.push(formData.role === 'customer' ? '/dashboardC' : '/dashboardE');
      } else {
        router.push('/dashboardC');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      {isAlreadyLoggedIn ? (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Already Signed In</h1>
            <p className="text-gray-600">Continue to your dashboard or sign out to switch accounts.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        
        {/* Illustration Side */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-white">
          <div className="mb-8">
            <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="4" opacity="0.3"/>
              <rect x="70" y="50" width="60" height="100" rx="8" fill="white" opacity="0.9"/>
              <rect x="75" y="55" width="50" height="30" rx="2" fill="#2563eb"/>
              <circle cx="100" cy="130" r="8" fill="#2563eb"/>
              <path d="M40 100 L60 100 L60 80" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M160 100 L140 100 L140 120" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center">Phone Fix</h2>
          <p className="text-blue-100 text-center">Fast, safe phone repairs at your doorstep</p>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Join thousands of satisfied customers' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              {isSignUp && formData.password && !errors.password && (
                <p className="text-green-600 text-sm mt-1">✓ Strong password</p>
              )}
            </div>

            {/* Role Selection (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      formData.role === 'customer'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Customer</div>
                    <div className="text-xs text-gray-500">Need repair</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'engineer' }))}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      formData.role === 'engineer'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold">Engineer</div>
                    <div className="text-xs text-gray-500">Provide service</div>
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password (Login Only) */}
            {!isSignUp && (
              <div className="text-right">
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Between Forms */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setFormData({ name: '', email: '', password: '', role: 'customer' });
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
