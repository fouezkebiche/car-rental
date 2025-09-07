import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Car } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api/auth';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        phone,
        role,
      });

      const { message, token, user } = response.data;

      if (role === 'owner') {
        setSuccess(message || 'Registration successful. Your account is pending admin approval.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        setSuccess('Registration successful! Redirecting to home...');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: `${API_URL}/register`,
      });
      setError(
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? err.response.data.errors.map((e: any) => e.msg).join(', ')
          : 'Registration failed. Please check your network or try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Car className="h-4 w-4 mr-1" />
                Role
              </label>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'customer' | 'owner')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="owner">Car Owner</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;