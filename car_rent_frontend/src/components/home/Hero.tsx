import React, { useState } from 'react';
import { Calendar, MapPin, Search, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const [searchData, setSearchData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    passengers: '2'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    // Handle search logic here
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      ></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Premium Car Rental
            <span className="block text-blue-300">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover the freedom of the road with our premium fleet. 
            Comfortable, reliable, and affordable car rentals for every journey.
          </p>
        </div>

       

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Premium Cars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
            <div className="text-blue-200">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;