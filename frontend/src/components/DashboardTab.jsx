import { useState, useEffect } from 'react';
import axios from 'axios';
import EditProfileModal from './EditProfileModal';
import EditWeightGoalModal from './EditWeightGoalModal';
import EditPreferencesModal from './EditPreferencesModal';
import EditMealModal from './EditMealModal';
import LogMealModal from './LogMealModal';
import LogWaterModal from './LogWaterModal';
import LogWorkoutModal from './LogWorkoutModal';
import API_URL from '../config/api';

export default function DashboardTab({ user, handleProfileUpdate, handleLogout }) {
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [todayWaterTotal, setTodayWaterTotal] = useState(0);
  const [todayWaterCount, setTodayWaterCount] = useState(0);
  const [todayWorkoutStats, setTodayWorkoutStats] = useState({ count: 0, totalDuration: 0, totalCalories: 0 });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWeightGoalModal, setShowWeightGoalModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [showLogWaterModal, setShowLogWaterModal] = useState(false);
  const [showLogWorkoutModal, setShowLogWorkoutModal] = useState(false);

  useEffect(() => {
    fetchMeals();
    fetchWaterLogs();
    fetchWorkouts();
  }, []);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get today's date in YYYY-MM-DD format (local timezone)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('Dashboard fetching meals for date:', dateStr);
      const response = await axios.get(`${API_URL}/meals?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchWaterLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/water`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodayWaterTotal(response.data.todayTotal || 0);
      setTodayWaterCount(response.data.todayCount || 0);
    } catch (error) {
      console.error('Error fetching water logs:', error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(response.data.workouts || []);
      setTodayWorkoutStats(response.data.todayStats || { count: 0, totalDuration: 0, totalCalories: 0 });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const handleMealUpdate = () => {
    fetchMeals();
    setShowMealModal(false);
  };

  // Calculate today's nutrition totals (all meals are already filtered by today's date from backend)
  const todaysTotals = meals.reduce((totals, meal) => {
    totals.calories += meal.calories || 0;
    totals.protein += meal.protein || 0;
    totals.carbs += meal.carbs || 0;
    totals.fat += meal.fat || 0;
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const dailyCalorieGoal = user.calorieGoal || 2000;
  const currentCalories = todaysTotals.calories;
  const caloriesLeft = dailyCalorieGoal - currentCalories;
  const caloriesPercent = Math.min((currentCalories / dailyCalorieGoal) * 100, 100);

  // Nutritional targets
  const proteinTarget = 140;
  const carbsTarget = 220;
  const fatTarget = 65;

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full pb-16">
        {/* Hero Banner */}
        <section className="w-full relative h-64 md:h-80 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              alt="Healthy Lifestyle Banner" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzpBX9dx1QOKST7s_4swBrrazhEE2hGiKOndhOt3A6pzDFs1ctW3TPeeesLpLa5AZHpcht7-dSBSYfp5wLTYIJscuLSB7LFV2AS9E_fuBo36XgKVooLai5x2nnkqRWH8TSdJg5xvZGON1WRIQyufnI6Qjm1XzgOjoWUPXj9y4lTpawKtQvosAA1hYZo09Cv5z5fqHxQ9YC6OoAOPYDboM_u9o1MdnCfLLMhnTfqWXOJe4kpNdCIvKh8JEcbCnhlqbIB9IGRLEHGoTJ"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background-light"></div>
          </div>
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col justify-center pb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm">Welcome back, {user.fullName.split(' ')[0]}!</h1>
            <p className="text-white/90 text-lg font-medium max-w-xl shadow-sm">You're on a 12-day streak. Keep up the amazing work!</p>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="w-full max-w-7xl px-4 md:px-10 -mt-16 md:-mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Profile Card */}
              <div className="bg-card-light rounded-2xl shadow-xl shadow-gray-200/50 border border-border-light p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="size-28 rounded-full p-1 bg-white shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img 
                        alt={user.fullName} 
                        className="w-full h-full object-cover" 
                        src={user.profileImage}
                      />
                    </div>
                  </div>
                  <button className="absolute bottom-1 right-1 size-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-text-main">{user.fullName}</h2>
                <p className="text-text-muted text-sm mb-6">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                
                <div className="w-full grid grid-cols-3 gap-2 border-t border-border-light pt-6 mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Age</span>
                    <span className="text-lg font-bold text-text-main">{user.age || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col border-x border-border-light">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Height</span>
                    <span className="text-lg font-bold text-text-main">{user.height ? `${user.height}cm` : 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Weight</span>
                    <span className="text-lg font-bold text-text-main">{user.weight ? `${user.weight}kg` : 'N/A'}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="w-full py-2.5 rounded-xl border border-border-light text-text-main font-bold hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  Edit Profile
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-card-light rounded-2xl shadow-sm border border-border-light p-6">
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">bolt</span> Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowLogMealModal(true)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-light hover:bg-primary/10 transition-colors text-left group"
                  >
                    <div className="size-8 rounded-lg bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">add</span>
                    </div>
                    <span className="font-medium text-text-main">Log Meal</span>
                  </button>
                  <button 
                    onClick={() => setShowLogWaterModal(true)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-light hover:bg-blue-500/10 transition-colors text-left group"
                  >
                    <div className="size-8 rounded-lg bg-white flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">water_drop</span>
                    </div>
                    <span className="font-medium text-text-main">Log Water</span>
                  </button>
                  <button 
                    onClick={() => setShowLogWorkoutModal(true)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-light hover:bg-orange-500/10 transition-colors text-left group"
                  >
                    <div className="size-8 rounded-lg bg-white flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">fitness_center</span>
                    </div>
                    <span className="font-medium text-text-main">Log Workout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Today's Summary */}
              <div className="bg-card-light rounded-2xl shadow-sm border border-border-light p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main">Today's Summary</h2>
                    <p className="text-text-muted text-sm">Target: {dailyCalorieGoal.toLocaleString()} kcal</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                    On Track
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-text-main">Calories</span>
                    <span className="text-primary">{currentCalories.toLocaleString()} / {dailyCalorieGoal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${caloriesPercent}%` }}></div>
                  </div>
                  <p className="text-right text-xs text-text-muted mt-1">{caloriesLeft} kcal left</p>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-text-muted">
                      <span>Protein</span>
                      <span>{todaysTotals.protein}/{proteinTarget}g</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((todaysTotals.protein / proteinTarget) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-text-muted">
                      <span>Carbs</span>
                      <span>{todaysTotals.carbs}/{carbsTarget}g</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((todaysTotals.carbs / carbsTarget) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-text-muted">
                      <span>Fat</span>
                      <span>{todaysTotals.fat}/{fatTarget}g</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((todaysTotals.fat / fatTarget) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Water & Workout Summary */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border-light">
                  {/* Water */}
                  <div className="bg-white rounded-xl p-4 border border-border-light">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-blue-500 text-xl">water_drop</span>
                      <span className="font-bold text-text-main text-sm">Water Intake</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{todayWaterTotal}</div>
                        <div className="text-xs text-text-muted">ml / 2000 ml</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-blue-600">{Math.round((todayWaterTotal / 2000) * 100)}%</div>
                        <div className="text-xs text-text-muted">{todayWaterCount} logs</div>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden mt-3">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((todayWaterTotal / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Workouts */}
                  <div className="bg-white rounded-xl p-4 border border-border-light">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-orange-500 text-xl">fitness_center</span>
                      <span className="font-bold text-text-main text-sm">Workouts</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{todayWorkoutStats.totalDuration}</div>
                        <div className="text-xs text-text-muted">min • {todayWorkoutStats.totalCalories} kcal</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-orange-600">{todayWorkoutStats.count} sessions</div>
                        <div className="text-xs text-text-muted">today</div>
                      </div>
                    </div>
                    {todayWorkoutStats.count > 0 && workouts.length > 0 && (
                      <div className="flex gap-1 mt-3">
                        {workouts.slice(0, 3).map((workout, index) => (
                          <div key={index} className="flex-1 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card-light rounded-2xl shadow-sm border border-border-light overflow-hidden">
                <div className="p-6 border-b border-border-light flex items-center justify-between">
                  <h3 className="font-bold text-lg text-text-main">Recent Meals</h3>
                  <a className="text-sm font-bold text-primary hover:text-primary-dark transition-colors" href="#">View All</a>
                </div>
                <div className="divide-y divide-border-light">
                  {meals.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">
                      <span className="material-symbols-outlined text-4xl mb-2 block">restaurant</span>
                      <p>No meals logged today. Start tracking your nutrition!</p>
                    </div>
                  ) : (
                    meals.map((meal) => (
                      <div key={meal._id} className="p-4 hover:bg-background-light transition-colors flex items-center gap-4 group">
                        <div className="size-16 rounded-xl overflow-hidden relative shadow-sm bg-gray-100 flex items-center justify-center">
                          {meal.imageUrl ? (
                            <img 
                              alt={meal.foodName} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              src={meal.imageUrl}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-3xl text-gray-400">restaurant</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-text-main">{meal.foodName}</h4>
                            <span className="font-bold text-text-main">{meal.calories} kcal</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="px-2 py-0.5 rounded bg-gray-100">{meal.mealType}</span>
                            <span>•</span>
                            <span>{new Date(meal.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleEditMeal(meal)}
                          className="p-2 text-text-muted hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Weight Goal */}
              <div className="bg-card-light rounded-2xl shadow-sm border border-border-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text-main">Weight Goal</h3>
                  <button 
                    onClick={() => setShowWeightGoalModal(true)}
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="relative h-32 w-full flex items-end justify-between gap-1 mb-2">
                  <div className="w-1/6 bg-primary/20 hover:bg-primary/30 transition-colors rounded-t-sm h-[60%] relative group"></div>
                  <div className="w-1/6 bg-primary/30 hover:bg-primary/40 transition-colors rounded-t-sm h-[55%] relative group"></div>
                  <div className="w-1/6 bg-primary/40 hover:bg-primary/50 transition-colors rounded-t-sm h-[50%] relative group"></div>
                  <div className="w-1/6 bg-primary/50 hover:bg-primary/60 transition-colors rounded-t-sm h-[48%] relative group"></div>
                  <div className="w-1/6 bg-primary/80 hover:bg-primary transition-colors rounded-t-sm h-[45%] relative group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 bg-white border-2 border-primary rounded-full shadow-sm"></div>
                  </div>
                  <div className="w-1/6 border-t-2 border-dashed border-gray-300 h-[30%] relative">
                    <span className="absolute -right-2 -top-6 text-[10px] font-bold text-text-muted">Goal {user.goalWeight || 58}kg</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-2">
                  <span>Start</span>
                  <span>Current: {user.weight || 'N/A'}kg</span>
                  <span>Goal</span>
                </div>
                {user.weight && user.goalWeight && (
                  <p className="text-sm text-center mt-4 text-text-main font-medium">
                    {user.weight > user.goalWeight ? (
                      <>You've lost <span className="text-primary font-bold">{(user.weight - user.goalWeight).toFixed(1)}kg</span> to go!</>
                    ) : (
                      <>You've reached your goal weight!</>
                    )}
                  </p>
                )}
              </div>

              {/* Preferences */}
              <div className="bg-card-light rounded-2xl shadow-sm border border-border-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text-main">Preferences</h3>
                  <button 
                    onClick={() => setShowPreferencesModal(true)}
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Diet Type</p>
                    <div className="flex flex-wrap gap-2">
                      {user.dietType && user.dietType.length > 0 ? (
                        user.dietType.map((diet, index) => (
                          <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">{diet}</span>
                        ))
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">Balanced</span>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">High Protein</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {user.allergies && user.allergies.length > 0 ? (
                        user.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">{allergy}</span>
                        ))
                      ) : (
                        <span className="text-sm text-text-muted">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dinner Recommendation */}
              <div className="relative rounded-2xl overflow-hidden group shadow-lg">
                <img 
                  alt="Dinner Idea" 
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtFR4KWfwfAPaIgNDha8Rgbm4R9YIaGZ5mYB1FLWDu2-06drJyVq94YAgXGAL39JvpUvnB9p8egp9ONJb3zBJSuS0dWLHQfhnDi4cv_fufATfy8u1IVTqJo7hBFhYztAeinq7HaHONgXo9d2Mh9-GwUwae8LBctAXPBnZf3UHyqBNksYyVdbvXApb5ZRtAkkOwJg_T2G-0obQyx4WD8WoDDLFb76WvhTc_Gg6JkXFVN-4rG9FqlkFwavLPkpmQxdo7o6Oyqi0Bo7sv"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-primary font-bold uppercase mb-1">Dinner Recommendation</p>
                  <h4 className="text-white font-bold text-lg leading-tight">Salmon & Avocado Superbowl</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span> 25m
                    </span>
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">local_fire_department</span> 480 kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modals */}
      <EditProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
      
      <EditWeightGoalModal 
        isOpen={showWeightGoalModal}
        onClose={() => setShowWeightGoalModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
      
      <EditPreferencesModal 
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
      
      <EditMealModal 
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        meal={selectedMeal}
        onUpdate={handleMealUpdate}
      />

      {/* Quick Action Modals */}
      <LogMealModal 
        isOpen={showLogMealModal}
        onClose={() => setShowLogMealModal(false)}
        onSuccess={fetchMeals}
      />

      <LogWaterModal 
        isOpen={showLogWaterModal}
        onClose={() => setShowLogWaterModal(false)}
        onSuccess={fetchWaterLogs}
      />

      <LogWorkoutModal 
        isOpen={showLogWorkoutModal}
        onClose={() => setShowLogWorkoutModal(false)}
        onSuccess={fetchWorkouts}
      />
    </>
  );
}
