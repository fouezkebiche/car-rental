import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Car, BarChart3, Settings, LogOut } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCars from '../components/admin/AdminCars';

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { id: 'cars', label: 'Cars', icon: <Car className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  useEffect(() => {
    // Check for token immediately on mount
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found, redirecting to login');
      navigate('/login');
      return;
    }

    // Load profile from localStorage if on settings tab
    if (activeTab === 'settings') {
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

      const parsedProfile: AdminProfile = JSON.parse(profileData);
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
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'cars':
        return <AdminCars />;
      case 'settings':
        return (
          <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Profile</h3>
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
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Go to Dashboard
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
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
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

        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;