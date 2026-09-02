// src/components/common/MobileMenu.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, ChevronRight, ChevronDown, Home, Info, Heart, 
  Video, Calendar, Users, Gift, Mail, Church, Target, 
  Share2, Link as LinkIcon, Library,
  BookOpen, FileText, Music, Headphones,
  Smartphone, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function MobileMenu({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSoulWinningClick = (sectionId) => {
    onClose();
    navigate('/soul-winning');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'About',
      icon: <Info className="w-5 h-5" />,
      dropdown: [
        { label: 'About Us', path: '/about' },
        { label: 'Our Beliefs', path: '/about#beliefs' },
        { label: 'Leadership', path: '/about#leadership' },
      ]
    },
    {
      label: 'Soul Winning',
      icon: <Heart className="w-5 h-5" />,
      dropdown: [
        { label: 'Why Soul Winning?', action: 'scroll', section: 'why-soul-winning' },
        { label: 'Benefits', action: 'scroll', section: 'benefits-of-soul-winning' },
        { label: 'Rewards', action: 'scroll', section: 'kingdom-rewards' },
        { label: 'How to Win Souls', action: 'scroll', section: 'how-to-win-souls' },
        { label: 'Testimonies', action: 'scroll', section: 'soul-testimonies' },
        { label: 'Leaderboard', action: 'scroll', section: 'soul-leaderboard' },
        { label: 'Join the Movement', action: 'scroll', section: 'join-movement' },
      ]
    },
    {
      label: 'Media',
      icon: <Video className="w-5 h-5" />,
      dropdown: [
        { label: 'Sermons', path: '/sermons' },
        { label: 'Events', path: '/events' },
        { label: 'Live Stream', path: '/sermons/live' },
      ]
    },
    {
      label: 'Resources',
      icon: <Library className="w-5 h-5" />,
      dropdown: [
        { label: 'Bible Study', path: '/resources/bible-study' },
        { label: 'Books', path: '/resources/books' },
        { label: 'Worship', path: '/resources/worship' },
        { label: 'Podcasts', path: '/resources/podcasts' },
        { label: 'Sermon Notes', path: '/resources/sermon-notes' },
        { label: 'Articles', path: '/resources/articles' },
        { label: 'Videos', path: '/resources/videos' },
        { label: 'Mobile App', path: '/resources/app' },
        { label: 'Downloads', path: '/resources/downloads' },
      ]
    },
    {
      label: 'Ministries',
      icon: <Church className="w-5 h-5" />,
      dropdown: [
        { label: 'Youth', path: '/ministries' },
        { label: 'Worship', path: '/ministries' },
        { label: 'Prayer', path: '/ministries' },
        { label: 'Outreach', path: '/ministries' },
      ]
    },
    {
      label: 'Give',
      path: '/give',
      icon: <Gift className="w-5 h-5" />,
    },
    {
      label: 'Social',
      icon: <Share2 className="w-5 h-5" />,
      dropdown: [
        { label: "Pastor's Social", path: '/pastor-social' },
        { label: "Church Social", path: '/church-social' },
        { label: "Pastor's Linktree", path: 'https://linktr.ee/pastorandrewosalor', icon: <LinkIcon className="w-4 h-4" />, external: true },
        { label: "Church Linktree", path: 'https://linktr.ee/generalsofgrace', icon: <LinkIcon className="w-4 h-4" />, external: true },
        { label: 'Contact Us', path: '/contact' },
      ]
    },
  ];

  const [expandedItems, setExpandedItems] = React.useState({});

  const toggleDropdown = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDropdownItemClick = (item) => {
    if (item.action === 'scroll') {
      handleSoulWinningClick(item.section);
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white lg:hidden">
      {/* Header with Full Brand */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-10 h-10 bg-gradient-to-br from-church-gold to-amber-400 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-display font-bold text-base">GOG</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-church-navy text-base leading-tight">
              Generals of Grace
            </h1>
            <span className="text-[10px] text-church-gold font-medium tracking-wider uppercase">Intl Church</span>
          </div>
        </Link>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
        {navItems.map((item, index) => (
          <div key={index}>
            {item.dropdown ? (
              <div>
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center justify-between w-full py-4 text-gray-700 hover:text-church-gold transition-colors border-b border-gray-100"
                >
                  <span className="flex items-center gap-3 font-semibold text-base">
                    <span className="text-church-gold">{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      expandedItems[index] ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {expandedItems[index] && (
                  <div className="pl-8 py-2 bg-gray-50/50 rounded-lg mb-1">
                    {item.dropdown.map((subItem, subIndex) => (
                      subItem.external ? (
                        <a
                          key={subIndex}
                          href={subItem.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="flex items-center justify-between py-3.5 px-4 text-sm text-gray-600 hover:text-church-gold hover:bg-church-gold/5 rounded-lg transition-colors border-b border-gray-50 group"
                        >
                          <span className="flex items-center gap-3">
                            {subItem.icon && <span className="text-church-gold">{subItem.icon}</span>}
                            {subItem.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">↗</span>
                            {/* Premium ChevronRight with Circle */}
                            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
                            </div>
                          </div>
                        </a>
                      ) : (
                        <button
                          key={subIndex}
                          onClick={() => handleDropdownItemClick(subItem)}
                          className="flex items-center justify-between w-full text-left py-3.5 px-4 text-sm text-gray-600 hover:text-church-gold hover:bg-church-gold/5 rounded-lg transition-colors border-b border-gray-50 group"
                        >
                          <span className="flex items-center gap-3">
                            {subItem.icon && <span className="text-church-gold">{subItem.icon}</span>}
                            {subItem.label}
                          </span>
                          {/* Premium ChevronRight with Circle */}
                          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
                          </div>
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                onClick={onClose}
                className="flex items-center justify-between py-4 text-gray-700 hover:text-church-gold transition-colors border-b border-gray-100 font-semibold text-base group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-church-gold">{item.icon}</span>
                  {item.label}
                </span>
                {/* Premium ChevronRight with Circle */}
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
                </div>
              </Link>
            )}
          </div>
        ))}

        {!currentUser ? (
          <Link
            to="/login"
            onClick={onClose}
            className="block mt-6 py-4 text-center bg-gradient-to-r from-church-gold to-amber-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="block w-full mt-6 py-4 text-center bg-red-600 text-white rounded-xl font-semibold text-base hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            Logout
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-3 text-sm text-gray-600 hover:text-church-gold transition-colors bg-gray-50 rounded-lg group"
            >
              📧 Contact
              <div className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
              </div>
            </Link>
            <Link
              to="/give"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-3 text-sm text-gray-600 hover:text-church-gold transition-colors bg-gray-50 rounded-lg group"
            >
              🎁 Give
              <div className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MobileMenu;