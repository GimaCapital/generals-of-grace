// src/components/home/AboutSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Globe, TrendingUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

function AboutSection() {
  const { settings } = useSettings();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2 mb-4">
              A Church with a <span className="text-church-gold">Divine Mandate</span>
            </h2>
            <div className="w-20 h-1 bg-church-gold rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {settings?.siteName || 'Generals of Grace Intl Church'} was founded with a divine mandate to raise
              generals of grace who will impact their generation with the love and power of God.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link to="/about" className="inline-flex items-center gap-3 text-church-gold font-semibold hover:gap-4 transition-all group">
                <div>
                  <span className="text-xs text-gray-400 font-normal block group-hover:text-church-gold/70 transition-colors">📖 Discover Our Story</span>
                  <span className="text-base flex items-center gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
              <span className="w-px h-10 bg-church-gold/20 hidden sm:block"></span>
              <Link to="/soul-winning" className="inline-flex items-center gap-3 text-church-gold font-semibold hover:gap-4 transition-all group">
                <div>
                  <span className="text-xs text-gray-400 font-normal block group-hover:text-church-gold/70 transition-colors">❤️ Win Souls for the Kingdom</span>
                  <span className="text-base flex items-center gap-2">
                    Soul Winning
                    <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy text-lg">Our Mission</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✦</span> Reach men with the gospel of Christ.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✦</span> Raise them to fulfil their call in Him.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✦</span> Help them to explore their potentials.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✦</span> Fulfil their purpose in the earth.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy text-lg">Our Vision</h3>
                </div>
                <p className="text-xs text-gray-400 italic mb-3">What we are called to be:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✦</span>
                    <span className="text-amber-500 font-bold">Take the gospel of Christ around the world;</span> every community, cities, campuses and nations.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✦</span>
                    Raise World changers, Influential people, Owners of conglomerates that would shape the world for Jesus.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✦</span>
                    <span className="text-amber-500 font-bold">Build institutions of learning; from primary,</span> secondary and Tertiary; also partner with companies, build industries, and make the world a better place for God's children.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">✦</span>
                    Reach and disciple One Hundred million (100 million) souls till Christ comes.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;