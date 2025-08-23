// C:\Users\kebic\OneDrive\Desktop\car_rent_rahim\car_rent_frontend\src\pages\CustomerPage.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Car, User, LogOut } from 'lucide-react';
import CustomerDashboard from '../components/customer/CustomerDashboard';
import CarList from '../components/customer/CarList';
import CustomerProfile from '../components/customer/CustomerProfile';
import BookingForm from '../components/customer/BookingForm';
import { useNavigate } from 'react-router-dom';

const CustomerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'cars', label: 'Cars', icon: <Car className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const renderContent = () => (
    <div className="flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Customer Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1">
        {activeTab === 'dashboard' && <CustomerDashboard />}
        {activeTab === 'cars' && <CarList />}
        {activeTab === 'profile' && <CustomerProfile />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/booking/:carId" element={renderContent()} /> {/* Sidebar persists on booking */}
      </Routes>
    </div>
  );
};

export default CustomerPage;