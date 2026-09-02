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
  Coffee, Music, Hand, Footprints,
  Sun, Moon, Cloud, Flower, Home, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function About() {
  const { settings } = useSettings();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const stats = [
    { icon: <Users className="w-7 h-7" />, label: 'Members Worldwide', value: '5,000+', color: 'from-blue-600 to-cyan-500' },
    { icon: <Church className="w-7 h-7" />, label: 'Years of Ministry', value: '12+', color: 'from-amber-600 to-yellow-500' },
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
                Since 2016 — Raising Generals of Grace
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
                  src="images/general_grace_logo.jpg"
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
                        <p className="text-white font-semibold text-lg">12+ Years of Impact</p>
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
      <section className="py-16 bg-white relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy">Our Impact in Numbers</h2>
            <p className="text-gray-500 mt-2">God's faithfulness through the years</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

      {/* Our Story - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2 mb-4">
                A Journey of <span className="text-church-gold">Faith</span> and <span className="text-church-gold">Impact</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-8"></div>
              
              <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                {settings?.siteName || 'Generals of Grace Intl Church'} was founded in 2016 with a divine mandate 
                to raise generals of grace who will impact their generation with the love and power of God.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                From humble beginnings, God has grown our ministry into a global movement reaching nations 
                with the message of salvation, healing, and deliverance. We are committed to making disciples 
                of all nations and establishing the Kingdom of God here on earth.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to fulfill our vision of raising generals of grace who will lead, serve, 
                and transform their communities and nations for Christ.
              </p>

              <motion.div
                whileHover={{ x: 5 }}
                className="mt-8 inline-flex items-center gap-2 text-church-gold font-semibold"
              >
                <Link to="/contact">Learn More About Us</Link>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="images/general_grace_logo.jpg"
                  alt="Church gathering"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-church-navy/50 to-transparent"></div>
              </div>
              
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-gradient-to-br from-church-gold to-amber-500 text-white p-6 rounded-xl shadow-2xl max-w-xs"
              >
                <p className="font-display text-2xl font-bold">12+ Years</p>
                <p className="text-sm opacity-90">Serving God's people globally</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-church-navy to-church-navy/95 text-white p-10 rounded-2xl shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-church-gold/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-church-gold/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-church-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Our Mission</h3>
                    <p className="text-church-gold text-sm">What We Do</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  To raise generals of grace who will impact their generation with the love 
                  and power of God through worship, discipleship, and global evangelism.
                </p>
                <div className="mt-6 flex items-center gap-2 text-church-gold group-hover:gap-4 transition-all">
                  <span className="text-sm font-medium">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-church-gold to-amber-500 text-white p-10 rounded-2xl shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Our Vision</h3>
                    <p className="text-white/80 text-sm">Where We're Going</p>
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">
                  To see every member become a general of grace, equipped to serve and 
                  lead in their sphere of influence, impacting nations for Christ.
                </p>
                <div className="mt-6 flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                  <span className="text-sm font-medium">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Pastor Section - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Leadership</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2">
              Meet Our <span className="text-church-gold">Lead Pastor</span>
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
                  <span className="text-sm font-semibold uppercase tracking-wider">Lead Pastor</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-1">
                  Pastor Andrew Osalor
                </h3>
                <p className="text-church-gold font-medium mb-5">Founder & Lead Pastor</p>
                
                <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  Pastor Andrew Osalor is the founder and lead pastor of {settings?.siteName || 'Generals of Grace Intl Church'}. 
                  He is a passionate preacher, teacher, and leader with a burning desire to see souls saved and lives transformed 
                  by the power of the Holy Spirit.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  With over 12 years of ministry experience, Pastor Andrew has preached the Gospel across nations, 
                  impacting thousands with the message of salvation, healing, and deliverance. His teachings are 
                  characterized by deep biblical insight, practical application, and a strong emphasis on the Holy Spirit.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  He is committed to raising generals of grace who will carry the fire of God's presence and 
                  transform their generation.
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-4 mt-6"
                >
                  {[
                    { icon: 'facebook', color: 'hover:bg-[#1877F2]', link: '/pastor-social' },
                    { icon: 'twitter', color: 'hover:bg-[#1DA1F2]', link: '/pastor-social' },
                    { icon: 'instagram', color: 'hover:bg-gradient-to-br from-[#E4405F] to-[#F58529]', link: '/pastor-social' },
                    { icon: 'youtube', color: 'hover:bg-[#FF0000]', link: '/pastor-social' },
                  ].map((social, idx) => (
                    <motion.a
                      key={idx}
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      href={social.link}
                      className={`w-11 h-11 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold ${social.color} transition-all duration-300`}
                    >
                      <span className="sr-only">{social.icon}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        {social.icon === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                        {social.icon === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>}
                        {social.icon === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>}
                        {social.icon === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>}
                      </svg>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values - Enhanced */}
      {/* <section className="py-20 bg-white">
  <div className="container-custom">
    <div className="text-center mb-14">
      <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Our Foundation</span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-church-navy mt-2">
        Our Core <span className="text-church-gold">Values</span>
      </h2>
      <p className="text-gray-500 mt-2">The principles that guide everything we do</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {values.map((value, index) => (
        <div
          key={index}
          className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
        >
          <div className="w-16 h-16 bg-church-gold/10 rounded-2xl flex items-center justify-center text-church-gold mb-5 group-hover:bg-church-gold group-hover:text-white transition-colors duration-300">
            {value.icon}
          </div>
          <h4 className="text-xl font-display font-bold text-church-navy mb-2">{value.title}</h4>
          <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
        </div>
      ))}
    </div>
  </div>
</section> */}
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