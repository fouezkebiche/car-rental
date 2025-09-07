import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_URL}/login`, { email, password }, { timeout: 5000 });
      const { token, user } = response.data;

      // Validate user data
      if (!user || !user.id || !user.email || !user.role || !user.phone) {
        throw new Error('Invalid user data received from server');
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userProfile', JSON.stringify({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        role: user.role,
        phone: user.phone,
        joinDate: user.joinDate,
        status: user.status,
      }));

      console.log('Login successful, stored user data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });

      if (user.role === 'owner' && user.status === 'pending') {
        setError('Your account is awaiting admin approval. Please check your email for updates.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userProfile');
        setLoading(false);
        return;
      }

      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'owner') {
        navigate('/owner');
      } else if (user.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: `${API_URL}/login`,
      });
      setError(
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? err.response.data.errors.map((e: any) => e.msg).join(', ')
          : 'Login failed. Please check your credentials or network.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Log In</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;