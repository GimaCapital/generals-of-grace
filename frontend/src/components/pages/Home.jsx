// src/components/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, Calendar, Users, Heart, ChevronRight, 
  Clock, MapPin, ArrowRight, Church, Cross,
  Shield, BookOpen, Music, Hand, Globe,
  Sparkles, Star, Crown, Target, Flame,
  Quote, MessageSquare, Gift, Award,
  TrendingUp, Zap, Coffee as CoffeeIcon,
  ChevronDown, ChevronLeft
} from 'lucide-react';
import { sermonAPI, eventAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { formatDate, truncateText } from '../../utils';

function Home() {
  const { settings } = useSettings();
  const [featuredSermons, setFeaturedSermons] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev === testimonies.length - 1 ? 0 : prev + 1);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sermonsRes, eventsRes] = await Promise.all([
          sermonAPI.getAll({ limit: 3, featured: true }),
          eventAPI.getAll({ limit: 6 })
        ]);
        
        // console.log('📊 Events data:', eventsRes.data);
        setFeaturedSermons(sermonsRes.data.data || []);
        setAllEvents(eventsRes.data.data || []);
      } catch (error) {
        // console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Core Values - Enhanced with more detail
  const coreValues = [
    { 
      icon: <Cross className="w-6 h-6" />, 
      title: 'Faith', 
      description: 'Unwavering trust in God and His Word',
      scripture: 'Hebrews 11:1',
      color: 'from-amber-400 to-yellow-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600'
    },
    { 
      icon: <Heart className="w-6 h-6" />, 
      title: 'Love', 
      description: 'Loving God and loving others unconditionally',
      scripture: '1 Corinthians 13:13',
      color: 'from-rose-400 to-red-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-600'
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Integrity', 
      description: 'Walking in truth and righteousness',
      scripture: 'Proverbs 10:9',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-600'
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      title: 'Excellence', 
      description: 'Doing everything with excellence for God\'s glory',
      scripture: 'Colossians 3:23',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600'
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: 'Community', 
      description: 'Building a family of believers in unity',
      scripture: 'Acts 2:44-47',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600'
    },
    { 
      icon: <Award className="w-6 h-6" />, 
      title: 'Discipleship', 
      description: 'Raising generals of grace for the Kingdom',
      scripture: 'Matthew 28:19-20',
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600'
    },
  ];

  // Ministries
  const ministries = [
    { icon: <Music className="w-5 h-5" />, title: 'Worship', description: 'Powerful praise and worship' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Bible Study', description: 'Deep study of God\'s Word' },
    { icon: <Users className="w-5 h-5" />, title: 'Youth Ministry', description: 'Raising the next generation' },
    { icon: <Hand className="w-5 h-5" />, title: 'Outreach', description: 'Sharing the Gospel worldwide' },
    { icon: <Heart className="w-5 h-5" />, title: 'Prayer', description: 'Dedicated intercessory prayer' },
    { icon: <Church className="w-5 h-5" />, title: 'Discipleship', description: 'Making disciples for Christ' },
  ];

  // Testimonials
const testimonies = [
  { 
    quote: "This church has transformed my life! The preaching is powerful and the fellowship is like family.", 
    name: "Sister Grace" 
  },
  { 
    quote: "I found Christ here! The love and acceptance I received changed everything.", 
    name: "Brother Emmanuel" 
  },
  { 
    quote: "The teachings have deepened my faith. This is more than a church - it's a family.", 
    name: "Sister Esther" 
  },
  { 
    quote: "My business received a divine turnaround after I joined this church. God is faithful!", 
    name: "Brother Michael" 
  },
  { 
    quote: "The prayer sessions here have brought healing to my family. I'm forever grateful.", 
    name: "Sister Rebecca" 
  },
];

  return (
    <div>
      {/* ==================== HERO SECTION - WITH DRAMATIC ZOOM ==================== */}
<section className="relative min-h-[90vh] flex items-center overflow-hidden">
  {/* Background Image with Dramatic Zoom Animation */}
  <div className="absolute inset-0 overflow-hidden">
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('/images/main_image_2026.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        animation: 'dramaticZoom 18s ease-in-out infinite alternate',
        transform: 'scale(1.05)'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-church-navy/60"></div>
      {/* Gradient overlay for smooth edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-church-navy/80 via-church-navy/40 to-transparent"></div>
    </div>
  </div>
  
  {/* Decorative blur elements */}
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-church-gold/10 rounded-full blur-3xl"></div>
  <div className="absolute top-20 left-20 w-64 h-64 bg-church-gold/5 rounded-full blur-2xl"></div>
  
  <div className="container-custom relative z-10 py-20">
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
        <span className="gradient-text">{settings?.siteName || 'Generals of Grace Intl Church'}</span>
      </h1>
      <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
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

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
    <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Scroll</span>
    <ChevronDown className="w-5 h-5 text-white/30" />
  </div>
</section>

      {/* ==================== STATS SECTION ==================== */}
{/* ==================== STATS SECTION - INFINITE CAROUSEL ==================== */}
<section className="py-16 bg-church-navy relative overflow-hidden">
  {/* Gold accent line at top */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-church-gold/50 to-transparent"></div>
  
  {/* Subtle pattern */}
  <div className="absolute inset-0 opacity-5">
    <div className="w-full h-full" style={{
      backgroundImage: `radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px)`,
      backgroundSize: '30px 30px'
    }}></div>
  </div>

  {/* Animated gradient orbs */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/10 rounded-full blur-3xl" style={{
    animation: 'pulseSlow 6s ease-in-out infinite'
  }}></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-church-gold/5 rounded-full blur-3xl" style={{
    animation: 'pulseSlow 6s ease-in-out infinite 1s'
  }}></div>
  
  <div className="container-custom relative z-10 overflow-hidden">
    {/* Infinite Carousel - Desktop */}
    <div className="hidden md:block">
      <div 
        className="flex"
        style={{
          animation: 'scrollInfinite 20s linear infinite',
          width: 'max-content'
        }}
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
      >
        {/* First set of stats */}
        {[
          { icon: <Users className="w-8 h-8" />, label: 'Members', value: '5,000+' },
          { icon: <Play className="w-8 h-8" />, label: 'Sermons', value: '500+' },
          { icon: <Calendar className="w-8 h-8" />, label: 'Events', value: '10+' },
          { icon: <Heart className="w-8 h-8" />, label: 'Ministries', value: '5+' },
        ].map((stat, index) => (
          <div key={index} className="flex-shrink-0 w-64 text-center px-6 py-4">
            <div className="text-church-gold flex justify-center mb-2">
              <span className="text-4xl">{stat.icon}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
        {/* Duplicate for infinite effect */}
        {[
          { icon: <Users className="w-8 h-8" />, label: 'Members', value: '5,000+' },
          { icon: <Play className="w-8 h-8" />, label: 'Sermons', value: '500+' },
          { icon: <Calendar className="w-8 h-8" />, label: 'Events', value: '10+' },
          { icon: <Heart className="w-8 h-8" />, label: 'Ministries', value: '5+' },
        ].map((stat, index) => (
          <div key={`dup-${index}`} className="flex-shrink-0 w-64 text-center px-6 py-4">
            <div className="text-church-gold flex justify-center mb-2">
              <span className="text-4xl">{stat.icon}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Mobile - Grid Layout */}
    <div className="md:hidden grid grid-cols-2 gap-6">
      {[
        { icon: <Users className="w-8 h-8" />, label: 'Members', value: '5,000+' },
        { icon: <Play className="w-8 h-8" />, label: 'Sermons', value: '500+' },
        { icon: <Calendar className="w-8 h-8" />, label: 'Events', value: '10+' },
        { icon: <Heart className="w-8 h-8" />, label: 'Ministries', value: '5+' },
      ].map((stat, index) => (
        <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group">
          <div className="text-church-gold flex justify-center mb-2 transform group-hover:scale-110 transition-transform duration-300">
            <span className="text-4xl">{stat.icon}</span>
          </div>
          <div className="text-xl font-bold text-white">{stat.value}</div>
          <div className="text-gray-400 text-xs">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>

  {/* Inline keyframes via style tag */}
  <style>{`
    @keyframes scrollInfinite {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
  `}</style>
</section>

      {/* ==================== ABOUT US SECTION ==================== */}
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
              <p className="text-gray-600 leading-relaxed mb-6">
                We are committed to worship, discipleship, and global evangelism, reaching nations with the 
                message of salvation, healing, and deliverance.
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
  
  {/* Separator */}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div className="w-12 h-12 bg-church-gold/10 rounded-xl flex items-center justify-center text-church-gold mb-3 group-hover:scale-110 transition-transform">
                    <Cross className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy">Our Mission</h3>
                  <p className="text-sm text-gray-500 mt-1">Raising generals of grace for Kingdom impact</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy">Global Reach</h3>
                  <p className="text-sm text-gray-500 mt-1">Reaching nations with the Gospel</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy">Our Vision</h3>
                  <p className="text-sm text-gray-500 mt-1">Every member a general of grace</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-church-navy">Discipleship</h3>
                  <p className="text-sm text-gray-500 mt-1">Equipping saints for ministry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* ==================== FEATURED SERMONS ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Featured Sermons</h2>
              <p className="section-subtitle">Powerful messages to strengthen your faith</p>
            </div>
            <Link to="/sermons" className="text-church-gold hover:text-opacity-80 font-medium flex items-center group">
              View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-church-gold"></div>
              <p className="mt-2 text-gray-500">Loading sermons...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSermons.map((sermon) => (
                <div key={sermon.id} className="card group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative pb-[56.25%] bg-gray-200">
                    <img 
                      src={sermon.thumbnailUrl || '/images/sermon-placeholder.jpg'} 
                      alt={sermon.title}
                      className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-church-navy">{truncateText(sermon.title, 30)}</h3>
                    <p className="text-gray-600 text-sm">{sermon.speaker}</p>
                    <p className="text-xs text-gray-400">{formatDate(sermon.date)}</p>
                    <Link 
                      to={`/sermons/${sermon.id}`}
                      className="mt-3 inline-block text-church-gold font-medium text-sm hover:text-opacity-80 group"
                    >
                      Watch Now <ArrowRight className="w-3 h-3 inline-block group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

{/* ==================== CORE VALUES SECTION - PREMIUM (MATCHES HOME) ==================== */}
<section className="py-20 bg-gradient-to-b from-gray-600 via-white to-gray-500 relative overflow-hidden">
  
  {/* Subtle background pattern */}
  <div className="absolute inset-0 opacity-[0.02]">
    <div className="w-full h-full" style={{
      backgroundImage: `radial-gradient(circle at 20% 50%, #C9A84C 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }}></div>
  </div>
  
  {/* Decorative elements */}
  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-church-gold/8 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-church-gold/8 rounded-full blur-3xl"></div>
  
  <div className="container-custom relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* ===== SECTION HEADER - RIGHT ALIGNED ===== */}
    <div className="mb-16 text-right">
      {/* Badge - Square corners, right aligned */}
      <div className="inline-block">
        <span className="text-church-gold font-bold text-sm uppercase tracking-wider bg-church-navy/90 px-6 py-2.5 border-2 border-church-gold/40 shadow-lg shadow-church-gold/10">
          Our Foundation
        </span>
      </div>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mt-4 mb-3">
        Our Core <span className="text-church-gold">Values</span>
      </h2>
      
      <div className="w-24 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full ml-auto"></div>
      
      {/* Quote - Right aligned */}
      <div className="relative max-w-3xl ml-auto mt-6">
        <div className="bg-gradient-to-r from-church-gold/5 via-white to-church-gold/5 rounded-2xl p-6 border border-church-gold/10 shadow-sm">
          {/* Decorative elements - Right aligned */}
          <div className="flex items-center justify-end gap-4 mb-3">
            <span className="w-12 h-px bg-church-gold/40"></span>
            <span className="text-church-gold/50 text-xl font-serif">❧</span>
            <span className="w-12 h-px bg-church-gold/40"></span>
          </div>
          
          {/* Quote */}
          <div className="relative text-right">
            <span className="absolute -top-1 -right-1 text-2xl text-church-gold/20 font-serif">"</span>
            <p className="text-gray-700 text-base italic font-light leading-relaxed px-4 py-1">
              Biblical truths that anchor our souls, guide our walk with Christ, and unite us as one body in Him
            </p>
            <span className="absolute -bottom-1 -left-1 text-2xl text-church-gold/20 font-serif">"</span>
          </div>
          
          {/* Attribution - Right aligned */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <span className="w-10 h-px bg-church-gold/40"></span>
            <span className="text-church-gold/80 text-xs font-semibold tracking-[0.2em] uppercase">
              — Established in Truth —
            </span>
            <span className="w-10 h-px bg-church-gold/40"></span>
          </div>
        </div>
      </div>
    </div>

    {/* ===== VALUES GRID - PREMIUM CARDS ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coreValues.map((value, index) => (
        <div 
          key={index} 
          className="group relative bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-lg hover:shadow-2xl hover:shadow-church-gold/20 transition-all duration-500 hover:-translate-y-3 hover:border-church-gold/40"
        >
          {/* Top accent bar - color coded */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-church-gold to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Premium corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-[2.5px] border-l-[2.5px] border-church-gold/30 group-hover:border-church-gold/80 transition-all duration-500 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-[2.5px] border-r-[2.5px] border-church-gold/30 group-hover:border-church-gold/80 transition-all duration-500 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[2.5px] border-l-[2.5px] border-church-gold/30 group-hover:border-church-gold/80 transition-all duration-500 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[2.5px] border-r-[2.5px] border-church-gold/30 group-hover:border-church-gold/80 transition-all duration-500 rounded-br-xl"></div>
          
          {/* Number indicator - prominent */}
          <div className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-gradient-to-br from-church-gold/30 to-church-gold/10 border-2 border-church-gold/40 flex items-center justify-center text-xs font-bold text-church-gold shadow-md group-hover:bg-church-gold group-hover:border-church-gold group-hover:text-white group-hover:shadow-church-gold/30 transition-all duration-300">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Icon - prominent */}
          <div className="relative w-16 h-16 rounded-2xl bg-church-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:shadow-md">
            <div className="text-church-gold">
              {value.icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-display font-bold text-church-navy mb-2.5 group-hover:text-church-gold transition-colors duration-300">
            {value.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 font-light">
            {value.description}
          </p>
          
          {/* Elegant divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-church-gold/30"></div>
            <span className="text-church-gold/50 text-[10px]">◆</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-church-gold/30"></div>
          </div>
          
          {/* Scripture badge - prominent */}
          <div className="inline-flex items-center gap-2.5 text-xs font-medium text-church-gold bg-church-gold/10 px-4 py-2 rounded-full border border-church-gold/20 group-hover:border-church-gold/50 group-hover:bg-church-gold/20 transition-all duration-300 shadow-sm group-hover:shadow-md">
            <span className="w-1.5 h-1.5 bg-church-gold rounded-full"></span>
            {value.scripture || 'Scripture Reference'}
            <span className="w-px h-3 bg-church-gold/20"></span>
            <span className="text-[10px] text-church-gold/50 font-normal">✦</span>
          </div>
          
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
            boxShadow: 'inset 0 0 60px rgba(201, 168, 76, 0.06)'
          }}></div>
        </div>
      ))}
    </div>
    
    {/* ===== FOOTER QUOTE - CLEAR & VISIBLE (Kept original) ===== */}
    <div className="mt-16 text-center">
      <div className="relative max-w-3xl mx-auto bg-gradient-to-r from-church-gold/5 via-white to-church-gold/5 rounded-2xl p-8 border border-church-gold/10 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-4">
          <span className="w-12 h-px bg-church-gold/40"></span>
          <span className="text-church-gold/50 text-xl font-serif">❧</span>
          <span className="w-12 h-px bg-church-gold/40"></span>
        </div>
        
        {/* Quote */}
        <div className="pt-4">
          <div className="relative">
            <span className="absolute -top-2 -left-2 text-3xl text-church-gold/20 font-serif">"</span>
            <p className="text-gray-700 text-base italic font-light leading-relaxed px-4 py-2">
              These values are not just words — they are the foundation of our faith 
              and the heartbeat of our church.
            </p>
            <span className="absolute -bottom-2 -right-2 text-3xl text-church-gold/20 font-serif">"</span>
          </div>
          
          {/* Attribution */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-10 h-px bg-church-gold/40"></span>
            <span className="text-church-gold/80 text-xs font-semibold tracking-[0.2em] uppercase">
              — Established in Truth —
            </span>
            <span className="w-10 h-px bg-church-gold/40"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ==================== MINISTRIES SECTION ==================== */}
      {/* <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Ministries</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Our <span className="text-church-gold">Ministries</span>
            </h2>
            <p className="text-gray-500 mt-1">Find your place in the body of Christ</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ministries.map((ministry, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 hover:border-church-gold/30 group">
                <div className="w-12 h-12 bg-church-gold/10 rounded-xl flex items-center justify-center text-church-gold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  {ministry.icon}
                </div>
                <h4 className="font-semibold text-church-navy text-sm">{ministry.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ministry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    

      {/* ==================== MINISTRIES SECTION - SALVATION MINISTRIES EXACT MATCH ==================== */}
<section className="py-16 bg-white">
  <div className="container-custom">
    {/* Section Header - LEFT ALIGNED like Salvation Ministries */}
    <div className="mb-12">
      <p className="text-red-600 text-xs md:text-sm font-semibold uppercase tracking-widest">GET INVOLVED</p>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy">
        Ministries
      </h2>
      <p className="text-gray-400 text-xs md:text-sm mt-1">TO LEADING LIGHT</p>
    </div>

    {/* Ministries Grid - Images with overlay text */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Ministry 1 - Leading Lights */}
      <Link to="/ministries/children" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=500&fit=crop&crop=center"
            alt="Leading Lights"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Leading Lights</h3>
            <p className="text-white/80 text-sm">Path to Faith filled with Laughter</p>
          </div>
        </div>
      </Link>

      {/* Ministry 2 - Campus Ministry */}
      <Link to="/ministries/campus" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=500&fit=crop&crop=center"
            alt="Campus Ministry"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Campus Ministry</h3>
            <p className="text-white/80 text-sm">Reaching students with the Gospel</p>
          </div>
        </div>
      </Link>

      {/* Ministry 3 - Worship Ministry */}
      <Link to="/ministries/worship" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=500&fit=crop&crop=center"
            alt="Worship Ministry"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Worship Ministry</h3>
            <p className="text-white/80 text-sm">Leading the church in praise</p>
          </div>
        </div>
      </Link>

      {/* Ministry 4 - Outreach Ministry */}
      <Link to="/ministries/outreach" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=500&fit=crop&crop=center"
            alt="Outreach Ministry"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Outreach Ministry</h3>
            <p className="text-white/80 text-sm">Sharing God's love worldwide</p>
          </div>
        </div>
      </Link>

      {/* Ministry 5 - Prayer Ministry (FIXED) */}
      <Link to="/ministries/prayer" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="/images/prayer.jpg"
            alt="Prayer Ministry"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=600&h=500&fit=crop&crop=center';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Prayer Ministry</h3>
            <p className="text-white/80 text-sm">Dedicated intercessory prayer</p>
          </div>
        </div>
      </Link>

      {/* Ministry 6 - Discipleship Ministry */}
      <Link to="/ministries/discipleship" className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=500&fit=crop&crop=center"
            alt="Discipleship Ministry"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">Discipleship Ministry</h3>
            <p className="text-white/80 text-sm">Making disciples for Christ</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
</section>

      {/* ==================== EVENTS SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Join us in our upcoming services and programs</p>
            </div>
            <Link to="/events" className="text-church-gold hover:text-opacity-80 font-medium flex items-center group">
              View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-church-gold"></div>
              <p className="mt-2 text-gray-500">Loading events...</p>
            </div>
          ) : allEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No events available. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={event.imageUrl || event.thumbnailUrl || '/images/event-placeholder.jpg'} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/images/event-placeholder.jpg'; }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full capitalize ${
                        event.status === 'upcoming' ? 'bg-green-500' : 
                        event.status === 'ongoing' ? 'bg-yellow-500' : 
                        'bg-gray-500'
                      }`}>
                        {event.status || 'Event'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-display font-bold text-church-navy mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.description || 'Join us for this event'}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-church-gold" />
                        <span>{formatDate(event.date)}</span>
                        {event.time && (
                          <>
                            <Clock className="w-4 h-4 text-church-gold ml-2" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-church-gold" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="mt-4 inline-block w-full text-center bg-church-gold text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-church-gold/30"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

         {/* ===== PASTOR'S MESSAGE SECTION ===== */}
            <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
              <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Quote className="w-8 h-8 text-church-gold" />
                      <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Pastor's Heart</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-4">
                      The Heart of <span className="text-church-gold">Soul Winning</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        "Soul winning is not just an assignment—it's the heartbeat of God. Every soul matters to Him, and 
                        every soul you win is a treasure stored in heaven."
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        — Pastor Andrew Osalor
                      </p>
                    </div>
      
                    <div className="mt-6 p-6 bg-church-gold/10 rounded-xl border-l-4 border-church-gold">
                      <p className="text-gray-700 italic leading-relaxed">
                        "The greatest joy in ministry is seeing a soul come to Christ. It's the reward that surpasses 
                        all earthly treasures."
                      </p>
                      <p className="text-sm text-church-gold font-semibold mt-2">— Pastor Andrew Osalor</p>
                    </div>
                  </motion.div>
      
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <img 
                      src="/images/aday.jpg" 
                      alt="Pastor Andrew Osalor"
                      className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-church-gold text-white p-6 rounded-xl shadow-xl max-w-xs">
                      <p className="font-display text-lg font-bold">"Every Soul Counts"</p>
                      <p className="text-sm opacity-90">Pastor Andrew Osalor</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
      
            {/* ===== BOOKS SECTION ===== */}
            <section className="py-20 bg-white">
              <div className="container-custom">
                <div className="text-center mb-16">
                  <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Books</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
                    Books by <span className="text-church-gold">Pastor Osalor</span>
                  </h2>
                  <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                    Life-changing books that will transform your faith, relationships, and understanding of soul winning
                  </p>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Book 1 - Maximize Your Time */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        // src="images/maximize-your-time.jpg" 
                        alt="Maximize Your Time"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-church-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white text-sm leading-relaxed">Learn to redeem your time for God's glory</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-church-gold" />
                        <span className="text-xs text-church-gold font-semibold">Book 1</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-church-navy mb-2">Maximize Your Time</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        Discover the secrets of redeeming your time for Kingdom impact. Learn how to prioritize what truly matters and make every moment count for eternity.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-church-gold font-medium">Paperback • 256 pages</span>
                        <button className="text-church-gold hover:text-church-navy transition-colors text-sm font-semibold flex items-center gap-1">
                          Learn More <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
      
                  {/* Book 2 - Soul Winning */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src="images/soul.jpg" 
                        alt="Soul Winning"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=400&h=500&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-church-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white text-sm leading-relaxed">Master the art of winning souls for Christ</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-church-gold" />
                        <span className="text-xs text-church-gold font-semibold">Book 2</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-church-navy mb-2">Soul Winning</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        A practical guide to sharing your faith with boldness and love. Learn how to lead people to Christ and disciple them effectively.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-church-gold font-medium">Paperback • 320 pages</span>
                        <button className="text-church-gold hover:text-church-navy transition-colors text-sm font-semibold flex items-center gap-1">
                          Learn More <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
      
                  {/* Book 3 - Relationship */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src="images/relationship.jpg" 
                        alt="Relationship"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-church-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white text-sm leading-relaxed">Building godly relationships that honor God</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-church-gold" />
                        <span className="text-xs text-church-gold font-semibold">Book 3</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-church-navy mb-2">Relationship</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        Building healthy, godly relationships that honor God and bless others. Discover the principles for lasting and fulfilling connections.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-church-gold font-medium">Paperback • 288 pages</span>
                        <button className="text-church-gold hover:text-church-navy transition-colors text-sm font-semibold flex items-center gap-1">
                          Learn More <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
      
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                    "These books are written to equip and empower you for Kingdom impact. Get your copies today and start your journey of transformation."
                  </p>
                  <p className="text-church-gold font-medium mt-2">— Pastor Andrew Osalor</p>
                </motion.div>
              </div>
            </section>

      {/* ==================== TESTIMONIES SECTION ====================
      <section className="py-16 bg-gradient-to-br from-amber-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Testimonies</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              What Our <span className="text-church-gold">People Say</span>
            </h2>
            <p className="text-gray-500 mt-1">Real stories of transformation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonies.map((testimony, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:border-church-gold/30 group">
                <div className="flex items-center gap-2 text-church-gold mb-3">
                  <Quote className="w-5 h-5" />
                </div>
                <p className="text-gray-600 italic">"{testimony.quote}"</p>
                <p className="font-semibold text-church-navy mt-4">— {testimony.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ==================== TESTIMONIES SECTION - CAROUSEL ==================== */}
<section className="py-16 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute top-20 right-10 opacity-10">
    <Quote className="w-32 h-32 text-church-gold" />
  </div>
  <div className="absolute bottom-20 left-10 opacity-10">
    <Quote className="w-32 h-32 text-church-gold" />
  </div>
  
  <div className="container-custom">
    <div className="text-start mb-12">
      <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Testimonies</span>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
        What GOD Is <span className="text-church-gold">Doing</span>
      </h2>
      <p className="text-gray-500 mt-1">Real stories of transformation</p>
    </div>

    {/* Carousel Container */}
    <div className="relative max-w-5xl mx-auto">
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonies.map((testimony, index) => (
            <div 
              key={index} 
              className="min-w-full px-4"
            >
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                {/* Quote icon */}
                <div className="flex items-center gap-2 text-church-gold mb-4">
                  <Quote className="w-8 h-8 fill-church-gold/10" />
                  <span className="text-sm font-medium text-church-gold/70">Testimony {index + 1}</span>
                </div>
                
                {/* Quote text */}
                <p className="text-gray-700 text-lg md:text-xl italic leading-relaxed mb-6">
                  "{testimony.quote}"
                </p>
                
                {/* Author info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-church-gold to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                    {testimony.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-church-navy text-lg">{testimony.name}</p>
                    <p className="text-sm text-gray-400">Soul Winner</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentIndex(prev => prev === 0 ? testimonies.length - 1 : prev - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-church-navy hover:text-church-gold transition-all duration-300 z-10 hover:scale-110"
        aria-label="Previous testimony"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={() => setCurrentIndex(prev => prev === testimonies.length - 1 ? 0 : prev + 1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-church-navy hover:text-church-gold transition-all duration-300 z-10 hover:scale-110"
        aria-label="Next testimony"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-10 h-2.5 bg-church-gold' 
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-church-gold/50'
            }`}
            aria-label={`Go to testimony ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>
{/* ==================== GALLERY SECTION - CHURCH IMAGES ==================== */}
<section className="py-16 bg-white relative overflow-hidden">
  {/* Decorative gold accent line */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-church-gold/30 to-transparent"></div>
  
  <div className="container-custom">
    {/* Section Header - RIGHT ALIGNED */}
    <div className="text-end mb-12">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy">
        From Our <span className="text-church-gold">Gallery</span>
      </h2>
      <div className="w-20 h-1 bg-church-gold rounded-full mt-3 ms-auto"></div>
      <p className="text-gray-500 mt-3 max-w-2xl ms-auto">
        Capturing moments of worship, fellowship, and God's goodness in our community
      </p>
    </div>

    {/* Image Grid - 5 Images with proper grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Image 1 */}
      <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        <img 
          src="images/waship.jpg"
          alt="Church worship"
          className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold">Worship Service</p>
        </div>
      </div>

      {/* Image 2 */}
      <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        <img 
          src="images/pastor_pray_for_blink_person.jpg"
          alt="pastor minister healing"
          className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold">Pastor Ministering Healing</p>
        </div>
      </div>

      {/* Image 3 */}
      <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        <img 
          src="images/congregation.jpg"
          alt="congregation"
          className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold">Congregation Worship</p>
        </div>
      </div>

      {/* Image 4 */}
      <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        <img 
          src="images/pastor_need_down.jpg"
          alt="Prayer Ministry"
          className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold">Prayer & Worship</p>
        </div>
      </div>

      {/* Image 5 */}
      <div className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
        <img 
          src="images/pastor_demostraste.jpg"
          alt="pastor demostrate"
          className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold">Demonstrating God's Power</p>
        </div>
      </div>
    </div>

    {/* View More Button - Links to Facebook */}
    <div className="text-center mt-10">
      <a 
        href="https://web.facebook.com/gogintlchurch"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-church-navy to-church-navy/90 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-church-navy/30 transition-all duration-300 hover:-translate-y-1"
      >
        <span>View More Photos</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </div>
  </div>
</section>

      {/* ==================== SOUL WINNING CTA SECTION ==================== */}
      <section className="py-20 bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-church-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-church-gold/5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Flame className="w-5 h-5 text-yellow-400" />
              The Harvest is Plentiful
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              <span className="text-yellow-300">Matthew 9:37</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Win Souls and <br />
              <span className="text-church-gold">Receive Rewards</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Every soul you win brings eternal rewards and unlocks God's abundant blessings in your life.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/soul-winning" 
                className="bg-church-gold text-church-navy px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-2xl hover:shadow-church-gold/30 inline-flex items-center gap-2 text-lg"
              >
                <Heart className="w-5 h-5" />
                Join Soul Winning
              </Link>
              <Link 
                to="/give" 
                className="border-2 border-white/50 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all hover:border-white inline-flex items-center gap-2 text-lg"
              >
                <Gift className="w-5 h-5" />
                Give Online
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-white/40">
              <span>✦ Faith</span>
              <span className="w-px h-4 bg-white/20"></span>
              <span>✦ Hope</span>
              <span className="w-px h-4 bg-white/20"></span>
              <span>✦ Love</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GENERAL CTA SECTION ==================== */}
      <section className="py-20 bg-gradient-to-br from-church-gold/10 via-white to-church-gold/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-church-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-church-navy/5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-church-navy/5 backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-medium text-church-navy mb-6 border border-church-navy/10">
              <Crown className="w-4 h-4 text-church-gold" />
              Your Calling Awaits
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy mb-6 leading-tight">
              Ready to Be a <br />
              <span className="gradient-text">General of Grace?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join us in our mission to raise generals of grace and impact the world for Christ.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-church-navy text-white px-10 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-2xl hover:shadow-church-navy/30 inline-flex items-center gap-2 text-lg"
              >
                <Users className="w-5 h-5" />
                Join Our Church
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-church-navy/30 text-church-navy px-10 py-4 rounded-lg font-semibold hover:bg-church-navy/5 transition-all hover:border-church-navy inline-flex items-center gap-2 text-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-church-navy font-semibold">5,000+</span>
                <span className="text-gray-400">members worldwide</span>
              </div>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-church-navy">
                <Star className="w-4 h-4 text-church-gold fill-church-gold" />
                <span className="font-semibold">4.9</span>
                <span className="text-gray-400">rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CSS ANIMATIONS ==================== */}
      <style>{`
        @keyframes dramaticZoom {
          0% { 
            transform: scale(1) translateX(0) translateY(0); 
          }
          25% { 
            transform: scale(1.05) translateX(-3%) translateY(-2%); 
          }
          50% { 
            transform: scale(1.1) translateX(0%) translateY(0%); 
          }
          75% { 
            transform: scale(1.15) translateX(3%) translateY(2%); 
          }
          100% { 
            transform: scale(1.2) translateX(-2%) translateY(-1%); 
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        
        @keyframes bounceSlow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
