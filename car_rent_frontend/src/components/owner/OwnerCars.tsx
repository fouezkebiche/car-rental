// C:\Users\kebic\OneDrive\Desktop\car_rent_rahim\car_rent_frontend\src\components\owner\OwnerCars.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car as CarIcon, Edit2, RefreshCw } from 'lucide-react';
import { Car } from '../../types';
import { BASE_API_URL } from '../../config';

const OwnerCars: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerCars = async () => {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const userProfile = localStorage.getItem('userProfile');

      if (!token || !userProfile) {
        setError('Please log in to view your cars.');
        navigate('/login');
        return;
      }

      let parsedProfile;
      try {
        parsedProfile = JSON.parse(userProfile);
        if (!parsedProfile.id) {
          throw new Error('User ID not found in profile');
        }
      } catch (err: any) {
        setError('Invalid user profile data. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/cars/owner', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        });

        const mappedCars = response.data.map((c: any) => ({
          id: c._id.toString(),
          brand: c.brand,
          carModel: c.carModel,
          year: c.year,
          price: c.price,
          image: c.image ? (c.image.startsWith('http') ? c.image : `${BASE_API_URL}${c.image}`) : '/default-car.jpg',
          category: c.category,
          transmission: c.transmission,
          fuel: c.fuel,
          seats: c.seats,
          available: c.available,
          features: c.features,
          wilaya: c.wilaya,
          commune: c.commune,
          rating: c.rating,
          ownerId: {
            id: c.ownerId?._id?.toString() || '',
            name: c.ownerId?.name || '',
            email: c.ownerId?.email || '',
          },
          status: c.status,
          rejectionReason: c.rejectionReason,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          chauffeur: c.chauffeur,
        }));

        setCars(mappedCars);
      } catch (err: any) {
        console.error('Error fetching owner cars:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userProfile');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load cars. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerCars();
  }, [navigate]);

  const handleEditCar = (carId: string) => {
    navigate(`/owner/edit/${carId}`);
  };

  const handleToggleAvailability = async (carId: string, currentAvailability: boolean) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update car availability.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `/api/cars/toggle-availability/${carId}`,
        { available: !currentAvailability },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(response.data.message || `Car ${currentAvailability ? 'made unavailable' : 'made available'} successfully.`);
      setCars(cars.map(car => (car.id === carId ? { ...car, available: !currentAvailability } : car)));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Toggle availability error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Failed to update car availability.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Cars</h2>
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {isLoading ? (
        <div className="text-center text-gray-600">Loading cars...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.carModel}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => (e.currentTarget.src = '/default-car.jpg')}
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.brand} {car.carModel}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {car.wilaya}, {car.commune}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        car.status === 'approved'
                          ? 'text-green-600'
                          : car.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      Status: {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Availability: {car.available ? 'Available' : 'Not Available'}
                    </p>
                    {car.status === 'rejected' && car.rejectionReason && (
                      <p className="text-sm text-red-500 mt-1">
                        Reason: {car.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    {car.status === 'rejected' && car.rejectionReason !== 'Permanently rejected' && (
                      <button
                        onClick={() => handleEditCar(car.id)}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit & Resubmit</span>
                      </button>
                    )}
                    {car.status === 'approved' && (
                      <button
                        onClick={() => handleToggleAvailability(car.id, car.available)}
                        disabled={isLoading}
                        className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>{car.available ? 'Make Unavailable' : 'Make Available'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <CarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No cars added yet</p>
          <button
            onClick={() => setActiveTab('add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Your First Car
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerCars;