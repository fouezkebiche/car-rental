// C:\Users\kebic\OneDrive\Desktop\car_rent_rahim\car_rent_frontend\src\components\customer\CustomerProfile.tsx
import React from 'react';
import { LogOut, User, Mail, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userProfile') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h2>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">{user.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">{user.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">{user.phone}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">Role: {user.role}</span>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-lg text-gray-900">Status: {user.status}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;