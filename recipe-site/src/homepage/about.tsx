import React from 'react';
import { Link } from 'react-router-dom';
import { ExtensionBanner } from '../components/custom/ExtensionBanner';

const About: React.FC = () => {

  return (
    <main className="min-h-screen bg-[#004D40] text-white px-6 lg:px-20">
      <nav className="flex justify-between items-center py-4">
          <Link 
            to="/" 
          >
            <div className="text-2xl font-bold">Lean Green</div>
          </Link>
        <div className="flex items-center space-x-8">
          <Link 
            to="/about" 
            className="text-white hover:text-[#00BFA5] transition-colors"
          >
            About
          </Link>
          <Link to="/login">
            <button className="bg-[#00BFA5] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00A896] transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      <div className="mt-16 md:mt-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Join The 
          <span className="text-[#00BFA5]"> Lean Green Club</span>
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Created during the 2024 TigerHacks, <b className="font-extrabold text-[#00BFA5]">Lean Green</b> helps you make environmentally conscious cooking decisions.
        </p>
        
        <div className="space-y-6 mb-12">
          <p className="text-lg opacity-90">
            Our team of <b className="font-extrabold text-[#00BFA5]">passionate</b> developers and food enthusiasts came together to <b className="font-extrabold text-[#00BFA5]" >tackle</b> the challenge of sustainable cooking. 
            We believe that small changes in our daily cooking <b className="font-extrabold text-[#00BFA5]">habits</b> can make a significant impact on our <b className="font-extrabold text-[#00BFA5]">planet</b>.
          </p>
          <p className="text-lg opacity-90">
            Through our platform and Chrome extension, we help you discover <b className="font-extrabold text-[#00BFA5]">eco-friendly</b> recipes, calculate your cooking carbon <b className="font-extrabold text-[#00BFA5]">footprint</b>, and make informed decisions about ingredient <b className="font-extrabold text-[#00BFA5]">substitutions</b>.
          </p>
        </div>  

        <ExtensionBanner dismissable={false} />
      </div>
    </main>
  );
};

export default About;