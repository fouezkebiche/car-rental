import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import axios from 'axios';

interface Car {
  id: string;
  brand: string;
  carModel: string;
  year: number;
  image: string;
  category: string;
  status: string;
  ownerId: { name: string; email: string };
  rejectionReason?: string;
  createdAt: string;
}

const API_URL = '/api/cars';

const AdminCars: React.FC = () => {
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; carId: string | null }>({ open: false, carId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [definitive, setDefinitive] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = response.data
        .filter((c: any) => c.status === 'pending')
        .map((c: any) => ({
          id: c._id,
          brand: c.brand || 'N/A',
          carModel: c.carModel || 'N/A',
          year: c.year || 0,
          image: c.image || '/default-car.jpg',
          category: c.category || 'N/A',
          status: c.status || 'Unknown',
          ownerId: c.ownerId ? { name: c.ownerId.name || 'N/A', email: c.ownerId.email || 'N/A' } : { name: 'N/A', email: 'N/A' },
          rejectionReason: c.rejectionReason || '',
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
        }));
      setPendingCars(pending);
    } catch (err: any) {
      console.error('Cars fetch error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError('Failed to load pending cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.put(`${API_URL}/approve/${carId}`, {}, {
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
    if (!definitive && !rejectionReason.trim()) {
      setError('Rejection reason is required for non-definitive rejection.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');
      await axios.put(
        `${API_URL}/reject/${carId}`,
        { rejectionReason, definitive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal({ open: false, carId: null });
      setRejectionReason('');
      setDefinitive(false);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economy':
        return 'bg-green-100 text-green-800';
      case 'Compact':
        return 'bg-blue-100 text-blue-800';
      case 'SUV':
        return 'bg-yellow-100 text-yellow-800';
      case 'Luxury':
        return 'bg-purple-100 text-purple-800';
      case 'Sports':
        return 'bg-red-100 text-red-800';
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Car</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Owner</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Created At</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCars.map((car, index) => (
                      <tr
                        key={car.id}
                        className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={car.image}
                              alt={`${car.brand} ${car.carModel}`}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => (e.currentTarget.src = '/default-car.jpg')}
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {car.brand} {car.carModel} ({car.year})
                              </p>
                              <p className="text-sm text-gray-600">ID: {car.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-gray-900">{car.ownerId.name}</p>
                            <p className="text-sm text-gray-600">{car.ownerId.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                              car.category
                            )}`}
                          >
                            {car.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600">{car.createdAt}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(car.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setRejectModal({ open: true, carId: car.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDefinitive(true);
                                setRejectModal({ open: true, carId: car.id });
                              }}
                              className="p-2 text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              title="Reject Definitively"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {definitive ? 'Reject Car Definitively' : 'Reject Car'}
              </h2>
              {!definitive && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter the reason for rejection..."
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setRejectModal({ open: false, carId: null });
                    setRejectionReason('');
                    setDefinitive(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectModal.carId && handleReject(rejectModal.carId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={!definitive && !rejectionReason.trim()}
                >
                  Reject
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