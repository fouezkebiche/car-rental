import React from 'react';
import { Smartphone, Download } from 'lucide-react';

const AppStoreBanner: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-8 w-8 text-blue-300" />
              <span className="text-blue-300 font-semibold text-lg">Download Our App</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Rent Cars on the Go with Our Mobile App
            </h2>
            
            <p className="text-xl text-blue-100 leading-relaxed">
              Experience the convenience of booking your perfect ride anytime, anywhere. 
              Our mobile app offers exclusive features and deals that make car rental 
              easier than ever before.
            </p>

            {/* App Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">App Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <span className="text-blue-100">One-tap booking and instant confirmation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <span className="text-blue-100">Real-time GPS tracking and navigation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <span className="text-blue-100">Exclusive app-only discounts and offers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <span className="text-blue-100">Digital keyless entry and car controls</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <span className="text-blue-100">24/7 customer support via chat</span>
                </li>
              </ul>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#"
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-300">Download on the</span>
                  <span className="text-lg font-semibold">App Store</span>
                </div>
                <Download className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </a>
              
              <a
                href="#"
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-300">Get it on</span>
                  <span className="text-lg font-semibold">Google Play</span>
                </div>
                <Download className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-blue-400/30">
              <div>
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-blue-200">App Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.8/5</div>
                <div className="text-blue-200">App Store Rating</div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-[600px] bg-gray-900 rounded-[50px] p-6 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[40px] overflow-hidden relative">
                {/* Phone Screen Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-600">
                  <div className="p-6 text-white">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Smartphone className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">CarRent App</h3>
                    </div>
                    
                    {/* Mock App Interface */}
                    <div className="space-y-4">
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                          <div>
                            <div className="w-20 h-3 bg-white/60 rounded mb-1"></div>
                            <div className="w-16 h-2 bg-white/40 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                          <div>
                            <div className="w-24 h-3 bg-white/60 rounded mb-1"></div>
                            <div className="w-20 h-2 bg-white/40 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                          <div>
                            <div className="w-18 h-3 bg-white/60 rounded mb-1"></div>
                            <div className="w-14 h-2 bg-white/40 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppStoreBanner;