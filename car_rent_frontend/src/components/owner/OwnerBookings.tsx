import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Booking } from '../../types';
import { Car as CarIcon, Calendar, MapPin, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
// import { AuthRequest } from '../types/auth';

const OwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

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
        const response = await axios.get('/api/bookings/pending/owner', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedBookings = response.data.map((b: any) => ({
          id: b._id,
          userId: {
            id: b.userId?._id || 'N/A',
            name: b.userId?.name || 'Unknown',
            email: b.userId?.email || 'N/A',
          },
          carId: {
            id: b.carId?._id || 'N/A',
            brand: b.carId?.brand || 'Unknown',
            carModel: b.carId?.carModel || 'Unknown',
          },
          ownerId: {
            id: b.ownerId?._id || 'N/A',
            name: b.ownerId?.name || 'Unknown',
            email: b.ownerId?.email || 'N/A',
          },
          startDate: b.startDate,
          endDate: b.endDate,
          totalAmount: b.totalAmount || 0,
          status: b.status || 'pending',
          pickupLocation: b.pickupLocation || 'N/A',
          dropoffLocation: b.dropoffLocation || 'N/A',
          additionalServices: b.additionalServices || [],
          paymentMethod: b.paymentMethod || 'N/A',
          rejectionReason: b.rejectionReason || '',
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
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
          setError('Access denied. Owner role required.');
        } else {
          setError('Failed to load bookings. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleApprove = async (bookingId: string) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to approve bookings.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(`/api/bookings/approve/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Booking approved successfully.');
      setBookings(bookings.filter((b) => b.id !== bookingId)); // Remove from pending list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (bookingId: string) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to reject bookings.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(`/api/bookings/reject/${bookingId}`, { rejectionReason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Booking rejected successfully.');
      setBookings(bookings.filter((b) => b.id !== bookingId)); // Remove from pending list
      setRejectionReason('');
      setSelectedBookingId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAvailable = async (carId: string) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update car availability.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(`/api/cars/edit/${carId}`, { available: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Car made available successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update car availability.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Bookings</h2>
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No pending bookings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <CarIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {booking.carId.brand} {booking.carId.carModel}
                </h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>Customer: {booking.userId.name} ({booking.userId.email})</p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start: {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  End: {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Pickup: {booking.pickupLocation}
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Dropoff: {booking.dropoffLocation}
                </p>
                <p>Total Amount: ${booking.totalAmount}</p>
                <p>Payment Method: {booking.paymentMethod}</p>
                {booking.additionalServices.length > 0 && (
                  <p>Services: {booking.additionalServices.join(', ')}</p>
                )}
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleApprove(booking.id)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => setSelectedBookingId(booking.id)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
              {selectedBookingId === booking.id && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    rows={4}
                    placeholder="Enter reason for rejection"
                  />
                  <div className="mt-2 flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedBookingId(null)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      disabled={isLoading || !rejectionReason.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default OwnerBookings;