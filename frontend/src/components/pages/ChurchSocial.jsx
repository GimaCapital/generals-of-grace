// src/components/pages/ChurchSocial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Youtube, 
  MessageCircle, Mail, Phone, MapPin, 
  Link as LinkIcon, Church, ArrowLeft,
  Share2, Heart, Crown, Sparkles, Globe
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

function ChurchSocial() {
  const { settings } = useSettings();

  // Church's Social Accounts
  const churchSocials = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-6 h-6" />, 
      url: 'https://facebook.com/generalsofgrace',
      color: '#1877F2',
      bgColor: 'bg-[#1877F2]',
      hoverBg: 'hover:bg-[#1877F2]',
      handle: '@GeneralsOfGrace'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="w-6 h-6" />, 
      url: 'https://twitter.com/generalsofgrace',
      color: '#1DA1F2',
      bgColor: 'bg-[#1DA1F2]',
      hoverBg: 'hover:bg-[#1DA1F2]',
      handle: '@GeneralsOfGrace'
    },
    { 
      name: 'Instagram', 
      icon: <Instagram className="w-6 h-6" />, 
      url: 'https://instagram.com/generalsofgrace',
      color: '#E4405F',
      bgColor: 'bg-gradient-to-r from-[#E4405F] to-[#F58529]',
      hoverBg: 'hover:bg-[#E4405F]',
      handle: '@GeneralsOfGrace'
    },
    { 
      name: 'YouTube', 
      icon: <Youtube className="w-6 h-6" />, 
      url: 'https://youtube.com/@generalsofgrace',
      color: '#FF0000',
      bgColor: 'bg-[#FF0000]',
      hoverBg: 'hover:bg-[#FF0000]',
      handle: 'Generals of Grace'
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
      url: 'https://linktr.ee/generalsofgrace',
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
            <Church className="w-4 h-4" />
            Connect With Our Church
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-church-navy">
            {settings?.siteName || 'Generals of Grace'}
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Stay connected with our church community through social media
          </p>
        </div>

        {/* Church Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-church-navy to-church-gold p-6 text-center">
            <div className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg overflow-hidden bg-church-gold flex items-center justify-center">
              <span className="text-5xl font-display font-bold text-white">GOG</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mt-4">{settings?.siteName || 'Generals of Grace'}</h2>
            <p className="text-church-gold font-medium">Intl Church</p>
            <p className="text-white/70 text-sm mt-1">"Raising Generals of Grace"</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-church-gold" />
                123 Church Road, Port Harcourt
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-church-gold" />
                info@generalsofgrace.org
              </span>
            </div>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {churchSocials.map((social, index) => (
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

        {/* Service Times */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-display font-bold text-church-navy text-center mb-4">Service Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Sunday</p>
              <p className="font-semibold text-church-navy">8:00 AM & 10:00 AM</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Wednesday</p>
              <p className="font-semibold text-church-navy">6:00 PM</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-400">Friday</p>
              <p className="font-semibold text-church-navy">6:00 PM (Prayer)</p>
            </div>
          </div>
        </div>

        {/* Bible Verse */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm italic">"Go therefore and make disciples of all nations..."</p>
          <p className="text-church-gold text-xs font-semibold mt-1">— Matthew 28:19</p>
        </div>
      </div>
    </div>
  );
}

export default ChurchSocial;