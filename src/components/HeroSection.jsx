import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-gradient py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to BuyIn
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Your trusted online shopping destination in Bangladesh
          </p>
          <div className="space-x-4">
            <Link to="/?category=Electronics" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Shop Electronics
            </Link>
            <Link to="/?category=Fashion" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
              Browse Fashion
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;