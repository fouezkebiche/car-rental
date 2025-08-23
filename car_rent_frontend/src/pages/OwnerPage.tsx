import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Car, Plus, Calendar, Settings, LogOut } from 'lucide-react';
import OwnerCars from '../components/owner/OwnerCars';
import CarForm from '../components/owner/CarForm';
import OwnerBookings from '../components/owner/OwnerBookings';

interface OwnerProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

const OwnerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [profileError, setProfileError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'cars', label: 'My Cars', icon: <Car className="h-5 w-5" /> },
    { id: 'add', label: 'Add Car', icon: <Plus className="h-5 w-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <Settings className="h-5 w-5" /> },
  ];

  useEffect(() => {
    // Check for token immediately on mount
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found, redirecting to login');
      navigate('/login');
      return;
    }

    // Load profile when profile tab is active
    if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab, navigate]);

  const fetchProfile = () => {
    setIsLoading(true);
    setProfileError('');
    try {
      console.log('Attempting to load profile from localStorage');
      const profileData = localStorage.getItem('userProfile');
      if (!profileData) {
        throw new Error('No profile data found in localStorage');
      }

      const parsedProfile: OwnerProfile = JSON.parse(profileData);
      if (!parsedProfile.email || !parsedProfile.role || !parsedProfile.phone) {
        throw new Error('Invalid profile data in localStorage');
      }

      setProfile(parsedProfile);
      console.log('Profile loaded successfully:', parsedProfile);
    } catch (err: any) {
      console.error('Profile load error:', {
        message: err.message,
      });
      setProfileError('Failed to load profile information. Using fallback data.');
      // Set fallback data
      setProfile({
        name: 'Owner User',
        email: 'owner@example.com',
        role: 'owner',
        phone: '+1234567899',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out, clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userProfile');
    navigate('/login');
  };

  const renderContent = () => (
    <div className="flex">
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
        {activeTab === 'cars' && <OwnerCars setActiveTab={setActiveTab} />}
        {activeTab === 'add' && <CarForm />}
        {activeTab === 'bookings' && <OwnerBookings />}
        {activeTab === 'profile' && (
          <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Owner Profile</h3>
              {profileError && (
                <div className="mb-4 text-red-500">{profileError}</div>
              )}
              {isLoading ? (
                <div className="text-gray-600">Loading profile...</div>
              ) : profile ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg text-gray-900">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Role</p>
                    <p className="text-lg text-gray-900">{profile.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg text-gray-900">{profile.phone}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-6">
                    <button
                      onClick={() => setActiveTab('cars')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Go to My Cars
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Unable to load profile.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/edit/:carId" element={
          <div className="flex">
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
              <CarForm />
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default OwnerPage;