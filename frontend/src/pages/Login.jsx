import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-background-dark relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="size-10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-4xl">nutrition</span>
                </div>
                <span className="text-2xl font-bold text-text-main dark:text-white tracking-tight">NutriTrack</span>
              </Link>
              <Link to="/" className="text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">home</span>
                <span>Home</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-text-muted dark:text-gray-400 text-lg">Please enter your details to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-text-main dark:text-gray-300" htmlFor="email">Email Address</label>
              <div className="relative">
                <input
                  className="block w-full h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary focus:ring-2 focus:bg-white dark:focus:bg-[#15261e] transition-all duration-300 outline-none"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-text-main dark:text-gray-300" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="block w-full h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary focus:ring-2 focus:bg-white dark:focus:bg-[#15261e] transition-all duration-300 outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-gray-50 dark:bg-[#1a2e24] dark:border-gray-600 cursor-pointer"
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label className="ml-2 block text-sm font-medium text-text-muted dark:text-gray-400 cursor-pointer" htmlFor="rememberMe">Remember me</label>
              </div>
              <div className="text-sm">
                <a className="font-bold text-primary hover:text-[#0fd673] transition-colors" href="#">Forgot password?</a>
              </div>
            </div>

            <button
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-base font-bold text-[#111814] bg-primary hover:bg-[#0fd673] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in to Account'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-background-dark text-text-muted dark:text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e24] text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-[#233a30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-200"
              type="button"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          <p className="text-center text-text-muted dark:text-gray-400">
            Don't have an account? 
            <Link to="/signup" className="font-bold text-primary hover:text-[#0fd673] transition-colors underline decoration-transparent hover:decoration-current ml-1">
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-text-muted/50 dark:text-gray-600 pointer-events-none">
          © 2023 NutriTrack Inc. All rights reserved.
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100 dark:bg-[#0d1812] overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 animate-pulse mix-blend-overlay"></div>
        <img
          alt="Fresh ingredients and vegetables"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL04Ynh1Td2awBzDifubQO3anrxk7Qogt4M80R7fzio7AtCusuNZuSenyNhfg5isRkUu2H5ZsWQ4WS9ZSEm5MlXalQJezaOvaOTt3ODBceZGD25M8Zim0o2Jq-pLhD5H8GgUetBQYQtlyS8Bgx8IqwxomKCtvIGchBredWmMyjprN6Ron_q8ndduwrorP_v3L7P4i4oNt2Toi7aWding2PwptKbAbNrF3KnA3GL6r1YF28mKYWKqm2LzHorvAvYy_-af1nx402GRY6"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="max-w-xl">
            <div className="flex gap-1 mb-6 text-yellow-400">
              <span className="material-symbols-outlined text-2xl fill-1">star</span>
              <span className="material-symbols-outlined text-2xl fill-1">star</span>
              <span className="material-symbols-outlined text-2xl fill-1">star</span>
              <span className="material-symbols-outlined text-2xl fill-1">star</span>
              <span className="material-symbols-outlined text-2xl fill-1">star</span>
            </div>
            <blockquote className="text-3xl md:text-4xl font-bold leading-tight mb-8">
              "The best investment I've made for my health. The meal tracking is incredibly intuitive and the recipes are delicious."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xl text-primary shadow-xl">
                EM
              </div>
              <div>
                <p className="font-bold text-xl text-white">Emily Martinez</p>
                <p className="text-gray-300 text-sm font-medium tracking-wide uppercase">Certified Nutritionist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
