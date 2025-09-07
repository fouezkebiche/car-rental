import React from 'react';
import { Star, Users, Fuel, Settings, MapPin } from 'lucide-react';
import { Car } from '../../types';
import { BASE_API_URL } from '../../config';

interface CarCardProps {
  car: Car;
  onBook?: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  // Construct full image URL
  const imageUrl = car.image.startsWith('http') ? car.image : `${BASE_API_URL}${car.image}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${car.brand} ${car.carModel}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => (e.currentTarget.src = '/default-car.jpg')}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              car.available
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {car.available ? 'Available' : 'Not Available'}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-800">
            {car.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {car.brand} {car.carModel}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{car.year}</span>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{car.wilaya}, {car.commune}</span>
            </div>
            <span
              className={`text-sm font-medium ${
                car.status === 'approved'
                  ? 'text-green-600'
                  : car.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              Status: {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(car.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {car.rating} ({Math.floor(Math.random() * 50) + 10} reviews)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-sm text-gray-600">{car.seats} Seats</span>
          </div>
          <div className="text-center">
            <Settings className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-sm text-gray-600">{car.transmission}</span>
          </div>
          <div className="text-center">
            <Fuel className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <span className="text-sm text-gray-600">{car.fuel}</span>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Features</h4>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Chauffeur: {car.chauffeur ? 'Yes' : 'No'}
          </p>
          {car.rejectionReason && (
            <p className="text-sm text-red-600">
              Rejection Reason: {car.rejectionReason}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${car.price}</span>
            <span className="text-gray-600 text-sm">/day</span>
          </div>
          <button
            onClick={() => onBook?.(car)}
            disabled={!car.available || car.status !== 'approved'}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              car.available && car.status === 'approved'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;