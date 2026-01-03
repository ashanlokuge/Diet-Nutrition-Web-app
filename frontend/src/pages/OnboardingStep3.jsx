import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFood, setSelectedFood] = useState({
    name: 'Avocado Toast with Egg',
    servingSize: '1 slice (approx. 120g)',
    calories: 320,
    protein: 12,
    carbs: 24,
    fat: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtFR4KWfwfAPaIgNDha8Rgbm4R9YIaGZ5mYB1FLWDu2-06drJyVq94YAgXGAL39JvpUvnB9p8egp9ONJb3zBJSuS0dWLHQfhnDi4cv_fufATfy8u1IVTqJo7hBFhYztAeinq7HaHONgXo9d2Mh9-GwUwae8LBctAXPBnZf3UHyqBNksYyVdbvXApb5ZRtAkkOwJg_T2G-0obQyx4WD8WoDDLFb76WvhTc_Gg6JkXFVN-4rG9FqlkFwavLPkpmQxdo7o6Oyqi0Bo7sv'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  useEffect(() => {
    const searchFoods = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/meals/search/${searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSearchResults(response.data.foods || []);
        setShowResults(true);
      } catch (err) {
        console.error('Error searching foods:', err);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchFoods, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const mealTypes = [
    { value: 'Breakfast', icon: 'bakery_dining' },
    { value: 'Lunch', icon: 'restaurant' },
    { value: 'Dinner', icon: 'dinner_dining' },
    { value: 'Snack', icon: 'nutrition' }
  ];

  const handleAddMeal = async () => {
    if (!selectedFood) {
      setError('Please select a food item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`${API_URL}/meals`, {
        mealType: selectedMealType,
        foodName: selectedFood.name,
        servingSize: selectedFood.servingSize,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat || 0,
        imageUrl: selectedFood.imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Navigate to dashboard after successful meal log
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding meal:', err);
      setError(err.response?.data?.message || 'Failed to add meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleRemoveFood = () => {
    setSelectedFood(null);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light">
        <div className="layout-container flex justify-center w-full">
          <div className="px-4 md:px-10 py-3 flex items-center justify-between w-full max-w-7xl">
            <div className="flex items-center gap-2 text-text-main cursor-pointer hover:opacity-80 transition-opacity">
              <div className="size-8 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">nutrition</span>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">NutriTrack</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-text-muted">
                <span>Step 3 of 4</span>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <button className="size-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <img 
                    alt="User Profile" 
                    className="w-full h-full object-cover" 
                    src={user?.profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFWkznehDJ1Ou3JdO0zGezKQW44ErAzKUmtowaPLp1ot_-U6STNfAkln30UVyzOx2FdKK56vxaQbpWybx8cr7zcplwKfVuaOCGwwAEE0Ua-nocTuRhLXRsJKw88p9U6dsUyYXPqehapZk4VNgd4M1P4lrzcf_s-uyFedkyrFkzIhuAzYUYihw0e1TFUqGBbxvik9g-QKcnAVmZ_jWJSfD6MHZrHXLz8g5Ts57v7nia7sreWi9IftV0Yg_DjegCfNffMg22ci_uNz3h'}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-140px)]">
          
          {/* Left Side - Form */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-enter">
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                First Entry
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-text-main mb-3">
                Let's log your first meal, {user?.fullName?.split(' ')[0] || 'there'}.
              </h1>
              <p className="text-text-muted text-lg">
                Tracking your food is the most effective way to understand your nutrition. Start simply by searching below.
              </p>
            </div>

            <div className="bg-card-light rounded-3xl shadow-xl shadow-gray-200/50 border border-border-light p-6 md:p-8 animate-enter animate-enter-delay-1">
              {/* Meal Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-text-main mb-3">Which meal is this?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {mealTypes.map((meal) => (
                    <button
                      key={meal.value}
                      onClick={() => setSelectedMealType(meal.value)}
                      className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                        selectedMealType === meal.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border-light hover:border-primary/50 hover:bg-background-light text-text-muted hover:text-text-main'
                      }`}
                    >
                      <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">
                        {meal.icon}
                      </span>
                      <span className="text-xs font-bold">{meal.value}</span>
                      {selectedMealType === meal.value && (
                        <div className="absolute top-2 right-2 size-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Input */}
              <div className="relative group mb-6 z-20">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">
                    search
                  </span>
                </div>
                <input 
                  className="block w-full pl-12 pr-4 py-4 bg-background-light border-transparent focus:border-primary focus:ring-0 rounded-xl text-text-main placeholder-text-muted font-medium transition-all shadow-inner" 
                  placeholder="Search for food (e.g. Avocado Toast, Banana...)" 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                
                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border-light max-h-80 overflow-y-auto z-50 animate-enter">
                    {searchResults.map((food, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedFood(food);
                          setSearchQuery('');
                          setShowResults(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-background-light transition-colors text-left border-b border-gray-100 last:border-b-0"
                      >
                        <div className="size-12 rounded-lg overflow-hidden shadow-sm shrink-0">
                          <img 
                            alt={food.name} 
                            className="w-full h-full object-cover" 
                            src={food.imageUrl}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-text-main">{food.name}</h4>
                          <p className="text-xs text-text-muted">{food.servingSize}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">{food.calories}</div>
                          <div className="text-xs text-text-muted">kcal</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Selected Food */}
              {selectedFood && (
                <div className="mb-8 p-4 bg-background-light rounded-2xl border border-primary/20 relative animate-enter animate-enter-delay-2">
                  <div className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Selected
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-24 rounded-xl overflow-hidden shadow-sm shrink-0">
                      <img 
                        alt={selectedFood.name} 
                        className="w-full h-full object-cover" 
                        src={selectedFood.imageUrl}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-text-main leading-tight">{selectedFood.name}</h3>
                          <p className="text-sm text-text-muted">{selectedFood.servingSize}</p>
                        </div>
                        <button 
                          onClick={handleRemoveFood}
                          className="text-text-muted hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                      <div className="flex gap-4 mt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Calories</span>
                          <span className="text-sm font-bold text-text-main">{selectedFood.calories}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Protein</span>
                          <span className="text-sm font-bold text-text-main">{selectedFood.protein}g</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Carbs</span>
                          <span className="text-sm font-bold text-text-main">{selectedFood.carbs}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Button */}
              <button 
                onClick={handleAddMeal}
                disabled={loading || !selectedFood}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 animate-enter animate-enter-delay-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="material-symbols-outlined">add_circle</span>
                {loading ? 'Adding...' : 'Add Meal to Diary'}
              </button>

              <div className="mt-4 text-center">
                <button 
                  onClick={handleSkip}
                  className="text-sm text-text-muted hover:text-primary transition-colors font-medium"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Motivational Content */}
          <div className="hidden lg:block lg:col-span-5 h-full animate-enter animate-enter-delay-2">
            <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                alt="Healthy Food Preparation" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzpBX9dx1QOKST7s_4swBrrazhEE2hGiKOndhOt3A6pzDFs1ctW3TPeeesLpLa5AZHpcht7-dSBSYfp5wLTYIJscuLSB7LFV2AS9E_fuBo36XgKVooLai5x2nnkqRWH8TSdJg5xvZGON1WRIQyufnI6Qjm1XzgOjoWUPXj9y4lTpawKtQvosAA1hYZo09Cv5z5fqHxQ9YC6OoAOPYDboM_u9o1MdnCfLLMhnTfqWXOJe4kpNdCIvKh8JEcbCnhlqbIB9IGRLEHGoTJ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent"></div>
              
              {/* Day 1 Started Badge */}
              <div 
                className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 shadow-lg" 
                style={{ animation: 'bounce 3s infinite' }}
              >
                <div className="size-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-inner">
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <div>
                  <p className="text-xs text-white/80 font-medium">Daily Streak</p>
                  <p className="text-white font-bold">Day 1 Started!</p>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-2">Did you know?</h3>
                  <p className="text-white/90 leading-relaxed">
                    Tracking your meals for just one week can double your weight loss success. You're building a powerful habit!
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img 
                        alt="User 1" 
                        className="size-8 rounded-full border-2 border-background-dark object-cover" 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
                      />
                      <img 
                        alt="User 2" 
                        className="size-8 rounded-full border-2 border-background-dark object-cover" 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                      />
                      <img 
                        alt="User 3" 
                        className="size-8 rounded-full border-2 border-background-dark object-cover" 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                      />
                    </div>
                    <span className="text-xs text-white/70 font-medium ml-2">Join 10k+ new starters today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
