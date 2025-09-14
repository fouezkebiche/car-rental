import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car } from '../../types';
import { Calendar, MapPin, DollarSign, CreditCard, Check } from 'lucide-react';
import { FaPaypal } from 'react-icons/fa';
import { BASE_API_URL } from '../../config';

const BookingForm: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: 'Office', // Default to Office
    dropoffLocation: 'Office', // Default to Office
    additionalServices: [] as string[],
    paymentMethod: 'credit-card',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bookedPeriods, setBookedPeriods] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    if (!carId || !/^[0-9a-fA-F]{24}$/.test(carId)) {
      setError('Invalid car ID.');
      setFetching(false);
      return;
    }

    const fetchCar = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view car details.');
        setFetching(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`/api/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        const c = response.data;
        setCar({
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
          definitive: c.rejectionReason === 'Permanently rejected',
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          chauffeur: c.chauffeur,
        });
      } catch (err: any) {
        console.error('Fetch car error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 404) {
          setError('Car not found.');
        } else if (err.response?.status === 403) {
          setError('This car is not available for booking.');
        } else if (err.response?.status === 401) {
          setError('Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userProfile');
          navigate('/login');
        } else {
          setError('Failed to load car details.');
        }
      } finally {
        setFetching(false);
      }
    };

    const fetchBookedPeriods = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`/api/bookings/car/${carId}/booked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookedPeriods(response.data);
      } catch (err: any) {
        console.error('Fetch booked periods error:', err);
        setError('Failed to load availability information.');
      }
    };

    fetchCar();
    fetchBookedPeriods();
  }, [carId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }));
  };

  const overlaps = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
    return !(end1 <= start2 || start1 >= end2);
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate && car) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError('Invalid date or time format.');
        setTotalAmount(0);
        return;
      }
      if (start >= end) {
        setError('End date/time must be after start date/time.');
        setTotalAmount(0);
        return;
      }

      let hasOverlap = false;
      for (const period of bookedPeriods) {
        const bookedStart = new Date(period.start);
        const bookedEnd = new Date(period.end);
        if (overlaps(start, end, bookedStart, bookedEnd)) {
          hasOverlap = true;
          break;
        }
      }

      if (hasOverlap) {
        setError('Selected period overlaps with an existing booking. Please choose different dates/times.');
        setTotalAmount(0);
        return;
      }

      const milliseconds = end.getTime() - start.getTime();
      const days = Math.ceil(milliseconds / (1000 * 3600 * 24));
      if (days < 1) {
        setError('Booking must be for at least one day.');
        setTotalAmount(0);
        return;
      }
      const basePrice = car.price * days;
      const servicePrice = formData.additionalServices.reduce((total, service) => {
        const prices = {
          gps: 10,
          insurance: 25,
          'child-seat': 15,
          driver: 20,
          wifi: 8,
        };
        return total + (prices[service as keyof typeof prices] || 0);
      }, 0);
      setTotalAmount(basePrice + servicePrice * days);
      setError('');
    }
  }, [formData.startDate, formData.endDate, formData.additionalServices, car, bookedPeriods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to make a booking.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        '/api/bookings',
        {
          carId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          additionalServices: formData.additionalServices,
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Booking response:', response.data); // Debug: Log response
      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Create booking error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Failed to create booking.');
      } else if (err.response?.status === 401) {
        setError('Please log in to make a booking.');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userProfile');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'An error occurred while submitting the booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    navigate('/customer');
  };

  const currentDatetime = new Date().toISOString().slice(0, 16);

  if (fetching) {
    return <div className="flex justify-center items-center h-64 text-gray-600">Loading car details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!car) {
    return <div className="text-center text-gray-600 py-8">Car not found.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Book {car.brand} {car.carModel}</h2>

      <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability</h3>
        {bookedPeriods.length === 0 ? (
          <p className="text-green-600">This car is fully available for booking.</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">The following periods are unavailable:</p>
            <ul className="list-disc pl-6 space-y-2">
              {bookedPeriods.map((period, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {new Date(period.start).toLocaleString()} to {new Date(period.end).toLocaleString()}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Pickup Date & Time
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
              min={currentDatetime}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Dropoff Date & Time
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
              min={formData.startDate || currentDatetime}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Pickup Location
            </label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            >
              <option value="Office">Office</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Dropoff Location
            </label>
            <select
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            >
              <option value="Office">Office</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['gps', 'insurance', 'child-seat', 'driver', 'wifi'].map((service) => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.additionalServices.includes(service)}
                  onChange={() => handleServiceChange(service)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700">{service.charAt(0).toUpperCase() + service.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-700">Credit Card</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <FaPaypal className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-700">PayPal</span>
            </label>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <DollarSign className="h-5 w-5 inline-block text-blue-600 mr-2" />
          <span className="text-xl font-bold text-blue-600">${totalAmount}</span>
          <span className="text-sm text-gray-600 ml-2">Total Amount</span>
        </div>
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/customer/cars')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || totalAmount === 0 || !!error}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <Check className="h-5 w-5 mr-2 animate-pulse" />
                Submitting...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>

      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted</h2>
              <p className="text-gray-600 mb-6">
                Your booking is under review. The car owner will review your request and we will contact you soon with confirmation.
              </p>
              <button
                onClick={handleCloseSuccess}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;