import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const AddFoodModal = ({ isOpen, onClose, onSuccess, initialMealType, selectedDate }) => {
  const [mealType, setMealType] = useState(initialMealType || 'Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchFoods(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchFoods = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/meals/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data.foods || []);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
  };

  const handleAddFood = async () => {
    if (!selectedFood) {
      setError('Please select a food item');
      return;
    }

    if (!mealType) {
      setError('Please select a meal type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Use the selected date at 12:00 noon to avoid timezone issues
      const mealDate = selectedDate ? new Date(selectedDate) : new Date();
      mealDate.setHours(12, 0, 0, 0);
      
      console.log('Adding meal for date:', mealDate);
      
      await axios.post(
        `${API_URL}/meals`,
        {
          date: mealDate.toISOString(),
          mealType,
          foodName: selectedFood.name,
          servingSize: selectedFood.servingSize,
          calories: selectedFood.calories,
          protein: selectedFood.protein,
          carbs: selectedFood.carbs,
          fat: selectedFood.fat,
          imageUrl: selectedFood.imageUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Reset form
      setSearchQuery('');
      setSelectedFood(null);
      setSearchResults([]);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding food:', error);
      setError(error.response?.data?.message || 'Failed to add food');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Food</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Meal Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  mealType === type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Food <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 material-icons-round text-gray-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a food item..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {searchResults.map((food, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFood(food)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedFood?.name === food.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={food.imageUrl || 'https://via.placeholder.com/48'}
                    alt={food.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <p className="text-sm text-gray-500">{food.servingSize} • {food.calories} kcal</p>
                  </div>
                  {selectedFood?.name === food.name && (
                    <span className="material-icons-round text-primary">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Nutrition Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{selectedFood.calories}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{selectedFood.protein}g</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{selectedFood.carbs}g</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{selectedFood.fat}g</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFood}
            disabled={!selectedFood || loading}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-[#0ea574] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Food'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodModal;
