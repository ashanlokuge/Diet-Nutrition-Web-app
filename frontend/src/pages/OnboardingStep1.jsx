import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    height: 170,
    weight: 65
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAgeChange = (e) => {
    setFormData(prev => ({ ...prev, age: e.target.value }));
  };

  const handleHeightChange = (e) => {
    setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }));
  };

  const handleWeightChange = (e) => {
    setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('Please enter a valid age');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`${API_URL}/user/profile`, {
        age: parseInt(formData.age),
        height: formData.height,
        weight: formData.weight
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // After saving, redirect to step 2
      navigate('/onboarding/step2');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left Side - Desktop Only */}
      <div className="hidden lg:flex w-1/2 relative bg-card-dark overflow-hidden h-screen sticky top-0">
        <div className="absolute inset-0">
          <img 
            alt="Healthy Lifestyle Motivation" 
            className="w-full h-full object-cover opacity-90 scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzpBX9dx1QOKST7s_4swBrrazhEE2hGiKOndhOt3A6pzDFs1ctW3TPeeesLpLa5AZHpcht7-dSBSYfp5wLTYIJscuLSB7LFV2AS9E_fuBo36XgKVooLai5x2nnkqRWH8TSdJg5xvZGON1WRIQyufnI6Qjm1XzgOjoWUPXj9y4lTpawKtQvosAA1hYZo09Cv5z5fqHxQ9YC6OoAOPYDboM_u9o1MdnCfLLMhnTfqWXOJe4kpNdCIvKh8JEcbCnhlqbIB9IGRLEHGoTJ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 flex items-center justify-center text-primary bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-2xl">nutrition</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NutriTrack</span>
          </div>
          <div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Your journey to a healthier you starts here.
            </h2>
            <p className="text-white/80 text-lg max-w-md leading-relaxed mb-8">
              Personalize your nutrition plan, track your progress, and build habits that last a lifetime.
            </p>
            <div className="flex items-center gap-4 pt-8 border-t border-white/10">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden">
                  <img 
                    alt="User" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFWkznehDJ1Ou3JdO0zGezKQW44ErAzKUmtowaPLp1ot_-U6STNfAkln30UVyzOx2FdKK56vxaQbpWybx8cr7zcplwKfVuaOCGwwAEE0Ua-nocTuRhLXRsJKw88p9U6dsUyYXPqehapZk4VNgd4M1P4lrzcf_s-uyFedkyrFkzIhuAzYUYihw0e1TFUqGBbxvik9g-QKcnAVmZ_jWJSfD6MHZrHXLz8g5Ts57v7nia7sreWi9IftV0Yg_DjegCfNffMg22ci_uNz3h"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden">
                  <img 
                    alt="User" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFWkznehDJ1Ou3JdO0zGezKQW44ErAzKUmtowaPLp1ot_-U6STNfAkln30UVyzOx2FdKK56vxaQbpWybx8cr7zcplwKfVuaOCGwwAEE0Ua-nocTuRhLXRsJKw88p9U6dsUyYXPqehapZk4VNgd4M1P4lrzcf_s-uyFedkyrFkzIhuAzYUYihw0e1TFUqGBbxvik9g-QKcnAVmZ_jWJSfD6MHZrHXLz8g5Ts57v7nia7sreWi9IftV0Yg_DjegCfNffMg22ci_uNz3h"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-black bg-primary flex items-center justify-center text-xs font-bold text-background-dark">
                  +2k
                </div>
              </div>
              <div className="text-white/90 text-sm">
                <span className="font-bold text-white">Join our community</span><br/>
                of wellness enthusiasts.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto relative bg-background-light">
        {/* Mobile Header */}
        <div className="lg:hidden px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-border-light">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">nutrition</span>
            <h2 className="text-lg font-bold text-text-main">NutriTrack</h2>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 lg:px-20 pt-8 lg:pt-12 pb-4 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1 of 4</span>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4 rounded-full"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 lg:px-20 py-4 max-w-2xl mx-auto w-full flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-3">Let's get to know you</h1>
            <p className="text-text-muted text-lg">We need your personal details to calculate your personalized nutrition plan accurately.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Age Input */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-text-main uppercase tracking-wider pl-1">Age</label>
              <div className="relative group">
                <input 
                  className="w-full bg-white border-2 border-border-light rounded-2xl px-6 py-5 text-2xl font-bold text-text-main placeholder-text-muted/30 focus:border-primary focus:ring-0 outline-none transition-all group-hover:border-primary/30 shadow-sm" 
                  placeholder="e.g. 28" 
                  type="number"
                  min="1"
                  max="150"
                  value={formData.age}
                  onChange={handleAgeChange}
                  required
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted font-medium pointer-events-none">years</span>
              </div>
            </div>

            {/* Height and Weight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-text-main uppercase tracking-wider pl-1">Height</label>
                <div className="bg-white border-2 border-border-light rounded-2xl p-6 hover:border-primary/30 transition-all shadow-sm group focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <div className="flex items-end justify-between mb-6">
                    <div className="relative">
                      <input 
                        className="w-24 bg-transparent border-none p-0 text-4xl font-bold text-text-main focus:ring-0" 
                        type="number"
                        min="120"
                        max="220"
                        value={formData.height}
                        onChange={handleHeightChange}
                      />
                    </div>
                    <span className="text-xs font-bold text-text-muted uppercase bg-background-light px-2 py-1 rounded tracking-wide border border-border-light">cm</span>
                  </div>
                  <input 
                    className="w-full h-2 bg-background-light rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-dark transition-all" 
                    max="220" 
                    min="120" 
                    type="range" 
                    value={formData.height}
                    onChange={handleHeightChange}
                  />
                  <div className="flex justify-between text-[10px] text-text-muted font-bold mt-2 uppercase">
                    <span>120cm</span>
                    <span>220cm</span>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-text-main uppercase tracking-wider pl-1">Weight</label>
                <div className="bg-white border-2 border-border-light rounded-2xl p-6 hover:border-primary/30 transition-all shadow-sm group focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <div className="flex items-end justify-between mb-6">
                    <div className="relative">
                      <input 
                        className="w-24 bg-transparent border-none p-0 text-4xl font-bold text-text-main focus:ring-0" 
                        type="number"
                        min="40"
                        max="150"
                        value={formData.weight}
                        onChange={handleWeightChange}
                      />
                    </div>
                    <span className="text-xs font-bold text-text-muted uppercase bg-background-light px-2 py-1 rounded tracking-wide border border-border-light">kg</span>
                  </div>
                  <input 
                    className="w-full h-2 bg-background-light rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-dark transition-all" 
                    max="150" 
                    min="40" 
                    type="range" 
                    value={formData.weight}
                    onChange={handleWeightChange}
                  />
                  <div className="flex justify-between text-[10px] text-text-muted font-bold mt-2 uppercase">
                    <span>40kg</span>
                    <span>150kg</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 lg:px-20 pb-10 mt-auto bg-background-light">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full group bg-primary hover:bg-primary-dark text-white text-lg font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Next Step'}
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleSkip}
              type="button"
              className="text-text-muted font-medium text-sm hover:text-text-main transition-colors"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
