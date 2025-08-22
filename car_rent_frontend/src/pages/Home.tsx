import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Experience from '../components/home/Experience';
import Testimonials from '../components/home/Testimonials';
import AppStoreBanner from '../components/home/AppStoreBanner';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Services />
      <Experience />
      <Testimonials />
      <AppStoreBanner />
    </div>
  );
};

export default Home;