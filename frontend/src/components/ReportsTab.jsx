import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const ReportsTab = () => {
  const [timePeriod, setTimePeriod] = useState('30');
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [calorieTrend, setCalorieTrend] = useState([]);
  const [macroSplit, setMacroSplit] = useState(null);
  const [waterTrend, setWaterTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, [timePeriod]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log('Fetching reports data for period:', timePeriod);

      const [summaryRes, calorieRes, macroRes, waterRes] = await Promise.all([
        axios.get(`${API_URL}/reports/monthly-summary?days=${timePeriod}`, config),
        axios.get(`${API_URL}/reports/calorie-trend?days=${timePeriod}`, config),
        axios.get(`${API_URL}/reports/macro-split?days=${timePeriod}`, config),
        axios.get(`${API_URL}/reports/water-trend`, config)
      ]);

      console.log('Summary response:', summaryRes.data);
      console.log('Calorie trend response:', calorieRes.data);
      console.log('Macro split response:', macroRes.data);
      console.log('Water trend response:', waterRes.data);

      // Extract data from backend response structure
      setMonthlySummary(summaryRes.data.summary || {});
      setCalorieTrend(calorieRes.data.trendData || []);
      setMacroSplit(macroRes.data.macroSplit || {});
      setWaterTrend(waterRes.data.waterTrend || []);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getMaxCalories = () => {
    if (calorieTrend.length === 0) return 2500;
    return Math.max(...calorieTrend.map(d => d.calories), 2500);
  };

  const getMaxWater = () => {
    if (waterTrend.length === 0) return 2500;
    return Math.max(...waterTrend.map(d => d.amount), 2500);
  };

  const getSampledCalorieData = () => {
    if (calorieTrend.length === 0) return [];
    if (timePeriod === '7') {
      return calorieTrend.map((day, i) => ({
        ...day,
        label: i + 1
      }));
    }
    
    // For 30 days, sample at days 1, 5, 10, 15, 20, 25, 30
    const indices = [0, 4, 9, 14, 19, 24, 29];
    return indices
      .filter(i => i < calorieTrend.length)
      .map(i => ({
        ...calorieTrend[i],
        label: i + 1
      }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading reports...</div>
      </div>
    );
  }

  const sampledData = getSampledCalorieData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Monthly Summary</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {monthlySummary?.avgCalories > 0 
              ? "Great job! You're consistently hitting your macro targets this month." 
              : "Start tracking your meals to see your progress!"}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-1.5 rounded-xl shadow-sm inline-flex items-center self-start md:self-auto border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setTimePeriod('7')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              timePeriod === '7' 
                ? 'bg-primary/10 text-primary shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
            }`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimePeriod('30')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              timePeriod === '30' 
                ? 'bg-primary/10 text-primary shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
            }`}
          >
            Last 30 Days
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
            Custom Range
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons-round text-lg">calendar_today</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Daily Calories</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {monthlySummary?.avgCalories || 0} <span className="text-xs font-normal text-slate-400">kcal</span>
              </h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <span className="material-icons-round text-primary">local_fire_department</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <span className="material-icons-round text-base mr-1">trending_down</span>
              2.5%
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Weight Change</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {monthlySummary?.weightChange > 0 ? '+' : ''}{monthlySummary?.weightChange?.toFixed(1) || '0.0'} <span className="text-xs font-normal text-slate-400">kg</span>
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="material-icons-round text-blue-500">monitor_weight</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <span className="material-icons-round text-base mr-1">check_circle</span>
              On Track
            </span>
            <span className="text-slate-400 ml-2">to goal</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Workout Sessions</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {monthlySummary?.workoutSessions || 0} <span className="text-xs font-normal text-slate-400">sessions</span>
              </h3>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <span className="material-icons-round text-orange-500">fitness_center</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <span className="material-icons-round text-base mr-1">arrow_upward</span>
              4
            </span>
            <span className="text-slate-400 ml-2">more than avg</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Water Consistency</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {monthlySummary?.waterConsistency || 0}% <span className="text-xs font-normal text-slate-400">met</span>
              </h3>
            </div>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <span className="material-icons-round text-cyan-500">water_drop</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${monthlySummary?.waterConsistency || 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calorie Intake Trend */}
        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Calorie Intake Trend</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>Intake
              </span>
              <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mr-1"></span>Goal
              </span>
            </div>
          </div>
          <div className="relative h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 border-t border-dashed border-slate-200 dark:border-slate-600"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 border-t border-dashed border-slate-200 dark:border-slate-600"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 border-t border-dashed border-slate-200 dark:border-slate-600"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 border-t border-dashed border-slate-200 dark:border-slate-600"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative w-full h-full flex items-end justify-between">
              {sampledData.length > 0 ? sampledData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="w-full max-w-[24px] bg-slate-200 dark:bg-slate-700 rounded-t-sm relative h-[80%]">
                    <div 
                      className="absolute bottom-0 w-full bg-primary hover:bg-emerald-400 transition-all rounded-t-sm"
                      style={{ height: `${Math.min((day.calories / getMaxCalories()) * 100, 100)}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {day.calories} kcal
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{day.label}</span>
                </div>
              )) : (
                <div className="w-full text-center text-slate-500 py-8">No calorie data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Macro Split */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Macro Split</h2>
            <button className="text-slate-400 hover:text-primary">
              <span className="material-icons-round text-lg">more_horiz</span>
            </button>
          </div>
          {macroSplit && (macroSplit.protein > 0 || macroSplit.carbs > 0 || macroSplit.fat > 0) ? (
            <>
              <div className="flex-1 flex flex-col justify-center items-center">
                <div 
                  className="relative w-48 h-48 rounded-full" 
                  style={{ 
                    background: `conic-gradient(
                      #10b981 0% ${macroSplit.carbs}%, 
                      #f59e0b ${macroSplit.carbs}% ${macroSplit.carbs + macroSplit.protein}%, 
                      #3b82f6 ${macroSplit.carbs + macroSplit.protein}% 100%
                    )` 
                  }}
                >
                  <div className="absolute inset-0 m-auto w-32 h-32 bg-card-light dark:bg-card-dark rounded-full flex flex-col items-center justify-center">
                    <span className="text-slate-400 text-xs uppercase font-semibold">Total</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">100%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                    <span className="text-slate-600 dark:text-slate-300">Carbs</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{macroSplit.carbs}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                    <span className="text-slate-600 dark:text-slate-300">Protein</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{macroSplit.protein}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="text-slate-600 dark:text-slate-300">Fat</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{macroSplit.fat}%</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 py-8">No macro data available</div>
          )}
        </div>
      </div>

      {/* Bottom Row - Weight & Water */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weight Progress</h2>
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-md">
              {monthlySummary?.weightChange > 0 ? '+' : ''}{monthlySummary?.weightChange?.toFixed(1) || '0.0'}kg Total
            </span>
          </div>
          <div className="relative h-48 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="weightGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="0" y2="0"></line>
              <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="75" y2="75"></line>
              <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeWidth="1" x1="0" x2="400" y1="150" y2="150"></line>
              <path d="M0,40 Q50,45 100,55 T200,80 T300,100 T400,120 V150 H0 Z" fill="url(#weightGradient)"></path>
              <path d="M0,40 Q50,45 100,55 T200,80 T300,100 T400,120" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="3"></path>
              <circle cx="0" cy="40" fill="#ffffff" r="4" stroke="#10b981" strokeWidth="2"></circle>
              <circle cx="200" cy="80" fill="#ffffff" r="4" stroke="#10b981" strokeWidth="2"></circle>
              <circle cx="400" cy="120" fill="#ffffff" r="4" stroke="#10b981" strokeWidth="2"></circle>
            </svg>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>

        {/* Water Intake */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Water Intake</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Target: <span className="font-semibold text-slate-900 dark:text-white">2000ml</span>
            </div>
          </div>
          <div className="flex flex-col h-48 justify-between">
            <div className="flex justify-between items-end h-32 px-2">
              {waterTrend.length > 0 ? waterTrend.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg relative overflow-hidden h-24">
                    <div 
                      className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-500 group-hover:bg-cyan-400" 
                      style={{ height: `${Math.min((day.amount / getMaxWater()) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{day.day}</span>
                </div>
              )) : (
                <div className="w-full text-center text-slate-500 py-8">No water data available</div>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center gap-3 mt-4">
              <span className="material-icons-round text-blue-500">info</span>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                {waterTrend.length > 0 ? "You drank less water on weekends. Try setting a reminder!" : "Start tracking your water intake to see trends!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
