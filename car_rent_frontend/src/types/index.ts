// C:\Users\kebic\OneDrive\Desktop\car_rent_rahim\car_rent_frontend\src\types.ts
export interface Car {
  id: string;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  image: string;
  category: 'Economy' | 'Compact' | 'SUV' | 'Luxury' | 'Sports';
  transmission: 'Manual' | 'Automatic';
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number;
  available: boolean;
  features: string[];
  wilaya: string;
  commune: string;
  rating: number;
  ownerId: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  definitive?: boolean; // Added to track permanent rejection
  createdAt: string;
  updatedAt: string;
  chauffeur: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'owner';
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Booking {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  carId: {
    id: string;
    brand: string;
    carModel: string;
  };
  ownerId: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropoffLocation: string;
  additionalServices: string[];
  paymentMethod: 'credit-card' | 'paypal';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  category: string;
  priceRange: [number, number];
  transmission: string;
  fuel: string;
  seats: string;
}