// C:\Users\kebic\OneDrive\Desktop\car_rent_rahim\car_rent_frontend\src\components\customer\CustomerDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Booking } from '../../types';
import { AlertCircle, Calendar, MapPin, Car as CarIcon } from 'lucide-react';

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            No bookings found.
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.carId.brand} {booking.carId.carModel}
                  </h2>
                </div>
                <div className="space-y-2 text-gray-600">
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
                  <p>Status: <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span></p>
                  <p>Total Amount: ${booking.totalAmount}</p>
                  <p>Payment Method: {booking.paymentMethod}</p>
                  {booking.additionalServices.length > 0 && (
                    <p>Services: {booking.additionalServices.join(', ')}</p>
                  )}
                  {booking.rejectionReason && (
                    <p className="text-red-600">Rejection Reason: {booking.rejectionReason}</p>
                  )}
                  <p>Owner: {booking.ownerId.name} ({booking.ownerId.email})</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;