// src/components/home/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

function HeroSection() {
  const { settings } = useSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/main_image_2026.jpg"
          alt="Generals of Grace Church"
          className="w-full h-full object-cover md:object-cover object-center"
          style={{
            animation: 'dramaticZoom 18s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0 bg-church-navy/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy/80 via-church-navy/40 to-transparent"></div>
      </div>

      <div className="container-custom text-center relative z-10 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
            <span className="block text-center text-white text-xl md:text-2xl lg:text-3xl font-medium tracking-wider mb-2">
              Welcome to
            </span>
            <span className="gradient-text">{settings?.siteName || 'Generals of Grace Intl Church'}</span>
            <span className="block text-center text-gray-100 text-base md:text-lg lg:text-xl font-normal tracking-wide mt-2">
              (The Global Home)
            </span>
          </h1>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Link to="/sermons" className="bg-church-gold text-church-navy px-8 py-3.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-church-gold/30 inline-flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Sermons
            </Link>
            <Link to="/give" className="border-2 border-white/50 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all hover:border-white inline-flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Give Online
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5 text-white/30" />
      </div>

      <style>{`
        @keyframes dramaticZoom {
          0%, 100% { transform: scale(1) translateX(0) translateY(0); }
          50% { transform: scale(1.15) translateX(0%) translateY(0%); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #C9A84C, #F5D76E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;