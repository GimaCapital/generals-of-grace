// src/components/home/BooksSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function BooksSection() {
  return (
    <section className="py-16 bg-church-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-church-gold/50 to-transparent"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-church-gold/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Books</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-2">
            Books by <span className="text-church-gold">Pastor Osalor</span>
          </h2>
          <div className="w-20 h-1 bg-church-gold mx-auto rounded-full mt-3"></div>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Life-changing books that will transform your faith, relationships, and understanding of soul winning
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-20 bg-green-500/30"></div>
            <span className="text-green-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Available Now
            </span>
            <div className="h-px flex-1 max-w-20 bg-green-500/30"></div>
          </div>

          <div className="hidden md:block overflow-hidden relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-r-xl border-l-0 border border-green-500/30">
              <ChevronLeft className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live</span>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-3 py-2 rounded-l-xl border-r-0 border border-green-500/30">
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live</span>
              <ChevronRight className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex" style={{ animation: 'scrollInfinite 25s linear infinite', width: 'max-content' }}>
              {[
                { title: 'Maximize Your Time', slug: 'maximize-your-time', image: '/images/maximize-your-time.jpg', fallbackImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop' },
                { title: 'Relationship', slug: 'relationship', image: '/images/relationship-book.jpg', fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop' },
                { title: 'Soul Winning', slug: 'soul-winning', image: '/images/soul.jpg', fallbackImage: 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=400&h=500&fit=crop' },
              ].map((book, index) => (
                <div key={index} className="flex-shrink-0 w-72 mx-4 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-500/20 hover:border-green-500/50">
                  <div className="relative h-64 overflow-hidden">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = book.fallbackImage; }} loading="lazy" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">● LIVE</div>
                  </div>
                  <div className="p-5 text-white">
                    <h3 className="text-xl font-display font-bold text-white mb-1">{book.title}</h3>
                    <Link to={`/books/${book.slug}`} className="text-church-gold hover:text-white transition-colors text-sm font-semibold flex items-center gap-1 mt-2">Learn More →</Link>
                  </div>
                </div>
              ))}
              {[
                { title: 'Maximize Your Time', slug: 'maximize-your-time', image: '/images/maximize-your-time.jpg', fallbackImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop' },
                { title: 'Relationship', slug: 'relationship', image: '/images/relationship-book.jpg', fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop' },
                { title: 'Soul Winning', slug: 'soul-winning', image: '/images/soul.jpg', fallbackImage: 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=400&h=500&fit=crop' },
              ].map((book, index) => (
                <div key={`dup-${index}`} className="flex-shrink-0 w-72 mx-4 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-500/20 hover:border-green-500/50">
                  <div className="relative h-64 overflow-hidden">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = book.fallbackImage; }} loading="lazy" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">● LIVE</div>
                  </div>
                  <div className="p-5 text-white">
                    <h3 className="text-xl font-display font-bold text-white mb-1">{book.title}</h3>
                    <Link to={`/books/${book.slug}`} className="text-church-gold hover:text-white transition-colors text-sm font-semibol flex items-center gap-1 mt-2">Learn More →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 w-max">
              {[
                { title: 'Maximize Your Time', slug: 'maximize-your-time', image: '/images/maximize-your-time.jpg', fallbackImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop' },
                { title: 'Relationship', slug: 'relationship', image: '/images/relationship-book.jpg', fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop' },
                { title: 'Soul Winning', slug: 'soul-winning', image: '/images/soul.jpg', fallbackImage: 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=400&h=500&fit=crop' },
              ].map((book, index) => (
                <div key={index} className="w-44 flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-green-500/20">
                  <div className="relative h-52 overflow-hidden">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = book.fallbackImage; }} loading="lazy" />
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">LIVE</div>
                  </div>
                  <div className="p-3 text-white">
                    <h4 className="text-sm font-bold truncate">{book.title}</h4>
                    <Link to={`/books/${book.slug}`} className="text-church-gold text-xs font-semibold mt-1 inline-block">Learn More →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center"><span className="bg-church-navy px-6 text-gray-500 text-sm font-medium tracking-wider">─── COMING SOON ───</span></div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
            {[
              { title: 'Faith Unleashed', slug: 'faith-unleashed', image: '/images/faith-unleashed.jpg', fallbackImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=500&fit=crop' },
              { title: 'Kingdom Finances', slug: 'kingdom-finances', image: '/images/kingdom-finances.jpg', fallbackImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop' },
              { title: 'Prayer Warriors', slug: 'prayer-warriors', image: '/images/prayer.jpg', fallbackImage: 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=600&h=500&fit=crop&crop=center' },
            ].map((book, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 relative">
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                  <span className="bg-amber-500/90 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">⌛ Coming Soon</span>
                </div>
                <div className="relative h-64 overflow-hidden">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover grayscale" onError={(e) => { e.target.src = book.fallbackImage; }} loading="lazy" />
                </div>
                <div className="p-5 text-white/70">
                  <h3 className="text-xl font-display font-bold text-white/70 mb-1">{book.title}</h3>
                  <span className="text-gray-500 text-sm font-medium flex items-center gap-1"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/books" className="inline-flex items-center gap-2 bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30">View All Books <ChevronRight className="w-5 h-5" /></Link>
        </div>
      </div>

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
  );
}

export default BooksSection;