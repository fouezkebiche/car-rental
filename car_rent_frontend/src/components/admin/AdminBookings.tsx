import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, DollarSign } from 'lucide-react';
import axios from 'axios';

interface Booking {
  id: string;
  userId: { name: string; email: string };
  carId: { brand: string; carModel: string };
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  additionalServices: string[];
}

const API_URL = '/api/bookings/all';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(
        response.data.map((b: any) => ({
          id: b._id,
          userId: {
            name: b.userId?.name || 'Unknown',
            email: b.userId?.email || 'N/A',
          },
          carId: {
            brand: b.carId?.brand || 'N/A',
            carModel: b.carId?.carModel || 'N/A',
          },
          startDate: new Date(b.startDate).toLocaleString(),
          endDate: new Date(b.endDate).toLocaleString(),
          pickupLocation: b.pickupLocation || 'N/A',
          dropoffLocation: b.dropoffLocation || 'N/A',
          totalAmount: b.totalAmount || 0,
          status: b.status || 'pending',
          additionalServices: b.additionalServices || [],
        }))
      );
    } catch (err: any) {
      console.error('Bookings fetch error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in as admin.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin role required.');
      } else {
        setError('Failed to load bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.carId.brand} ${booking.carId.carModel}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          onClick={fetchBookings}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">View all bookings on the platform</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer name, email, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedBookings.length} of {filteredBookings.length} bookings
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Car</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Dates</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Locations</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Total</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Services</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                    >
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{booking.userId.name}</p>
                        <p className="text-sm text-gray-600">{booking.userId.email}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {booking.carId.brand} {booking.carId.carModel}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          {booking.startDate} - {booking.endDate}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-red-600" />
                          {booking.pickupLocation} / {booking.dropoffLocation}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          ${booking.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {booking.additionalServices.join(', ') || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t mt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;