import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import AddFoodModal from './AddFoodModal';
import EditFoodModal from './EditFoodModal';

const FoodDiaryTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [waterIntake, setWaterIntake] = useState({ todayTotal: 0, logs: [] });
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showEditFoodModal, setShowEditFoodModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // User goals (should come from user profile in real app)
  const goals = {
    calories: 2000,
    protein: 140,
    carbs: 220,
    fat: 65,
    water: 2000
  };

  useEffect(() => {
    fetchMealsForDate(currentDate);
    fetchDailySummary(currentDate);
    fetchWaterIntake(currentDate);
  }, [currentDate]);

  const fetchMealsForDate = async (date) => {
    try {
      const token = localStorage.getItem('token');
      // Get local date string in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('Fetching meals for date:', dateStr);
      const response = await axios.get(`${API_URL}/meals?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(response.data.meals || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
    }
  };

  const fetchDailySummary = async (date) => {
    try {
      const token = localStorage.getItem('token');
      // Get local date string in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('Fetching summary for date:', dateStr);
      const response = await axios.get(`${API_URL}/meals/daily-summary?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailySummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }// Get local date string in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
  };

  const fetchWaterIntake = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const dateStr = date.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/water?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWaterIntake({
        todayTotal: response.data.todayTotal || 0,
        logs: response.data.waterLogs || []
      });
    } catch (error) {
      console.error('Error fetching water intake:', error);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleAddFood = (mealType) => {
    setSelectedMealType(mealType);
    setShowAddFoodModal(true);
  };

  const handleEditFood = (meal) => {
    setSelectedMeal(meal);
    setShowEditFoodModal(true);
  };

  const handleDeleteFood = async (mealId) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMealsForDate(currentDate);
      fetchDailySummary(currentDate);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleFoodAdded = () => {
    // Refresh all data
    fetchMealsForDate(currentDate);
    fetchDailySummary(currentDate);
    fetchWaterIntake(currentDate);
  };

  const formatDate = (date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'Today, ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMealsByType = (type) => {
    return meals.filter(meal => meal.mealType === type);
  };

  const getMealTypeTotal = (type) => {
    const typeMeals = getMealsByType(type);
    return typeMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      'Breakfast': { icon: 'wb_twilight', colorClass: 'text-orange-500', bgClass: 'bg-orange-100' },
      'Lunch': { icon: 'wb_sunny', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-100' },
      'Dinner': { icon: 'nights_stay', colorClass: 'text-indigo-500', bgClass: 'bg-indigo-100' },
      'Snack': { icon: 'cookie', colorClass: 'text-pink-500', bgClass: 'bg-pink-100' }
    };
    return icons[type] || icons['Breakfast'];
  };

  const getMealTypeRecommendation = (type) => {
    const recommendations = {
      'Breakfast': '450-600 kcal',
      'Lunch': '600-800 kcal',
      'Dinner': '500-700 kcal',
      'Snack': '100-200 kcal'
    };
    return recommendations[type] || '';
  };

  const calculatePercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const renderMealSection = (mealType) => {
    const mealItems = getMealsByType(mealType);
    const totalCalories = getMealTypeTotal(mealType);
    const { icon, colorClass, bgClass } = getMealTypeIcon(mealType);
    const recommendation = getMealTypeRecommendation(mealType);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 transition-all hover:shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${bgClass} rounded-lg ${colorClass}`}>
              <span className="material-icons-round">{icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{mealType}</h3>
              <p className="text-xs text-gray-500 font-medium">Recommended: {recommendation}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block font-bold text-xl text-gray-900">
              {mealItems.length > 0 ? totalCalories : '--'}
            </span>
            {mealItems.length > 0 && (
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">kcal</span>
            )}
          </div>
        </div>

        {mealItems.length > 0 ? (
          <>
            <div className="space-y-4">
              {mealItems.map((meal) => (
                <div
                  key={meal._id}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={meal.imageUrl || 'https://via.placeholder.com/48'}
                      alt={meal.foodName}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{meal.foodName}</h4>
                      <p className="text-sm text-gray-500">
                        {meal.servingSize} • {meal.calories} kcal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditFood(meal)}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="material-icons-round text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFood(meal._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-icons-round text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddFood(mealType)}
              className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <span className="material-icons-round text-lg">add_circle_outline</span>
              Add Food
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span className="material-icons-round text-gray-400">restaurant</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">No food logged yet</p>
            <button
              onClick={() => handleAddFood(mealType)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-[#0ea574] transition-colors"
            >
              Add {mealType}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8f7] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const caloriesConsumed = dailySummary?.totalCalories || 0;
  const proteinConsumed = dailySummary?.totalProtein || 0;
  const carbsConsumed = dailySummary?.totalCarbs || 0;
  const fatConsumed = dailySummary?.totalFat || 0;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with Date Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 bg-white px-2 py-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <span className="material-icons-round">chevron_left</span>
            </button>
            <div className="flex items-center gap-2 text-center px-4">
              <span className="material-icons-round text-primary text-xl">calendar_today</span>
              <span className="font-bold text-lg text-gray-900">{formatDate(currentDate)}</span>
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <span className="material-icons-round">chevron_right</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-xl font-medium shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
              <span className="material-icons-round text-gray-400">content_copy</span>
              Copy Yesterday
            </button>
            <button
              onClick={() => handleAddFood('')}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-glow hover:bg-[#0ea574] transition-all transform hover:-translate-y-0.5"
            >
              <span className="material-icons-round">add</span>
              Quick Add
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meals Section */}
          <div className="lg:col-span-2 space-y-6">
            {renderMealSection('Breakfast')}
            {renderMealSection('Lunch')}
            {renderMealSection('Dinner')}
            {renderMealSection('Snack')}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daily Summary</h2>
                <span className={`${caloriesConsumed <= goals.calories ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-bold px-3 py-1 rounded-full`}>
                  {caloriesConsumed <= goals.calories ? 'ON TRACK' : 'OVER GOAL'}
                </span>
              </div>

              {/* Calories */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Calories</span>
                    <div className="text-3xl font-bold text-gray-900 mt-1">
                      {caloriesConsumed.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-500">Goal: {goals.calories.toLocaleString()}</span>
                    <div className="text-xs text-primary font-medium mt-1">
                      {Math.max(0, goals.calories - caloriesConsumed)} left
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(caloriesConsumed, goals.calories)}%` }}
                  ></div>
                </div>
              </div>

              {/* Macros */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">Protein</span>
                    <span className="text-gray-500">{proteinConsumed}g / {goals.protein}g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${calculatePercentage(proteinConsumed, goals.protein)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">Carbs</span>
                    <span className="text-gray-500">{carbsConsumed}g / {goals.carbs}g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${calculatePercentage(carbsConsumed, goals.carbs)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">Fat</span>
                    <span className="text-gray-500">{fatConsumed}g / {goals.fat}g</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${calculatePercentage(fatConsumed, goals.fat)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-icons-round text-blue-500 text-lg">water_drop</span>
                    <span className="font-medium text-gray-700">Water</span>
                  </div>
                  <button className="text-blue-500 hover:bg-blue-50 p-1 rounded-lg transition-colors">
                    <span className="material-icons-round text-xl">add</span>
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{waterIntake.todayTotal}</span>
                    <span className="text-xs text-gray-500 ml-1">ml</span>
                  </div>
                  <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                    {Math.round((waterIntake.todayTotal / goals.water) * 100)}% of Goal
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${calculatePercentage(waterIntake.todayTotal, goals.water)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Recent Meals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Meals</h3>
                <a className="text-sm text-primary font-medium hover:underline" href="#">See all</a>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Os1hfF2sbDjRMVnGkkK1V9z3fCNRBmfMQscAKd5ZDWmjPIGU8RXuUqBhfcPzNj2xY_P0YEZL8I8A_uJbkhUnlfXRW7PXjOAMUKXNqXWFC7LtkWuCj4lM2zewzmLlIOalPhsP1OGeI5ZcWNtdY7YJYbWQpLifoGTRqW8_99e_lICc2pcioeCr7eYAhnp8d14VcBwPqJZKJ95GEdttz-xY5bL03JbzAEqFUaH7SMeMVavUCdIzj2yWpGTvfVe06B91I5Fe3IFXXN5i"
                    alt="Salad"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Quinoa Salad Bowl</p>
                    <p className="text-xs text-gray-500">420 kcal</p>
                  </div>
                  <span className="material-icons-round text-gray-300 text-sm">add_circle</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhBQtPkOwEXonJkANxIeLlhONWErJScbbrq-EpseEyoQKRsyCtANEcbbgE55SiNflx3vVQYYZfOPyfBByFl-936KBuDztXK8ToLUDAS7C5YCu27gyaqUso11GJJgyxSuK4F6l-P_li2pvCErZsRuoB08aIsS4x8YF7BUT_99-8cu7LuF3YxvegfiEPlZx8oVmHESNVXOaldBWCjdohLeF-j3ZHBWtvRZiBvRyuyFgLKicC1pzRk9dsLz2fPcbRehMYK5GW0UU3kbUY"
                    alt="Pizza"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Veggie Pizza Slice</p>
                    <p className="text-xs text-gray-500">280 kcal</p>
                  </div>
                  <span className="material-icons-round text-gray-300 text-sm">add_circle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddFoodModal && (
        <AddFoodModal
          isOpen={showAddFoodModal}
          onClose={() => setShowAddFoodModal(false)}
          onSuccess={handleFoodAdded}
          initialMealType={selectedMealType}
          selectedDate={currentDate}
        />
      )}

      {showEditFoodModal && selectedMeal && (
        <EditFoodModal
          isOpen={showEditFoodModal}
          onClose={() => {
            setShowEditFoodModal(false);
            setSelectedMeal(null);
          }}
          meal={selectedMeal}
          onSuccess={handleFoodAdded}
        />
      )}
    </>
  );
};

export default FoodDiaryTab;
