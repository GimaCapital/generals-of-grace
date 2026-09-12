// src/components/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Heart, Gift, ArrowLeft, Loader } from 'lucide-react';
import { bookAPI } from '../../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const [publishedRes, comingSoonRes] = await Promise.all([
        bookAPI.getAll(),
        bookAPI.getAll({ comingSoon: 'true' })
      ]);

      setBooks(publishedRes.data.data || []);
      setComingSoon(comingSoonRes.data.data || []);
    } catch (error) {
      // console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-church-gold animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading books...</p>
        </div>
      </div>
    );
  }

  // ✅ NO BOOKS AVAILABLE STATE
  const hasNoBooks = books.length === 0 && comingSoon.length === 0;

  if (hasNoBooks) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-custom">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-church-gold hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-church-gold/10 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 text-church-gold" />
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-3">
              No Books Available
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>

            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We're preparing something amazing for you. New books will be available soon!
              Check back later for our latest releases.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/"
                className="bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <Link
                to="/contact"
                className="border-2 border-church-gold/30 text-church-navy px-8 py-3 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Get Notified
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="mt-16 flex items-center gap-4 text-sm text-gray-400">
              <span className="w-12 h-px bg-gray-200"></span>
              <span>Coming Soon</span>
              <span className="w-12 h-px bg-gray-200"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get featured book (or first book)
  const featuredBook = books.find(b => b.featured) || books[0];

  // Other published books (excluding featured)
  const otherBooks = books.filter(b => b.id !== featuredBook?.id);

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
          {/* HEADER */}
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

          {/* NEW RELEASE - Featured Book */}
          {featuredBook && (
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-church-gold/30 bg-gradient-to-br from-church-gold/10 via-white to-amber-50/30"
              >
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
                  <div className="relative h-80 md:h-auto rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={featuredBook.image || '/images/book-placeholder.jpg'}
                      alt={featuredBook.title}
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

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-3 py-1 rounded-full">
                        Featured
                      </span>
                      <span className="text-red-500 text-xs font-bold uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
                        🔥 Just Launched
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-2">
                      {featuredBook.title}
                    </h3>
                    <p className="text-church-gold font-medium mb-4">{featuredBook.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {featuredBook.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Pages</p>
                        <p className="text-sm font-bold text-church-navy">{featuredBook.pages}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Format</p>
                        <p className="text-sm font-bold text-church-navy">{featuredBook.format}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-sm font-bold text-church-gold">₦{(featuredBook.price || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="text-sm font-bold text-church-navy">{featuredBook.category}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={`/books/${featuredBook.slug}`}
                        className="bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center gap-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        Get Your Copy
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* OTHER PUBLISHED BOOKS */}
          {otherBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {otherBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                      src={book.image || '/images/book-placeholder.jpg'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-church-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white text-sm leading-relaxed">{book.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-2 py-0.5 rounded">
                        ₦{(book.price || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{book.pages} pages</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-church-navy mb-2 group-hover:text-church-gold transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {book.description}
                    </p>
                    <Link
                      to={`/books/${book.slug}`}
                      className="inline-flex bg-church-gold text-church-navy px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all items-center gap-2 text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      Get Your Copy
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* COMING SOON BOOKS */}
          {comingSoon.length > 0 && (
            <>
              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-6 text-gray-500 text-sm font-medium tracking-wider">
                    ─── COMING SOON ───
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70 mb-16">
                {comingSoon.map((book) => (
                  <div key={book.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 relative">
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                      <span className="bg-amber-500/90 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        ⌛ Coming Soon
                      </span>
                    </div>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={book.image || '/images/book-placeholder.jpg'}
                        alt={book.title}
                        className="w-full h-full object-cover grayscale"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=500&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-5 text-gray-600">
                      <h3 className="text-xl font-display font-bold text-gray-500 mb-1">{book.title}</h3>
                      <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Birthday Launch Announcement */}
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