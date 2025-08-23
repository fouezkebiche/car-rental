import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Car, FilterOptions } from '../../types';
import CarCard from './CarCard';
import axios from 'axios';
import { BASE_API_URL } from '../../config';

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    priceRange: [0, 300],
    transmission: '',
    fuel: '',
    seats: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Economy', 'Compact', 'SUV', 'Luxury', 'Sports'];
  const transmissions = ['Manual', 'Automatic'];
  const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const seatOptions = ['2', '4', '5', '7+'];

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/cars');
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
          features: c.features || [],
          wilaya: c.wilaya || 'Unknown',
          commune: c.commune || 'Unknown',
          rating: c.rating || 0,
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
          chauffeur: c.chauffeur || false,
        }));
        setCars(mappedCars);
        setFilteredCars(mappedCars);
      } catch (err: any) {
        setError('Failed to load cars.');
        console.error('Fetch cars error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const applyFilters = () => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.carModel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || car.category === filters.category;
      const matchesPrice = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;
      const matchesFuel = !filters.fuel || car.fuel === filters.fuel;
      const matchesSeats = !filters.seats || 
        (filters.seats === '7+' ? car.seats >= 7 : car.seats.toString() === filters.seats);

      return matchesSearch && matchesCategory && matchesPrice && 
             matchesTransmission && matchesFuel && matchesSeats;
    });
    
    setFilteredCars(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 300],
      transmission: '',
      fuel: '',
      seats: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Cars</h2>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span>Filters</span>
          <Filter className="h-4 w-4" />
        </button>
      </div>
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <input
                type="range"
                min="0"
                max="300"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                $0 - ${filters.priceRange[1]}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {transmissions.map(transmission => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                value={filters.fuel}
                onChange={(e) => handleFilterChange('fuel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {fuels.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
              <select
                value={filters.seats}
                onChange={(e) => handleFilterChange('seats', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {seatOptions.map(seat => (
                  <option key={seat} value={seat}>{seat} Seats</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </span>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Cars ({filteredCars.length})
        </h2>
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-600">Loading cars...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <CarCard
                key={car.id}
                car={car}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cars found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CarList;