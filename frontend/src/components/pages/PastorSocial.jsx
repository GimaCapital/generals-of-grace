// src/components/pages/PastorSocial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Youtube, 
  MessageCircle, Mail, Phone, MapPin, 
  Link as LinkIcon, User, ArrowLeft,
  Share2, Heart, Crown, Sparkles, Quote
} from 'lucide-react';

function PastorSocial() {
  // Pastor's Social Accounts
  const pastorSocials = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-6 h-6" />, 
      url: 'https://facebook.com/pastorandrewosalor',
      color: '#1877F2',
      bgColor: 'bg-[#1877F2]',
      hoverBg: 'hover:bg-[#1877F2]',
      handle: '@PastorAndrewOsalor'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="w-6 h-6" />, 
      url: 'https://twitter.com/pastorandrew',
      color: '#1DA1F2',
      bgColor: 'bg-[#1DA1F2]',
      hoverBg: 'hover:bg-[#1DA1F2]',
      handle: '@PastorAndrew'
    },
    { 
      name: 'Instagram', 
      icon: <Instagram className="w-6 h-6" />, 
      url: 'https://instagram.com/pastorandrewosalor',
      color: '#E4405F',
      bgColor: 'bg-gradient-to-r from-[#E4405F] to-[#F58529]',
      hoverBg: 'hover:bg-[#E4405F]',
      handle: '@PastorAndrewOsalor'
    },
    { 
      name: 'YouTube', 
      icon: <Youtube className="w-6 h-6" />, 
      url: 'https://youtube.com/@pastorandrewosalor',
      color: '#FF0000',
      bgColor: 'bg-[#FF0000]',
      hoverBg: 'hover:bg-[#FF0000]',
      handle: 'Pastor Andrew Osalor'
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle className="w-6 h-6" />, 
      url: 'https://wa.me/2348000000000',
      color: '#25D366',
      bgColor: 'bg-[#25D366]',
      hoverBg: 'hover:bg-[#25D366]',
      handle: '+234 800 000 0000'
    },
    { 
      name: 'Linktree', 
      icon: <LinkIcon className="w-6 h-6" />, 
      url: 'https://linktr.ee/pastorandrewosalor',
      color: '#43E660',
      bgColor: 'bg-[#43E660]',
      hoverBg: 'hover:bg-[#43E660]',
      handle: 'All Links'
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

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pastorSocials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${social.bgColor} group-hover:scale-110 transition-transform shadow-lg`}>
                {social.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-church-navy text-sm">{social.name}</p>
                <p className="text-xs text-gray-400 truncate max-w-[100px]">{social.handle}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-church-gold rounded-full"></div>
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