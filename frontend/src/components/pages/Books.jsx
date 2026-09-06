import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Heart, Gift, ArrowLeft } from 'lucide-react';

const Books = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Back to Home Link */}
      <div className="container-custom">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-church-gold hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ===== BOOKS SECTION - NEW RELEASE ===== */}
      <section id="birthday-launch" className="py-10 bg-white scroll-mt-20">
        <div className="container-custom">
          {/* 🔥 ATTENTION-GRABBING HEADER */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-12 h-px bg-church-gold/40"></span>
              <span className="text-church-gold font-semibold text-sm uppercase tracking-wider bg-church-gold/10 px-5 py-2 rounded-full border border-church-gold/20">
                🎉 Birthday Launch
              </span>
              <span className="w-12 h-px bg-church-gold/40"></span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-church-navy mt-4 mb-3">
              Powerful Books. <br />
              <span className="text-church-gold">One Life-Changing Day.</span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-church-gold to-amber-400 mx-auto rounded-full"></div>

            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base">
              Pastor Andrew Osalor's long-awaited trilogy is finally here — released on his birthday,
              these three books are designed to equip, empower, and transform your walk with God.
            </p>
          </div>

          {/* 🔥 NEW RELEASE - Birthday Book (Featured) */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-church-gold/30 bg-gradient-to-br from-church-gold/10 via-white to-amber-50/30"
            >
              {/* "NEW RELEASE" Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-300"></span>
                  </span>
                  NEW RELEASE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Book Image */}
                <div className="relative h-80 md:h-auto rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/images/maximize-your-time.jpg"
                    alt="Maximize Your Time - New Release"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-navy/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-church-gold text-church-navy text-xs font-bold px-3 py-1 rounded-full">
                      📖 New Release
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-3 py-1 rounded-full">
                      Book 1
                    </span>
                    <span className="text-red-500 text-xs font-bold uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
                      🔥 Just Launched
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-2">
                    Maximize Your Time
                  </h3>
                  <p className="text-church-gold font-medium mb-4">Redeeming Your Time for Kingdom Impact</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Discover the secrets of redeeming your time for Kingdom impact. Learn how to prioritize what truly matters and make every moment count for eternity. This life-changing book will transform how you view and use your time.
                  </p>

                  {/* Book Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Pages</p>
                      <p className="text-sm font-bold text-church-navy">256</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Format</p>
                      <p className="text-sm font-bold text-church-navy">Paperback</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Release Date</p>
                      <p className="text-sm font-bold text-church-gold">August 2026</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="text-sm font-bold text-church-navy">Christian Living</p>
                    </div>
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/books/maximize-your-time"
                      className="bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      Get Your Copy
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Maximize Your Time',
                            text: 'Check out this amazing book by Pastor Andrew Osalor!',
                            url: window.location.href,
                          });
                        }
                      }}
                      className="border-2 border-church-gold/30 text-church-navy px-8 py-3 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 🔥 ALL THREE BOOKS - SAME LAUNCH DAY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Book 1 - Maximize Your Time */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-church-gold/20 hover:border-church-gold/50"
            >
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-300"></span>
                  </span>
                  NEW
                </span>
              </div>

              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src="/images/maximize-your-time.jpg"
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
                  <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-2 py-0.5 rounded">
                    Book 1
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">256 pages</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-church-navy mb-2 group-hover:text-church-gold transition-colors">
                  Maximize Your Time
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Discover the secrets of redeeming your time for Kingdom impact. Learn how to prioritize what truly matters and make every moment count for eternity.
                </p>
                <Link
                  to="/books/maximize-your-time"
                  className="inline-flex bg-church-gold text-church-navy px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all items-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Get Your Copy
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Book 2 - Soul Winning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-church-gold/20 hover:border-church-gold/50"
            >
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-300"></span>
                  </span>
                  NEW
                </span>
              </div>

              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src="/images/soul.jpg"
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
                  <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-2 py-0.5 rounded">
                    Book 2
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">320 pages</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-church-navy mb-2 group-hover:text-church-gold transition-colors">
                  Soul Winning
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  A practical guide to sharing your faith with boldness and love. Learn how to lead people to Christ and disciple them effectively.
                </p>
                <Link
                  to="/books/soul-winning"
                  className="inline-flex bg-church-gold text-church-navy px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all items-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Get Your Copy
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Book 3 - Relationship */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-church-gold/20 hover:border-church-gold/50"
            >
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-300"></span>
                  </span>
                  NEW
                </span>
              </div>

              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src="/images/relationship-book.jpg"
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
                  <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-2 py-0.5 rounded">
                    Book 3
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">288 pages</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-church-navy mb-2 group-hover:text-church-gold transition-colors">
                  Relationship
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Building healthy, godly relationships that honor God and bless others. Discover the principles for lasting and fulfilling connections.
                </p>
                <Link
                  to="/books/relationship"
                  className="inline-flex bg-church-gold text-church-navy px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all items-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Get Your Copy
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 📅 Birthday Launch Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-church-gold/10 via-white to-church-gold/10 rounded-2xl p-8 md:p-12 border border-church-gold/20 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">🎂</span>
              <span className="text-church-gold font-bold text-sm uppercase tracking-wider">Special Birthday Launch</span>
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-church-navy mb-3">
              All Three Books Released on <span className="text-church-gold">August</span>
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Pastor Andrew Osalor celebrates his birthday by releasing these three powerful books —
              a gift to the body of Christ that will equip, empower, and transform generations.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/books"
                className="bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Get the Trilogy
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="#books-carousel"
                className="border-2 border-church-gold/30 text-church-navy px-8 py-3 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-sm max-w-2xl mx-auto italic">
              "These books are written to equip and empower you for Kingdom impact. Get your copies today and start your journey of transformation."
            </p>
            <p className="text-church-gold font-medium mt-2">— Pastor Andrew Osalor</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Books;