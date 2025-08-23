import React, { useState, useEffect } from 'react';
import { Check, X, Image as ImageIcon, DollarSign, Calendar, MapPin, Fuel, Settings, Users, Star, User, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Car } from '../../types';
import { BASE_API_URL } from '../../config'; // Import the base URL

const API_URL = '/api/cars/pending';

const AdminCars: React.FC = () => {
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; carId: string | null }>({ open: false, carId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionType, setRejectionType] = useState<'permanent' | 'withReason'>('withReason');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = response.data.map((c: any) => ({
        id: c._id || 'N/A',
        brand: c.brand || 'N/A',
        carModel: c.carModel || 'N/A',
        year: c.year || 0,
        price: c.price || 0,
        image: c.image ? `${BASE_API_URL}${c.image}` : '/default-car.jpg', // Prepend base URL
        category: c.category || 'N/A',
        transmission: c.transmission || 'N/A',
        fuel: c.fuel || 'N/A',
        seats: c.seats || 0,
        available: c.available ?? true,
        features: c.features || [],
        wilaya: c.wilaya || 'N/A',
        commune: c.commune || 'N/A',
        rating: c.rating || 0,
        ownerId: {
          name: c.ownerId?.name || 'Unknown',
          email: c.ownerId?.email || 'N/A',
        },
        status: c.status || 'pending',
        rejectionReason: c.rejectionReason || '',
        createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'N/A',
        chauffeur: c.chauffeur || false,
      }));
      setPendingCars(pending);
    } catch (err: any) {
      console.error('Cars fetch error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in as admin.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin role required.');
      } else {
        setError('Failed to load pending cars. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.put(`/api/cars/approve/${carId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCars();
    } catch (err: any) {
      console.error('Approve car error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError('Failed to approve car.');
    }
  };

  const handleReject = async (carId: string) => {
    let finalReason = rejectionReason.trim();
    let finalDefinitive = rejectionType === 'permanent';

    if (finalDefinitive) {
      finalReason = 'Permanently rejected';
    } else if (!finalReason) {
      setError('Rejection reason is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.put(
        `/api/cars/reject/${carId}`,
        { rejectionReason: finalReason, definitive: finalDefinitive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal({ open: false, carId: null });
      setRejectionReason('');
      setRejectionType('withReason');
      fetchCars();
    } catch (err: any) {
      console.error('Reject car error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError('Failed to reject car.');
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
          onClick={fetchCars}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Cars</h1>
        {pendingCars.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-600">
            No pending cars found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.carModel}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.currentTarget.src = '/default-car.jpg')}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {car.brand} {car.carModel} ({car.year})
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    ID: {car.id}
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      Price: ${car.price}/day
                    </p>
                    <p className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Category: {car.category}
                    </p>
                    <p className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-purple-600" />
                      Transmission: {car.transmission}
                    </p>
                    <p className="flex items-center">
                      <Fuel className="h-4 w-4 mr-2 text-orange-600" />
                      Fuel: {car.fuel}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-indigo-600" />
                      Seats: {car.seats}
                    </p>
                    <p className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-600" />
                      Rating: {car.rating}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-red-600" />
                      Location: {car.wilaya}, {car.commune}
                    </p>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-green-600" />
                      Chauffeur: {car.chauffeur ? 'Yes' : 'No'}
                    </p>
                    <p className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Features: {car.features.join(', ') || 'None'}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                      Created: {car.createdAt}
                    </p>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-600" />
                      Owner: {car.ownerId.name} ({car.ownerId.email})
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleApprove(car.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => setRejectModal({ open: true, carId: car.id })}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Car</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="withReason"
                    checked={rejectionType === 'withReason'}
                    onChange={() => setRejectionType('withReason')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Reject with Reason (Allow Resubmission)</span>
                </label>
                {rejectionType === 'withReason' && (
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    rows={4}
                    placeholder="Enter the reason for rejection..."
                  />
                )}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="permanent"
                    checked={rejectionType === 'permanent'}
                    onChange={() => setRejectionType('permanent')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Reject Permanently (No Resubmission)</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setRejectModal({ open: false, carId: null });
                    setRejectionReason('');
                    setRejectionType('withReason');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectModal.carId && handleReject(rejectModal.carId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  disabled={rejectionType === 'withReason' && !rejectionReason.trim()}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;