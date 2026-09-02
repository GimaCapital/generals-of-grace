// src/components/layouts/Footer.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart 
} from 'lucide-react';

function Footer() {
  const { settings, loading } = useSettings();
  const currentYear = new Date().getFullYear();

  // ✅ Debug log
  useEffect(() => {
    // console.log('📦 Footer - Settings:', settings);
    // console.log('📦 Footer - Loading:', loading);
  }, [settings, loading]);

  // ✅ Show loading state
  if (loading) {
    return (
      <footer className="bg-church-navy text-white pt-16 pb-8">
        <div className="container-custom text-center">
          <p className="text-gray-300">Loading...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-church-navy text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              {settings?.siteName || 'Generals of Grace Intl Church'}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A place of worship, fellowship, and growth. Raising Generals of Grace Intl Church for the kingdom of God.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-church-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-church-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-church-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-church-gold transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Sermons', path: '/sermons' },
                { label: 'Events', path: '/events' },
                { label: 'Ministries', path: '/ministries' },
                { label: 'Give', path: '/give' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.path}
                    className="text-gray-300 hover:text-church-gold transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ministries</h4>
            <ul className="space-y-2">
              {['Youth Ministry', 'Women\'s Ministry', 'Men\'s Ministry', 'Children\'s Church', 'Worship Team'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/ministries"
                    className="text-gray-300 hover:text-church-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-5 h-5 text-church-gold flex-shrink-0 mt-0.5" />
                <span>{settings?.siteAddress || 'Opp Happy Rolling Junction Alakahia Port Harcourt, Rivers State, Nigeria'}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-5 h-5 text-church-gold flex-shrink-0" />
                <span>{settings?.sitePhone || '+234 800 000 0000'}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-5 h-5 text-church-gold flex-shrink-0" />
                <span>{settings?.siteEmail || 'info@generalsofgrace.org'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} {settings?.siteName || 'Generals of Grace Intl Church'}. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" /> by {settings?.siteName || 'Generals of Grace'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;