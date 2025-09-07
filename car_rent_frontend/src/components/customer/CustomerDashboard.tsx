import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Booking } from '../../types';
import { AlertCircle, Calendar, MapPin, Car as CarIcon, DollarSign, Clock } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your bookings.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Bookings response:', response.data); // Debug: Log response
        const mappedBookings = response.data.map((b: any) => ({
          id: b._id,
          userId: b.userId,
          carId: {
            id: b.carId?._id || 'N/A',
            brand: b.carId?.brand || 'Unknown',
            carModel: b.carId?.carModel || 'Unknown',
          },
          ownerId: {
            id: b.carId?.ownerId || b.ownerId || 'N/A', // Use carId.ownerId or ownerId
            name: b.carId?.ownerId?.name || 'Unknown', // Fallback if not populated
            email: b.carId?.ownerId?.email || 'N/A', // Fallback if not populated
          },
          startDate: b.startDate ? new Date(b.startDate) : new Date(),
          endDate: b.endDate ? new Date(b.endDate) : new Date(),
          totalAmount: b.totalAmount || 0,
          status: b.status || 'pending',
          pickupLocation: b.pickupLocation || 'N/A',
          dropoffLocation: b.dropoffLocation || 'N/A',
          additionalServices: b.additionalServices || [],
          paymentMethod: b.paymentMethod || 'N/A',
          createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
          updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date(),
          rejectionReason: b.rejectionReason || '',
        }));
        setBookings(mappedBookings);
      } catch (err: any) {
        console.error('Fetch bookings error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. Customer role required.');
        } else {
          setError('Failed to load bookings. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600">
            No bookings found. Start browsing cars to make your first booking!
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locations
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CarIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-medium text-gray-900">
                            {booking.carId.brand} {booking.carId.carModel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            Pickup: {booking.pickupLocation}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            Dropoff: {booking.dropoffLocation}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">${booking.totalAmount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">{booking.rejectionReason}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;