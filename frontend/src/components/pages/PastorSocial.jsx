// src/components/pages/PastorSocial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Youtube, 
  ArrowLeft, User, Quote
} from 'lucide-react';

function PastorSocial() {
  // Pastor's Social Accounts - Only Facebook & YouTube
  const pastorSocials = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-8 h-8" />, 
      url: 'https://www.facebook.com/profile.php?id=100041210169428',
      color: '#1877F2',
      bgColor: 'bg-[#1877F2]',
      hoverBg: 'hover:bg-[#1877F2]',
      handle: '@PastorAndrewOsalor',
      description: 'Follow for daily inspiration and updates'
    },
    { 
      name: 'YouTube', 
      icon: <Youtube className="w-8 h-8" />, 
      url: 'https://youtube.com/@gogglobaltv?si=dB3QXgG3n_G0Z3vx',
      color: '#FF0000',
      bgColor: 'bg-[#FF0000]',
      hoverBg: 'hover:bg-[#FF0000]',
      handle: 'Pastor Andrew Osalor',
      description: 'Watch sermons, teachings and more'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-church-gold transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="inline-flex items-center gap-2 bg-church-gold/10 px-4 py-2 rounded-full text-church-gold text-sm font-semibold mb-4">
            <User className="w-4 h-4" />
            Connect With Pastor
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-church-navy">
            Pastor Andrew Osalor
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Follow Pastor Andrew on social media for daily inspiration, teachings, and updates
          </p>
        </div>

        {/* Pastor Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-church-navy to-church-gold p-6 text-center">
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg overflow-hidden">
              <img 
                src="images/aday.jpg" 
                alt="Pastor Andrew Osalor"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face';
                }}
              />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mt-4">Pastor Andrew Osalor</h2>
            <p className="text-church-gold font-medium">Founder & Lead Pastor</p>
            <p className="text-white/70 text-sm mt-1">"Raising Generals of Grace"</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm justify-center mb-4">
              <Quote className="w-4 h-4 text-church-gold" />
              <span>Follow me for daily encouragement and biblical insights</span>
            </div>
          </div>
        </div>

        {/* Social Links Grid - 2 Columns for 2 Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastorSocials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white ${social.bgColor} group-hover:scale-110 transition-transform shadow-lg`}>
                {social.icon}
              </div>
              
              {/* Info */}
              <div className="text-center">
                <p className="font-display font-bold text-church-navy text-xl mb-1">{social.name}</p>
                <p className="text-sm text-church-gold font-medium mb-2">{social.handle}</p>
                <p className="text-xs text-gray-500">{social.description}</p>
              </div>

              {/* Follow Button */}
              <div className={`mt-2 px-6 py-2 rounded-full text-white text-sm font-semibold ${social.bgColor} group-hover:scale-105 transition-transform`}>
                Follow →
              </div>
            </a>
          ))}
        </div>

        {/* Bible Verse */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm italic">"The Lord is my shepherd; I shall not want."</p>
          <p className="text-church-gold text-xs font-semibold mt-1">— Psalm 23:1</p>
        </div>
      </div>
    </div>
  );
}

export default PastorSocial;