import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function LogWorkoutModal({ isOpen, onClose, onSuccess }) {
  const [workoutType, setWorkoutType] = useState('Cardio');
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(200);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const workoutTypes = [
    { value: 'Cardio', icon: 'directions_run', color: 'orange' },
    { value: 'Strength', icon: 'fitness_center', color: 'red' },
    { value: 'Yoga', icon: 'self_improvement', color: 'purple' },
    { value: 'Sports', icon: 'sports_basketball', color: 'blue' }
  ];

  const handleLog = async () => {
    if (!workoutType || !duration || !caloriesBurned) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/workouts`, {
        workoutType,
        duration,
        caloriesBurned,
        notes,
        date: new Date()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Reset form
      setWorkoutType('Cardio');
      setDuration(30);
      setCaloriesBurned(200);
      setNotes('');
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error logging workout:', err);
      setError(err.response?.data?.message || 'Failed to log workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">fitness_center</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Log Workout</h2>
                <p className="text-orange-100 text-sm">Track your exercise</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="size-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Workout Type Selection */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Workout Type</label>
            <div className="grid grid-cols-4 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setWorkoutType(type.value)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    workoutType === type.value
                      ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-600`
                      : 'border-border-light hover:border-orange-300 text-text-muted'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl mb-1">{type.icon}</span>
                  <span className="text-xs font-bold">{type.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">
              Duration: {duration} minutes
            </label>
            <div className="relative">
              <input 
                type="range"
                min="5"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>5 min</span>
                <span>90 min</span>
                <span>180 min</span>
              </div>
            </div>
          </div>

          {/* Calories Burned */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Calories Burned (estimate)</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="Enter calories..."
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-background-light border-2 border-transparent focus:border-orange-500 focus:ring-0 rounded-xl text-text-main placeholder-text-muted"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">kcal</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Notes (optional)</label>
            <textarea 
              placeholder="Add any notes about your workout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 bg-background-light border-2 border-transparent focus:border-orange-500 focus:ring-0 rounded-xl text-text-main placeholder-text-muted resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-text-muted font-bold uppercase mb-1">Type</div>
                <div className="text-lg font-bold text-orange-600">{workoutType}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted font-bold uppercase mb-1">Duration</div>
                <div className="text-lg font-bold text-orange-600">{duration} min</div>
              </div>
              <div>
                <div className="text-xs text-text-muted font-bold uppercase mb-1">Burned</div>
                <div className="text-lg font-bold text-orange-600">{caloriesBurned} kcal</div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
            <span className="material-symbols-outlined text-orange-500">info</span>
            <div className="text-sm text-orange-900">
              <p className="font-bold mb-1">Keep Moving!</p>
              <p className="text-orange-700">Regular exercise helps you reach your fitness goals faster and improves overall health.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border-light text-text-main font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleLog}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            {loading ? 'Logging...' : 'Log Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
