import React from 'react';
import { Clock, Shield, Headphones, CreditCard, MapPin, Car } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Car className="h-12 w-12 text-blue-600" />,
      title: 'Premium Fleet',
      description: 'Choose from our extensive collection of well-maintained, premium vehicles for every occasion.'
    },
    {
      icon: <Clock className="h-12 w-12 text-emerald-600" />,
      title: '24/7 Availability',
      description: 'Book anytime, anywhere. Our services are available round the clock for your convenience.'
    },
    {
      icon: <Shield className="h-12 w-12 text-orange-600" />,
      title: 'Fully Insured',
      description: 'All our vehicles come with comprehensive insurance coverage for your peace of mind.'
    },
    {
      icon: <Headphones className="h-12 w-12 text-purple-600" />,
      title: 'Customer Support',
      description: 'Dedicated customer support team ready to assist you throughout your rental experience.'
    },
    {
      icon: <CreditCard className="h-12 w-12 text-red-600" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options including credit cards, digital wallets, and installment plans.'
    },
    {
      icon: <MapPin className="h-12 w-12 text-indigo-600" />,
      title: 'Multiple Locations',
      description: 'Convenient pickup and drop-off locations across the city for your flexibility.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive car rental services designed to make your journey 
            comfortable, safe, and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;