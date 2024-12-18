import { ExtensionBanner } from 'components/custom/ExtensionBanner';
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {

  return (
    <main className="bg-emerald-700/20 min-h-screen text-white px-6 lg:px-20">
      <nav className="flex justify-between items-center py-4">
        <Link to="/">
          <div className="text-2xl font-bold">Lean Green</div>
        </Link>
        <div className="flex items-center space-x-8">
          <Link 
            to="/about" 
            className="text-white hover:text-emerald-500 transition-colors"
          >
            About
          </Link>
          <Link to="/login">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      <div className="mt-16 md:mt-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          We are Building a
            <span className="text-emerald-500"> Sustainable Kitchen</span>
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-12">
          Committed to ethical recipes and eco-friendly cooking solutions.
        </p>
      </div>
      <ExtensionBanner dismissable={false} />
    </main>
  );
};

export default Homepage;