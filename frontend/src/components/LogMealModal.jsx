import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function LogMealModal({ isOpen, onClose, onSuccess }) {
  const [mealType, setMealType] = useState('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mealTypes = [
    { value: 'Breakfast', icon: 'wb_twilight' },
    { value: 'Lunch', icon: 'restaurant' },
    { value: 'Dinner', icon: 'dinner_dining' },
    { value: 'Snack', icon: 'cookie' }
  ];

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

  const handleAddMeal = async () => {
    if (!selectedFood) {
      setError('Please select a food item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/meals`, {
        mealType: mealType,
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

      // Reset form
      setMealType('Breakfast');
      setSearchQuery('');
      setSelectedFood(null);
      setSearchResults([]);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding meal:', err);
      setError(err.response?.data?.message || 'Failed to add meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-main">Log Meal</h2>
          <button 
            onClick={onClose}
            className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Meal Type</label>
            <div className="grid grid-cols-4 gap-3">
              {mealTypes.map((meal) => (
                <button
                  key={meal.value}
                  onClick={() => setMealType(meal.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    mealType === meal.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border-light hover:border-primary/50 text-text-muted'
                  }`}
                >
                  <span className="material-symbols-outlined mb-1">{meal.icon}</span>
                  <span className="text-xs font-bold">{meal.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <label className="block text-sm font-bold text-text-main mb-3">Search Food</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-muted">search</span>
              </div>
              <input 
                className="block w-full pl-12 pr-4 py-3 bg-background-light border-transparent focus:border-primary focus:ring-0 rounded-xl text-text-main placeholder-text-muted" 
                placeholder="Search for food (e.g. Avocado Toast, Banana...)" 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border-light max-h-60 overflow-y-auto z-50">
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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Selected Food */}
          {selectedFood && (
            <div className="p-4 bg-background-light rounded-xl border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="size-20 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <img 
                    alt={selectedFood.name} 
                    className="w-full h-full object-cover" 
                    src={selectedFood.imageUrl}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-text-main">{selectedFood.name}</h3>
                      <p className="text-sm text-text-muted">{selectedFood.servingSize}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFood(null)}
                      className="text-text-muted hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-muted">Calories</span>
                      <span className="text-sm font-bold text-text-main">{selectedFood.calories}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-muted">Protein</span>
                      <span className="text-sm font-bold text-text-main">{selectedFood.protein}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-muted">Carbs</span>
                      <span className="text-sm font-bold text-text-main">{selectedFood.carbs}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-muted">Fat</span>
                      <span className="text-sm font-bold text-text-main">{selectedFood.fat || 0}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border-light text-text-main font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddMeal}
            disabled={loading || !selectedFood}
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            {loading ? 'Adding...' : 'Add Meal'}
          </button>
        </div>
      </div>
    </div>
  );
}
