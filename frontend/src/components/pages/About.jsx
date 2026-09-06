// src/components/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { 
  Heart, Users, Target, Globe, Church, 
  Cross, Shield, BookOpen, Calendar, 
  Award, Star, Crown, ChevronRight,
  Mail, Phone, MapPin, Clock, Quote,
  ArrowRight, Play, Sparkles, TrendingUp,
  Coffee, Music, Hand, Facebook, Footprints,
  Sun, Moon, Cloud, Flower, Home, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function About() {
  const { settings } = useSettings();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const stats = [
    // { icon: <Users className="w-7 h-7" />, label: 'Members Worldwide', value: '5,000+', color: 'from-blue-600 to-cyan-500' },
    { icon: <Church className="w-7 h-7" />, label: 'Years of Ministry', value: '10+', color: 'from-amber-600 to-yellow-500' },
    { icon: <Cross className="w-7 h-7" />, label: 'Souls Won', value: '1,000+', color: 'from-green-600 to-emerald-500' },
    { icon: <Globe className="w-7 h-7" />, label: 'Nations Reached', value: '1+', color: 'from-purple-600 to-pink-500' },
  ];

  const beliefs = [
    'We believe in one God, the Father Almighty, Maker of heaven and earth',
    'We believe in Jesus Christ, His only Son, our Lord and Savior',
    'We believe in the Holy Spirit, the power and presence of God in our lives',
    'We believe the Bible is the inspired and infallible Word of God',
    'We believe in salvation through faith in Jesus Christ alone',
    'We believe in the power of prayer and the supernatural work of the Holy Spirit',
    'We believe in the Church as the body of Christ on earth',
    'We believe in the second coming of Jesus Christ',
  ];

  // const values = [
  //   { icon: <Heart className="w-6 h-6" />, title: 'Love', description: 'Loving God and loving others unconditionally as Christ loved us', color: 'bg-rose-500' },
  //   { icon: <Shield className="w-6 h-6" />, title: 'Integrity', description: 'Walking in truth and righteousness with unwavering faith', color: 'bg-blue-500' },
  //   { icon: <Target className="w-6 h-6" />, title: 'Excellence', description: 'Doing everything with excellence for God\'s glory and honor', color: 'bg-emerald-500' },
  //   { icon: <Users className="w-6 h-6" />, title: 'Community', description: 'Building a family of believers in unity and love', color: 'bg-purple-500' },
  //   { icon: <Award className="w-6 h-6" />, title: 'Discipleship', description: 'Raising generals of grace for the Kingdom of God', color: 'bg-amber-500' },
  //   { icon: <Sparkles className="w-6 h-6" />, title: 'Impact', description: 'Making a lasting impact for Christ in every generation', color: 'bg-cyan-500' },
  // ];

  const ministries = [
    { icon: <Music className="w-6 h-6" />, title: 'Worship & Music', description: 'Powerful praise and worship that invites God\'s presence' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Bible Study', description: 'Deep study of God\'s Word for spiritual growth' },
    { icon: <Heart className="w-6 h-6" />, title: 'Prayer Warriors', description: 'Dedicated intercessory prayer for the nations' },
    { icon: <Users className="w-6 h-6" />, title: 'Youth Ministry', description: 'Raising the next generation for Christ' },
    { icon: <Hand className="w-6 h-6" />, title: 'Outreach & Missions', description: 'Sharing the Gospel to the ends of the earth' },
    { icon: <Coffee className="w-6 h-6" />, title: 'Fellowship', description: 'Building community through Christian fellowship' },
  ];

  const testimonials = [
    {
      quote: "This church has transformed my life! The preaching is powerful, the worship is heaven, and the fellowship is like family.",
      author: "Sister Grace",
      role: "Member since 2018"
    },
    {
      quote: "I found Christ here! The love and acceptance I received changed everything. Generals of Grace is truly a place of transformation.",
      author: "Brother Emmanuel",
      role: "Member since 2020"
    },
    {
      quote: "The teachings have deepened my faith and walk with God. This is more than a church - it's a family.",
      author: "Sister Esther",
      role: "Member since 2016"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      {/* 🎯 Hero Section - Professional & Captivating */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=1400&q=80')] bg-cover bg-center opacity-15"></div>
          
          {/* Animated Orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 80, 0], y: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-20 right-10 w-96 h-96 bg-church-gold/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -60, 0], y: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          />
          
          {/* Floating Cross */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-32 right-32 text-white/5 hidden xl:block"
          >
            <Cross className="w-48 h-48" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-32 left-32 text-white/5 hidden xl:block"
          >
            <Heart className="w-40 h-40" />
          </motion.div>
        </div>

        <div className="container-custom relative z-10 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/90 text-sm mb-6 border border-white/10"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Since 2017 — Raising Generals of Grace
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight mb-6">
                About{' '}
                <span className="gradient-text">{settings?.siteName || 'Generals of Grace Intl Church'}</span>
              </h1>


              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
                Raising generals of grace for the kingdom of God through worship, 
                discipleship, and global impact.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/sermons"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-church-gold to-amber-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-church-gold/30 hover:shadow-church-gold/50 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Watch Sermons
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    Get in Touch
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="images/gog-new-logo.png"
                  alt="Generals of Grace"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-church-navy/70 to-transparent"></div>
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-church-gold to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">10+ Years of Impact</p>
                        <p className="text-white/60 text-sm">Join our growing community</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-church-gold" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

     {/* Stats Section - Animated */}
<section className="py-16 bg-white relative w-full">
  <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy">Our Impact in Numbers</h2>
      <p className="text-gray-500 mt-2">God's faithfulness through the years</p>
    </motion.div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          className="group relative"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-all duration-500`}></div>
          <div className="relative text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
            <div className={`text-4xl mb-2 text-church-gold group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: index * 0.1 + 0.3 }}
              className="text-3xl md:text-4xl font-bold text-church-navy"
            >
              {stat.value}
            </motion.div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* ==================== ABOUT US SECTION ==================== */}
{/* ==================== ABOUT US & OUR STORY - COMBINED ==================== */}
<section className="py-20 bg-gray-50 relative overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-church-gold/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-church-navy/5 rounded-full blur-3xl"></div>
  
  {/* Subtle pattern overlay */}
  <div className="absolute inset-0 opacity-[0.02]">
    <div className="w-full h-full" style={{
      backgroundImage: `radial-gradient(circle at 20% 50%, #C9A84C 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }}></div>
  </div>

  <div className="container-custom relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - About Text & Story */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-church-gold font-semibold text-sm uppercase tracking-wider bg-church-gold/10 px-4 py-2 rounded-full border border-church-gold/20 inline-block mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2 mb-4">
            A Church with a <br />
            <span className="text-church-gold">Divine Mandate</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>
          
          <p className="text-gray-600 leading-relaxed mb-4 text-lg">
            {settings?.siteName || 'Generals of Grace Intl Church'} was founded with a divine mandate to raise
            generals of grace who will impact their generation with the love and power of God.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 text-lg">
            We are committed to worship, discipleship, and global evangelism, reaching nations with the
            message of salvation, healing, and deliverance.
          </p>
          
          {/* Story Section - Integrated */}
          <div className="mt-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-display font-bold text-church-navy mb-3 flex items-center gap-2">
              <span className="text-church-gold">📖</span> Our Journey
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-3">
              Founded in 2017 with a small group of believers passionate about seeing lives transformed 
              by the power of God.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              From humble beginnings, God has grown our ministry into a global movement, reaching nations 
              and transforming communities worldwide.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-church-gold/10 text-church-navy text-xs font-medium px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                Founded 2017
              </span>
              <span className="inline-flex items-center gap-1.5 bg-church-gold/10 text-church-navy text-xs font-medium px-3 py-1.5 rounded-full">
                <Globe className="w-3.5 h-3.5" />
                Global Reach
              </span>
              <span className="inline-flex items-center gap-1.5 bg-church-gold/10 text-church-navy text-xs font-medium px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" />
                10+ Years
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-6">
            <Link to="/about" className="group inline-flex items-center gap-2 bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/soul-winning" className="group inline-flex items-center gap-2 text-church-navy font-semibold hover:text-church-gold transition-colors">
              <Heart className="w-5 h-5 text-church-gold" />
              <span>Soul Winning</span>
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Image + Mission & Vision Cards */}
      <div className="space-y-6">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src="images/gog-new-logo.png"
            alt="Generals of Grace Church"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-church-navy/50 to-transparent"></div>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-church-gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-church-navy text-lg">Our Mission</h3>
            </div>
            
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full mb-4"></div>
            
            <ul className="space-y-3">
              {[
                'Reach men with the gospel of Christ.',
                'Raise them to fulfil their call in Him.',
                'Help them to explore their potentials.',
                'Fulfil their purpose in the earth.'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 group/item hover:pl-1 transition-all duration-300">
                  <span className="text-amber-500 font-bold text-lg mt-0.5 flex-shrink-0">✦</span>
                  <span className="text-sm text-gray-600 group-hover/item:text-church-navy transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-church-gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-church-navy text-lg">Our Vision</h3>
            </div>
            
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full mb-4"></div>
            
            <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              What we are called to be:
            </p>
            
            <ul className="space-y-3">
              {[
                'Take the gospel of Christ around the world.',
                'Raise World changers, Influential people.',
                'Build institutions of learning.',
                'Reach and disciple 100 million souls.'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 group/item hover:pl-1 transition-all duration-300">
                  <span className="text-blue-500 font-bold text-lg mt-0.5 flex-shrink-0">✦</span>
                  <span className="text-sm text-gray-600 group-hover/item:text-church-navy transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Main Pastor Section - Enhanced */}
<section className="py-20 bg-gray-50">
  <div className="container-custom">
    <div className="text-center mb-14">
      <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Leadership</span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2">
        Meet Our <span className="text-church-gold">President Pastor</span>
      </h2>
      <p className="text-gray-500 mt-2">Called to lead, equipped to serve</p>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-1 h-[450px] lg:h-auto relative overflow-hidden group">
          <img 
            src="images/aday.jpg"
            alt="Pastor Andrew Osalor"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-church-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="lg:col-span-2 p-8 md:p-12">
          <div className="flex items-center gap-2 text-church-gold mb-3">
            <Quote className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Pastor & President</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-1">
            Pastor Andrew Osalor
          </h3>
          <p className="text-church-gold font-medium mb-5">Founder, Pastor & President</p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            Pastor Andrew Osalor is the Pastor and President of Generals of Grace International Church, 
            a dynamic, global, multifaceted, and generational ministry located in Port Harcourt, Nigeria.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            He is a pastor, teacher, healing minister, and author with an undying passion for souls 
            and to cover the earth with the gospel.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            He holds Miracle Crusades every month which bless and transform the lives of countless 
            people in the city of Port Harcourt and around the world.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Pastor Andrew is happily married and blessed with children.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-4 mt-6"
          >
            <p className="text-sm font-semibold text-church-navy">Connect with Pastor Andrew:</p>
              <Link
                to="/pastor-social"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all"
              >
                Pst Andrew OSALOR
              </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>
</section>


      {/* Our Beliefs - Enhanced */}
      <section className="py-20 bg-church-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-church-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Faith</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-2">
              What We <span className="text-church-gold">Believe</span>
            </h2>
            <p className="text-gray-300 mt-2">The foundational truths of our faith</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {beliefs.map((belief, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-default border border-white/5"
              >
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="text-church-gold flex-shrink-0"
                >
                  <Cross className="w-5 h-5" />
                </motion.div>
                <span className="text-gray-200 text-sm leading-relaxed">{belief}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministries Section - NEW */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Ministries</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2">
              Ways to <span className="text-church-gold">Get Involved</span>
            </h2>
            <p className="text-gray-500 mt-2">Find your place in the body of Christ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-16 h-16 bg-church-gold/10 rounded-2xl flex items-center justify-center text-church-gold mb-5 group-hover:bg-church-gold group-hover:text-white transition-all duration-300">
                  {ministry.icon}
                </div>
                <h4 className="text-xl font-display font-bold text-church-navy mb-2">{ministry.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{ministry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - NEW */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2">
              What Our <span className="text-church-gold">People Say</span>
            </h2>
            <p className="text-gray-500 mt-2">Real stories of transformation</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-10 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-church-gold/10 rounded-full flex items-center justify-center">
                    <Quote className="w-8 h-8 text-church-gold" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div>
                  <p className="font-semibold text-church-navy text-lg">{testimonials[activeTestimonial].author}</p>
                  <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-3 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-church-gold w-10' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-church-navy to-church-gold text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-church-gold rounded-full blur-3xl"
          />
        </div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            Ready to Be a <span className="text-church-gold">General of Grace?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
          >
            Join us in our mission to raise generals of grace and impact the world for Christ.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="bg-white text-church-navy px-8 py-3.5 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2 backdrop-blur-sm"
              >
                Join Our Church
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;