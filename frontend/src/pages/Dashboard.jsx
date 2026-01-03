import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import DashboardTab from '../components/DashboardTab';
import FoodDiaryTab from '../components/FoodDiaryTab';
import ReportsTab from '../components/ReportsTab';
import CommunityTab from '../components/CommunityTab';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    await fetchUserProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
      />
      
      {activeTab === 'dashboard' && (
        <DashboardTab 
          user={user} 
          handleProfileUpdate={handleProfileUpdate}
          handleLogout={handleLogout}
        />
      )}
      {activeTab === 'food-diary' && <FoodDiaryTab />}
      {activeTab === 'reports' && <ReportsTab />}
      {activeTab === 'community' && <CommunityTab />}
    </div>
  );
};

export default Dashboard;
