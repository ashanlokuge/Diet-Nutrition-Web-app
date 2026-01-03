import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function EditMealModal({ isOpen, onClose, meal, onUpdate }) {
  const [formData, setFormData] = useState({
    mealType: meal?.mealType || 'Breakfast',
    foodName: meal?.foodName || '',
    servingSize: meal?.servingSize || '',
    calories: meal?.calories || '',
    protein: meal?.protein || '',
    carbs: meal?.carbs || '',
    fat: meal?.fat || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  useEffect(() => {
    if (meal) {
      setFormData({
        mealType: meal.mealType || 'Breakfast',
        foodName: meal.foodName || '',
        servingSize: meal.servingSize || '',
        calories: meal.calories || '',
        protein: meal.protein || '',
        carbs: meal.carbs || '',
        fat: meal.fat || ''
      });
    }
  }, [meal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/meals/${meal._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onUpdate(response.data.meal);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/meals/${meal._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onUpdate(null, true); // Pass true to indicate deletion
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete meal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-enter max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-main">Edit Meal</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Meal Type</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mealTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Food Name</label>
            <input
              type="text"
              value={formData.foodName}
              onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
              className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter food name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Serving Size</label>
            <input
              type="text"
              value={formData.servingSize}
              onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
              className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 1 cup, 100g"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Protein (g)</label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Carbs (g)</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Fat (g)</label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-3 rounded-xl border border-red-300 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border-light text-text-main font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
