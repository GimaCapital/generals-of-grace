// src/components/layouts/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  Menu, User, LogOut, ChevronDown, 
  Home, Info, Heart, Video, Calendar, 
  Users, Gift, Mail, Church, Target,
  ChevronRight, Sparkles, Crown, Shield,
  Share2, Link as LinkIcon, Library,
  BookOpen, FileText, Music, Headphones,
  Smartphone, Download
} from 'lucide-react';

function Header({ onMenuToggle }) {
  const { currentUser, userProfile, logout } = useAuth();
  const { settings, loading } = useSettings();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const dropdownTimeoutRef = useRef(null);

  // Detect scroll direction for navigation only
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide navigation when scrolling down AND past 100px
      // AND no dropdown is open
      if (currentScrollY > lastScrollY && currentScrollY > 100 && openDropdown === null) {
        if (isNavVisible) {
          setIsNavVisible(false);
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navigation
        if (!isNavVisible) {
          setIsNavVisible(true);
        }
      } else if (currentScrollY < 50) {
        // At the very top - always show
        if (!isNavVisible) {
          setIsNavVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isNavVisible, openDropdown]);

  useEffect(() => {
    // console.log('📦 Header - Settings:', settings);
    // console.log('📦 Header - Loading:', loading);
  }, [settings, loading]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Function to handle smooth scroll to section
  const handleSoulWinningClick = (sectionId) => {
    setOpenDropdown(null);
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

  // Navigation structure
  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: 'About',
      icon: <Info className="w-4 h-4" />,
      dropdown: [
        { label: 'About Us', path: '/about' },
        { label: 'Our Beliefs', path: '/about#beliefs' },
        { label: 'Leadership', path: '/about#leadership' },
      ]
    },
    {
      label: 'Soul',
      icon: <Heart className="w-4 h-4" />,
      dropdown: [
         { label: 'Soul Winning?', action: 'scroll', section: '/soul-winning' },
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
      icon: <Video className="w-4 h-4" />,
      dropdown: [
        { label: 'Sermons', path: '/sermons' },
        { label: 'Events', path: '/events' },
        { label: 'Live Stream', path: '/sermons/live' },
      ]
    },
    {
      label: 'Resources',
      icon: <Library className="w-4 h-4" />,
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
      icon: <Church className="w-4 h-4" />,
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
      icon: <Gift className="w-4 h-4" />,
    },
    {
      label: 'Social',
      icon: <Share2 className="w-4 h-4" />,
      dropdown: [
        { label: "Pastor's Social", path: '/pastor-social' },
        { label: "Church Social", path: '/church-social' },
        { label: "Pastor's Linktree", path: 'https://linktr.ee/pastorandrewosalor', icon: <LinkIcon className="w-4 h-4" />, external: true },
        { label: "Church Linktree", path: 'https://linktr.ee/generalsofgrace', icon: <LinkIcon className="w-4 h-4" />, external: true },
        { label: 'Contact Us', path: '/contact' },
      ]
    },
  ];

  const toggleDropdown = (index) => {
    // Clear any pending timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    
    // Toggle dropdown
    const newState = openDropdown === index ? null : index;
    setOpenDropdown(newState);
    
    // When opening dropdown, ensure nav is visible
    if (newState !== null) {
      setIsNavVisible(true);
    }
  };

  const handleDropdownItemClick = (item) => {
    if (item.action === 'scroll') {
      handleSoulWinningClick(item.section);
    } else if (item.path) {
      navigate(item.path);
      setOpenDropdown(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown !== null) {
        const dropdowns = document.querySelectorAll('.dropdown-container');
        let isInside = false;
        dropdowns.forEach((dropdown) => {
          if (dropdown.contains(event.target)) {
            isInside = true;
          }
        });
        if (!isInside) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Calculate header height for spacing
  const getHeaderHeight = () => {
    // When nav is visible: top row (64-80px) + nav row (56px) = 120-136px
    // When nav is hidden: top row only (64-80px)
    return isNavVisible || openDropdown !== null ? '136px' : '80px';
  };

  return (
    <>
      {/* Spacer to push content down - matches header height */}
      <div 
        className="hidden lg:block"
        style={{ height: getHeaderHeight() }}
      />
      <div 
        className="block lg:hidden"
        style={{ height: '64px' }}
      />

      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container-custom">
          {/* ===== TOP ROW - ALWAYS STATIC ===== */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - ALWAYS VISIBLE */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-church-gold to-amber-400 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                {/* <span className="text-white font-display font-bold text-base md:text-xl">GOG</span> */}
                <img 
                  // src="images/general_grace_logo.jpg"
                  //  src="images/general_grace_logo.jpg"
                  src="images/gog-new-logo.png"
                  alt="church logo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=600&h=500&fit=crop&crop=center';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-church-navy text-base md:text-lg leading-tight">
                  Generals of Grace
                </h1>
                <span className="text-[10px] md:text-xs text-church-gold font-medium tracking-wider uppercase">Intl Church</span>
              </div>
            </Link>

            {/* User Actions - ALWAYS VISIBLE */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-church-gold to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userProfile?.displayName?.[0] || currentUser.email?.[0] || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-sm text-church-navy">{userProfile?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-church-gold/5 hover:text-church-gold transition-colors flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      {userProfile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-church-gold/5 hover:text-church-gold transition-colors flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-church-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* ===== BOTTOM ROW - Navigation Links ===== */}
          <div 
            className={`hidden lg:flex items-center justify-center space-x-1 transition-all duration-500 ease-in-out ${
              isNavVisible || openDropdown !== null
                ? 'max-h-20 opacity-100 py-3' 
                : 'max-h-0 opacity-0 py-0 overflow-hidden'
            }`}
          >
            {navItems.map((item, index) => (
              <div key={index} className="relative dropdown-container">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-church-gold hover:bg-gray-50 transition-all ${
                        openDropdown === index ? 'text-church-gold bg-gray-50' : ''
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdown === index && (
                      <div 
                        className="absolute top-full left-0 mt-1 min-w-[220px] bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50"
                      >
                        {item.dropdown.map((subItem, subIndex) => (
                          subItem.external ? (
                            <a
                              key={subIndex}
                              href={subItem.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-church-gold/5 hover:text-church-gold transition-colors group"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="flex items-center gap-2">
                                {subItem.icon && <span className="text-church-gold">{subItem.icon}</span>}
                                {subItem.label}
                              </span>
                              <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
                              </div>
                            </a>
                          ) : (
                            <button
                              key={subIndex}
                              onClick={() => handleDropdownItemClick(subItem)}
                              className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-church-gold/5 hover:text-church-gold transition-colors group"
                            >
                              <span className="flex items-center gap-2">
                                {subItem.icon && <span className="text-church-gold">{subItem.icon}</span>}
                                {subItem.label}
                              </span>
                              <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-church-gold transition-all duration-300" />
                              </div>
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:text-church-gold hover:bg-gray-50 transition-all"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;