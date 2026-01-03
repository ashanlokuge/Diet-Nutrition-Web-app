import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function LogWaterModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [250, 500, 750, 1000];

  const handleLog = async () => {
    const waterAmount = showCustom ? parseInt(customAmount) : amount;
    
    if (!waterAmount || waterAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/water`, {
        amount: waterAmount,
        date: new Date()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Reset form
      setAmount(250);
      setCustomAmount('');
      setShowCustom(false);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error logging water:', err);
      setError(err.response?.data?.message || 'Failed to log water. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">water_drop</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Log Water</h2>
                <p className="text-blue-100 text-sm">Stay hydrated!</p>
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
          {/* Preset Amounts */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Quick Select (ml)</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setShowCustom(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    amount === preset && !showCustom
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-border-light hover:border-blue-300 text-text-main'
                  }`}
                >
                  <div className="text-lg font-bold">{preset}</div>
                  <div className="text-xs text-text-muted">ml</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Custom Amount</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="Enter amount..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setShowCustom(true);
                }}
                className="w-full px-4 py-3 bg-background-light border-2 border-transparent focus:border-blue-500 focus:ring-0 rounded-xl text-text-main placeholder-text-muted"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">ml</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Current Selection Display */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Amount to log:</span>
              <span className="text-2xl font-bold text-blue-600">
                {showCustom ? customAmount || 0 : amount} ml
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <span className="material-symbols-outlined text-blue-500">info</span>
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">Daily Goal: 2000 ml</p>
              <p className="text-blue-700">Drink water regularly throughout the day to stay hydrated and support your health goals.</p>
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
            disabled={showCustom && !customAmount || loading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            {loading ? 'Logging...' : 'Log Water'}
          </button>
        </div>
      </div>
    </div>
  );
}
