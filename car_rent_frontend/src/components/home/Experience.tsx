import React from 'react';
import { Award, Users, Car, Globe } from 'lucide-react';

const Experience: React.FC = () => {
  const stats = [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      number: '15+',
      label: 'Years of Experience',
      description: 'Serving customers with excellence since 2009'
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      number: '50K+',
      label: 'Happy Customers',
      description: 'Trusted by thousands of satisfied clients'
    },
    {
      icon: <Car className="h-8 w-8 text-orange-600" />,
      number: '500+',
      label: 'Premium Vehicles',
      description: 'Diverse fleet for every need and budget'
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      number: '50+',
      label: 'Locations',
      description: 'Convenient pickup points across the region'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-blue-600 font-semibold text-lg">Our Experience</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Over 15 Years of Excellence in Car Rental Services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Since our establishment in 2009, we've been committed to providing 
                exceptional car rental experiences. Our journey has been marked by 
                continuous growth, innovation, and an unwavering focus on customer satisfaction.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Industry-leading customer satisfaction rates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Competitive pricing with transparent policies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Regular vehicle maintenance and safety checks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">24/7 roadside assistance and customer support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Trusted by Leading Companies and Individuals
            </h3>
            <p className="text-lg text-blue-100 mb-8">
              Our commitment to excellence has earned us recognition as one of the top 
              car rental services in the region. Join thousands of satisfied customers 
              who trust us for their transportation needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold mb-1">98%</div>
                <div className="text-blue-200">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">4.9/5</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">100%</div>
                <div className="text-blue-200">On-Time Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;