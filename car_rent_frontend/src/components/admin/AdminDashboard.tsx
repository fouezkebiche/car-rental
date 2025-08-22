import React, { useState, useEffect } from 'react';
import { Users, Car, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = '/api'; // Using proxy to handle CORS

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any>({});
  const [carUtilizationData, setCarUtilizationData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = { Authorization: `Bearer ${token}` };

      let totalUsers = 0;
      let fleetSize = 0;
      let monthlyRevenue = 0;

      // Fetch users
      try {
        const usersResponse = await axios.get(`${API_URL}/users`, { headers });
        totalUsers = usersResponse.data.length;
      } catch (err: any) {
        console.error('Users fetch error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        throw new Error('Failed to fetch users');
      }

      // Fetch cars
      try {
        const carsResponse = await axios.get(`${API_URL}/cars`, { headers });
        fleetSize = carsResponse.data.length;
      } catch (err: any) {
        console.error('Cars fetch error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        throw new Error('Failed to fetch cars');
      }

      // Fetch bookings for monthly revenue
      try {
        const bookingsResponse = await axios.get(`${API_URL}/bookings/all`, { headers });
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        monthlyRevenue = bookingsResponse.data
          .filter((b: { status: string; endDate: string; totalAmount: number }) => {
            const endDate = new Date(b.endDate);
            return (
              b.status === 'completed' &&
              endDate.getMonth() + 1 === currentMonth &&
              endDate.getFullYear() === currentYear
            );
          })
          .reduce((sum: number, b: { totalAmount: number }) => sum + b.totalAmount, 0);
      } catch (err: any) {
        console.error('Bookings fetch error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        throw new Error('Failed to fetch revenue data');
      }

      // Set stats (removed Active Bookings)
      setStats([
        {
          title: 'Total Users',
          value: totalUsers.toLocaleString(),
          change: '+12.5%', // Placeholder, replace with real data if available
          trend: 'up',
          icon: <Users className="h-8 w-8 text-blue-600" />,
          color: 'blue',
        },
        {
          title: 'Fleet Size',
          value: fleetSize.toLocaleString(),
          change: '+3.1%',
          trend: 'up',
          icon: <Car className="h-8 w-8 text-orange-600" />,
          color: 'orange',
        },
        {
          title: 'Monthly Revenue',
          value: `$${monthlyRevenue.toLocaleString()}`,
          change: '+15.3%',
          trend: 'up',
          icon: <DollarSign className="h-8 w-8 text-purple-600" />,
          color: 'purple',
        },
      ]);

      // Monthly Revenue Chart (sample data, replace with API data if available)
      setMonthlyRevenueData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [30000, 32000, 35000, 37000, 40000, 42000, 45000, monthlyRevenue || 40000],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });

      // Car Utilization Chart (sample data, replace with API data if available)
      setCarUtilizationData({
        labels: ['Economy', 'Compact', 'SUV', 'Luxury', 'Sports'],
        datasets: [
          {
            label: 'Utilization (%)',
            data: [85, 92, 78, 65, 55], // Sample data
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1,
          },
        ],
      });
    } catch (err: any) {
      console.error('Dashboard fetch error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.message || 'Failed to load dashboard data. Please check your authentication or network.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your car rental business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>{stat.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h3>
            <Line data={monthlyRevenueData} />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Car Utilization</h3>
            <Line data={carUtilizationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;