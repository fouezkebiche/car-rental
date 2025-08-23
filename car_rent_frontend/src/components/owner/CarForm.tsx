import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car } from '../../types';

const CarForm: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    carModel: '',
    year: 0,
    price: 0,
    category: 'Economy',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 0,
    features: '',
    wilaya: '',
    commune: '',
    chauffeur: false,
    rejectionReason: '',
    image: '',
    definitive: false,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!carId);

  useEffect(() => {
    if (!carId) {
      setFetching(false);
      return;
    }

    const fetchCar = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to edit your car.');
        navigate('/login');
        return;
      }

      if (!/^[0-9a-fA-F]{24}$/.test(carId)) {
        console.error('Invalid car ID format:', carId);
        setError('Invalid car ID format.');
        setFetching(false);
        return;
      }

      try {
        console.log('Fetching car data for carId:', carId);
        const response = await axios.get('/api/cars/owner', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });

        console.log('API response:', response.data);
        const car = response.data.find((c: any) => c._id === carId);
        if (!car) {
          console.error('Car not found for carId:', carId);
          setError('Car not found or you do not have access to this car.');
          setFetching(false);
          return;
        }

        if (car.status !== 'rejected' && car.status !== 'pending') {
          console.error('Car cannot be edited due to status:', car.status);
          setError('This car cannot be edited as it is not in pending or rejected status.');
          setFetching(false);
          return;
        }

        if (car.status === 'rejected' && car.definitive) {
          console.error('Car cannot be edited due to definitive rejection:', carId);
          setError('This car cannot be edited as it has been permanently rejected.');
          setFetching(false);
          return;
        }

        setFormData({
          brand: car.brand || '',
          carModel: car.carModel || '',
          year: car.year || 0,
          price: car.price || 0,
          category: car.category || 'Economy',
          transmission: car.transmission || 'Manual',
          fuel: car.fuel || 'Petrol',
          seats: car.seats || 0,
          features: car.features?.join(', ') || '',
          wilaya: car.wilaya || '',
          commune: car.commune || '',
          chauffeur: car.chauffeur || false,
          rejectionReason: car.rejectionReason || '',
          image: car.image || '/default-car.jpg',
          definitive: car.definitive || false,
        });
      } catch (err: any) {
        console.error('Error fetching car:', {
          carId,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('Unauthorized: You do not have permission to edit this car.');
        } else {
          setError(err.response?.data?.message || 'Failed to load car data.');
        }
      } finally {
        setFetching(false);
      }
    };

    fetchCar();
  }, [carId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, features: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG images are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      setNewImage(file);
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to submit the car.');
      navigate('/login');
      setLoading(false);
      return;
    }

    if (!carId && !newImage) {
      setError('Please upload an image.');
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'features' && typeof value === 'string') {
        const featuresArray = value
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f);
        data.append(key, JSON.stringify(featuresArray));
      } else if (key !== 'rejectionReason' && key !== 'image' && key !== 'definitive') {
        data.append(key, value.toString());
      }
    });
    if (newImage) {
      data.append('image', newImage);
    }

    try {
      const url = carId ? `/api/cars/edit/${carId}` : '/api/cars';
      const method = carId ? 'put' : 'post';
      console.log(`Submitting car data to ${url}`);

      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      console.log('Car submitted:', response.data);
      setSuccess(
        carId
          ? 'Your car has been successfully updated and resubmitted for approval.'
          : 'Your car has been successfully added and is pending admin approval.'
      );
      setTimeout(() => navigate('/owner'), 3000);
    } catch (err: any) {
      console.error('Error submitting car:', {
        carId,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Unauthorized: You do not have permission to submit this car.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid data provided. Please check your inputs.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit car.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg font-medium">Loading car data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center bg-red-50 rounded-xl shadow-md">
        <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
        <button
          onClick={() => navigate('/owner')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to My Cars
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {carId ? 'Edit Your Car' : 'Add a New Car'}
      </h2>
      {formData.rejectionReason && (
        <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700">Rejection Reason</h3>
          <p className="text-red-600 mt-2">{formData.rejectionReason}</p>
          <p className="mt-2 text-sm text-red-500 italic">
            Please address the issue above before resubmitting.
          </p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-green-700 text-lg font-medium">{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/day)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            >
              <option value="Economy">Economy</option>
              <option value="Compact">Compact</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel</label>
            <select
              name="fuel"
              value={formData.fuel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              min="1"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleFeaturesChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              placeholder="e.g., GPS, AC, Bluetooth"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
            <input
              type="text"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
            <input
              type="text"
              name="commune"
              value={formData.commune}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-200 disabled:bg-gray-100"
              required
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="chauffeur"
                checked={formData.chauffeur}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600 disabled:opacity-50"
                disabled={loading}
              />
              <span className="ml-2">Chauffeur Available</span>
            </label>
          </div>
          <div className="md:col-span-2">
            {formData.image && carId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
                <img
                  src={formData.image}
                  alt="Current car"
                  className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => (e.currentTarget.src = '/default-car.jpg')}
                />
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {carId ? 'Upload New Image (optional)' : 'Upload Image'}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors duration-200 disabled:bg-gray-100"
              disabled={loading}
              required={!carId}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/owner')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : carId ? 'Save and Resubmit' : 'Add Car'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;