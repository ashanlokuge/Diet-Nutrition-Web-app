import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function EditWeightGoalModal({ isOpen, onClose, user, onUpdate }) {
  const [goalWeight, setGoalWeight] = useState(user?.goalWeight || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/user/profile`, 
        { goalWeight: Number(goalWeight) }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onUpdate(response.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update weight goal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-enter">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-main">Edit Weight Goal</h2>
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
            <label className="block text-sm font-bold text-text-main mb-2">Goal Weight (kg)</label>
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your goal weight"
              min="20"
              max="300"
              step="0.1"
              required
            />
            <p className="text-xs text-text-muted mt-2">Current weight: {user?.weight || 'Not set'} kg</p>
          </div>

          <div className="flex gap-3 pt-4">
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
              {loading ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
