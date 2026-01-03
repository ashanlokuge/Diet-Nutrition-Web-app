import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primaryGoal: 'Lose Weight',
    dietType: ['Balanced']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goals = [
    {
      value: 'Lose Weight',
      icon: 'trending_down',
      color: 'text-primary',
      title: 'Lose Weight',
      description: 'Sustainable fat loss & energy'
    },
    {
      value: 'Gain Muscle',
      icon: 'fitness_center',
      color: 'text-orange-500',
      title: 'Gain Muscle',
      description: 'Build mass & strength'
    },
    {
      value: 'Maintain Weight',
      icon: 'balance',
      color: 'text-blue-500',
      title: 'Maintain Weight',
      description: 'Stay healthy & fit'
    }
  ];

  const dietPreferences = [
    'Balanced',
    'High Protein',
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Gluten Free'
  ];

  const handleGoalChange = (goal) => {
    setFormData(prev => ({ ...prev, primaryGoal: goal }));
  };

  const handleDietToggle = (diet) => {
    setFormData(prev => {
      const currentDiets = prev.dietType;
      if (currentDiets.includes(diet)) {
        return { ...prev, dietType: currentDiets.filter(d => d !== diet) };
      } else {
        return { ...prev, dietType: [...currentDiets, diet] };
      }
    });
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`${API_URL}/user/profile`, {
        primaryGoal: formData.primaryGoal,
        dietType: formData.dietType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Navigate to dashboard (or step 3 when ready)
      navigate('/onboarding/step3');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="relative flex w-full h-screen overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full md:w-[55%] lg:w-[45%] xl:w-[40%] flex flex-col bg-white relative z-20 h-full shadow-2xl">
        {/* Header */}
        <header className="flex-none px-6 py-5 md:px-10 flex items-center justify-between bg-white border-b border-border-light">
          <Link to="/" className="flex items-center gap-2 text-text-main cursor-pointer hover:opacity-80 transition-opacity">
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">nutrition</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">NutriTrack</h2>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-text-muted hover:text-text-main transition-colors"
          >
            Log Out
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 md:px-10">
          <div className="max-w-md mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-text-main">Goal Setting</span>
                <span className="text-xs font-bold text-text-muted">Step 2 of 4</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-1/2 shadow-[0_0_15px_rgba(19,236,128,0.6)]"></div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-text-main mb-3">What is your primary goal?</h1>
            <p className="text-text-muted mb-8">We'll personalize your recommendations based on what you want to achieve.</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Primary Goal Selection */}
              <div className="space-y-4">
                {goals.map((goal) => (
                  <label key={goal.value} className="relative block cursor-pointer group">
                    <input 
                      className="peer sr-only" 
                      name="goal" 
                      type="radio"
                      checked={formData.primaryGoal === goal.value}
                      onChange={() => handleGoalChange(goal.value)}
                    />
                    <div className="p-4 rounded-2xl border-2 border-border-light bg-background-light hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-300 flex items-center gap-4">
                      <div className={`size-14 rounded-xl bg-white flex items-center justify-center ${goal.color} shadow-sm peer-checked:bg-primary peer-checked:text-white transition-all duration-300`}>
                        <span className="material-symbols-outlined text-2xl">{goal.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-text-main text-lg">{goal.title}</h3>
                        <p className="text-sm text-text-muted">{goal.description}</p>
                      </div>
                      <div className="size-6 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-white text-sm opacity-0 peer-checked:opacity-100">check</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Dietary Preferences */}
              <div>
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                  Dietary Preferences
                </h3>
                <div className="flex flex-wrap gap-3">
                  {dietPreferences.map((diet) => (
                    <label key={diet} className="cursor-pointer group">
                      <input 
                        className="peer sr-only" 
                        type="checkbox"
                        checked={formData.dietType.includes(diet)}
                        onChange={() => handleDietToggle(diet)}
                      />
                      <div className="px-4 py-2.5 rounded-xl border border-border-light bg-white text-text-muted hover:border-primary/50 font-medium text-sm transition-all duration-200 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-lg peer-checked:shadow-primary/20">
                        {diet}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-none p-6 md:p-10 border-t border-border-light bg-white">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <button 
              onClick={handleBack}
              type="button"
              className="px-6 py-3.5 rounded-xl border border-border-light text-text-main font-bold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all transform hover:translate-y-[-1px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Right Side - Background Image (Desktop Only) */}
      <div className="hidden md:block absolute right-0 top-0 w-[45%] lg:w-[55%] xl:w-[60%] h-full">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          alt="Healthy Lifestyle Banner" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzpBX9dx1QOKST7s_4swBrrazhEE2hGiKOndhOt3A6pzDFs1ctW3TPeeesLpLa5AZHpcht7-dSBSYfp5wLTYIJscuLSB7LFV2AS9E_fuBo36XgKVooLai5x2nnkqRWH8TSdJg5xvZGON1WRIQyufnI6Qjm1XzgOjoWUPXj9y4lTpawKtQvosAA1hYZo09Cv5z5fqHxQ9YC6OoAOPYDboM_u9o1MdnCfLLMhnTfqWXOJe4kpNdCIvKh8JEcbCnhlqbIB9IGRLEHGoTJ"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent z-20 flex flex-col justify-end p-12 lg:p-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex -space-x-3">
                <img 
                  alt="User" 
                  className="size-10 rounded-full border-2 border-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQRMAcM3iM17S6B1iSTaEWYmprjfFB0NppRj9M3SHbuPBFKqWseTMlZ-qBgis7psP8ooK20_Eb6gKa9Jx0d2WPZPntrzQY4up36hRZTxqYsdfzRuzSpuCqGOPhv7NM7rRGPrDtlZdEd6C0B-kiSukzXG_SqN-lgUiOFOnK_DabLC9_9hMvBZZyyA9pmRpndtha7m54T7t_ibnRA1y4yOVF4VdPmyGojI60nOEHGOuI79zoHG7Ybcq_1NLU9tjsKpVA5Bi6Haw7jfe1"
                />
                <img 
                  alt="User" 
                  className="size-10 rounded-full border-2 border-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHvgMgRflTl6yIe_K9ZBlhsTmjPcmFhGHyeHdOAfaJwFgH8TIJkeMaDo6X8jBMwgy9ZuSE-RThX2ScMaVw2EK8gL55V6qvkitWoIAb2vHJJxPlva81ejp3X3cRkCB4h4xcCIxy9GbGCxyeBMSlSrsFAtd1em4JYwgzNGGka6aJMKs6Ng8aR1HQJdCEENB2Q9KN1MYS9KDU5q2QIeYdrhJL0D1qMic799w4k8enptkG7xEwEmpV9fYQHtzHGyvVfTWeH5ox5tm2-8Hn"
                />
                <img 
                  alt="User" 
                  className="size-10 rounded-full border-2 border-white object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFWkznehDJ1Ou3JdO0zGezKQW44ErAzKUmtowaPLp1ot_-U6STNfAkln30UVyzOx2FdKK56vxaQbpWybx8cr7zcplwKfVuaOCGwwAEE0Ua-nocTuRhLXRsJKw88p9U6dsUyYXPqehapZk4VNgd4M1P4lrzcf_s-uyFedkyrFkzIhuAzYUYihw0e1TFUqGBbxvik9g-QKcnAVmZ_jWJSfD6MHZrHXLz8g5Ts57v7nia7sreWi9IftV0Yg_DjegCfNffMg22ci_uNz3h"
                />
              </div>
              <span className="text-white/90 text-sm font-medium pl-2">Join 10k+ active members</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Your journey to a healthier you starts here.
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Personalized Plans
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Expert Tracking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
