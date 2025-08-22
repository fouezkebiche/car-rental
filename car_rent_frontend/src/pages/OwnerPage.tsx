import React, { useState } from 'react';
import { Car, Plus, Calendar, BarChart3 } from 'lucide-react';

const OwnerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cars');

  const tabs = [
    { id: 'cars', label: 'My Cars', icon: <Car className="h-5 w-5" /> },
    { id: 'add', label: 'Add Car', icon: <Plus className="h-5 w-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="h-5 w-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'cars':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Cars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Car cards will be rendered here */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center text-gray-500">
                  <Car className="h-16 w-16 mx-auto mb-4" />
                  <p>No cars added yet</p>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Your First Car
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'add':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Car</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">Add Car Form - Coming Soon</p>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">Bookings Management - Coming Soon</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">Analytics Dashboard - Coming Soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Owner Panel</h2>
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
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;