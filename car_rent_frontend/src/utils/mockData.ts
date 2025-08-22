import { Car, User, Booking, Testimonial } from '../types';

export const mockCars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 45,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Compact',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    available: true,
    features: ['GPS', 'AC', 'Bluetooth', 'Backup Camera'],
    location: 'Downtown',
    rating: 4.5,
    ownerId: '1'
  },
  {
    id: '2',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    price: 95,
    image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'SUV',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 7,
    available: true,
    features: ['GPS', 'AC', 'Leather Seats', 'Sunroof', 'Premium Sound'],
    location: 'Airport',
    rating: 4.8,
    ownerId: '2'
  },
  {
    id: '3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 75,
    image: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Luxury',
    transmission: 'Automatic',
    fuel: 'Electric',
    seats: 5,
    available: true,
    features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Mobile Connector'],
    location: 'City Center',
    rating: 4.9,
    ownerId: '3'
  },
  {
    id: '4',
    brand: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 35,
    image: 'https://images.pexels.com/photos/1077785/pexels-photo-1077785.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Economy',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 5,
    available: true,
    features: ['GPS', 'AC', 'USB Ports'],
    location: 'Suburbs',
    rating: 4.3,
    ownerId: '4'
  },
  {
    id: '5',
    brand: 'Porsche',
    model: '911',
    year: 2023,
    price: 200,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Sports',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 2,
    available: false,
    features: ['Sport Package', 'Premium Sound', 'Carbon Fiber Interior'],
    location: 'Downtown',
    rating: 5.0,
    ownerId: '5'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8901',
    role: 'customer',
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8902',
    role: 'owner',
    joinDate: '2023-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+1 234 567 8903',
    role: 'admin',
    joinDate: '2022-12-01',
    status: 'active'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    carId: '1',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    totalAmount: 135,
    status: 'confirmed',
    pickupLocation: 'Downtown Office',
    dropoffLocation: 'Airport',
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    userId: '1',
    carId: '2',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    totalAmount: 380,
    status: 'pending',
    pickupLocation: 'Airport',
    dropoffLocation: 'Airport',
    createdAt: '2024-02-25'
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emily Davis',
    location: 'New York, NY',
    rating: 5,
    comment: 'Excellent service! The car was clean, reliable, and the booking process was seamless. Highly recommended!',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'David Miller',
    location: 'Los Angeles, CA',
    rating: 5,
    comment: 'Amazing experience! Great variety of cars and competitive prices. The customer support was outstanding.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Lisa Brown',
    location: 'Chicago, IL',
    rating: 4,
    comment: 'Very satisfied with my rental. The app made everything so easy, and the car exceeded my expectations.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];