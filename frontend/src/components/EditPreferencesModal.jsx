import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function EditPreferencesModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    primaryGoal: user?.primaryGoal || 'Maintain Weight',
    dietType: user?.dietType || [],
    allergies: user?.allergies || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const dietOptions = ['Balanced', 'High Protein', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten Free'];
  const goalOptions = ['Lose Weight', 'Gain Muscle', 'Maintain Weight'];

  const handleDietToggle = (diet) => {
    if (formData.dietType.includes(diet)) {
      setFormData({
        ...formData,
        dietType: formData.dietType.filter(d => d !== diet)
      });
    } else {
      setFormData({
        ...formData,
        dietType: [...formData.dietType, diet]
      });
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onUpdate(response.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-enter max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-main">Edit Preferences</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Goal */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Primary Goal</label>
            <div className="space-y-2">
              {goalOptions.map((goal) => (
                <label key={goal} className="flex items-center gap-3 p-3 border border-border-light rounded-xl hover:bg-background-light cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="primaryGoal"
                    value={goal}
                    checked={formData.primaryGoal === goal}
                    onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-text-main">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Diet Type */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Diet Preferences</label>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => handleDietToggle(diet)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.dietType.includes(diet)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-main hover:bg-gray-200'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Allergies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                className="flex-1 px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add allergy..."
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="hover:text-red-900"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              ))}
              {formData.allergies.length === 0 && (
                <span className="text-sm text-text-muted">No allergies added</span>
              )}
            </div>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
