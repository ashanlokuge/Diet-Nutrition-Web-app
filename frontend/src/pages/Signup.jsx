import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main antialiased h-screen w-full flex overflow-hidden">
      <div className="w-full lg:w-1/2 h-full flex flex-col relative z-10 bg-white dark:bg-background-dark overflow-y-auto">
        <header className="p-6 md:p-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text-main dark:text-white cursor-pointer group">
            <div className="size-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">nutrition</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">NutriTrack</h2>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">home</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/login" className="text-sm font-bold text-primary hover:text-[#0fd673]">
              Login
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-20 xl:px-24 py-8">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight mb-2">Create Account</h1>
              <p className="text-text-muted dark:text-gray-400 text-lg">Start your healthy journey today.</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-text-main dark:text-gray-200" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-text-main dark:text-gray-200" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-text-main dark:text-gray-200" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-text-main dark:text-gray-200" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2e24] text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock_reset</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-[#111814] text-base font-bold hover:bg-[#0fd673] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                  {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
              </div>

              <p className="text-center text-sm text-text-muted dark:text-gray-400 mt-6">
                Already have an account? 
                <Link to="/login" className="font-bold text-primary hover:text-[#0fd673] hover:underline transition-colors ml-1">
                  Log In
                </Link>
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3 text-xs text-text-muted dark:text-gray-500 justify-center">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">check_circle</span> No credit card
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">check_circle</span> 14-day free trial
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-6 text-center lg:text-left">
          <p className="text-xs text-text-muted dark:text-gray-600">© 2023 NutriTrack Inc. All rights reserved.</p>
        </footer>
      </div>

      <div className="hidden lg:block lg:w-1/2 h-full relative bg-gray-900 overflow-hidden group">
        <img
          alt="Fresh healthy ingredients"
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-linear"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL04Ynh1Td2awBzDifubQO3anrxk7Qogt4M80R7fzio7AtCusuNZuSenyNhfg5isRkUu2H5ZsWQ4WS9ZSEm5MlXalQJezaOvaOTt3ODBceZGD25M8Zim0o2Jq-pLhD5H8GgUetBQYQtlyS8Bgx8IqwxomKCtvIGchBredWmMyjprN6Ron_q8ndduwrorP_v3L7P4i4oNt2Toi7aWding2PwptKbAbNrF3KnA3GL6r1YF28mKYWKqm2LzHorvAvYy_-af1nx402GRY6"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-16 pb-20 z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-primary font-bold text-sm mb-6 animate-pulse">
              <span className="material-symbols-outlined text-lg">eco</span>
              <span>Eat Smart. Live Better.</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.2] mb-6">
              "The best investment you can make is in your own health."
            </h2>
            <div className="flex items-center gap-5 mt-4">
              <div className="flex -space-x-4">
                <img
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFWkznehDJ1Ou3JdO0zGezKQW44ErAzKUmtowaPLp1ot_-U6STNfAkln30UVyzOx2FdKK56vxaQbpWybx8cr7zcplwKfVuaOCGwwAEE0Ua-nocTuRhLXRsJKw88p9U6dsUyYXPqehapZk4VNgd4M1P4lrzcf_s-uyFedkyrFkzIhuAzYUYihw0e1TFUqGBbxvik9g-QKcnAVmZ_jWJSfD6MHZrHXLz8g5Ts57v7nia7sreWi9IftV0Yg_DjegCfNffMg22ci_uNz3h"
                />
                <img
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChjN2DcVfVq93a7JrOOJYVYtH3uS62AYagx-d54ad8bG7fXkpEOSnlVJnCmDYXg8GXlHnIX00O2yslXoWU0Im643v3a6IMkNgju46hEzH7isIuUhc7F635Aib0JOUcs_aePUH8lKtqQBFha3EahKv_hOOA_TdWHETJFa-G5OqJMNHzyJz-LkpExlR7bBcRCzwcFQc_0bngmqL6RdUaanLjySVr-8z6rN69LqHF273Bc9oMQrYwZFTJ6mD-SGdF8lnrhSLLo8zUikkU"
                />
                <img
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYF7Bmo-37ate4BxUsnowlODQXzgJo1oe4pDzypU3brA-UnFNEzwDGfX8lfniIos_tWm-srNnCXh0Go40tzFxE-2P-GuJH1J3F2q2f0c1Kae0DQ32n5EN44L0Cv-8XbCNsEeu7jK6eSwQaQ4T4JQJO8pyicNwsPdGA3ZOjw2Ghxv7Cmll-O-ngPAL7MMWur3TXL5EEvtZOK5xSDBtDGMmAN5_7QAtSNrRmvkyAvUTsS4LTSiGgWwLNjNVhQCs1Bckpw8cv6EcPrzmi"
                />
                <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-xs font-bold text-text-main">+2k</div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                </div>
                <span className="text-gray-300 text-sm font-medium">Trusted by 2,000+ members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
