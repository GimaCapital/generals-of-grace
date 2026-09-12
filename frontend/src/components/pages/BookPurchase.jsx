// src/components/pages/BookPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Heart, Share2, ChevronRight,
  Star, ShoppingCart, Gift, X, CheckCircle,
  CreditCard, Wallet, Building, Phone, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI, givingAPI, bookAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

function BookPurchase() {
  const { bookSlug } = useParams();
  const { settings, loading: settingsLoading, paymentProvider: contextProvider } = useSettings();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    message: '',
    cashPaidBy: '',
    cashAmountPaid: 0,
    cashNotes: ''
  });

  // ✅ Use context provider when available
  useEffect(() => {
    if (contextProvider) {
      setPaymentProvider(contextProvider);
      setPaymentMethod(prev => prev || contextProvider);
    }
  }, [contextProvider]);

  // ✅ Refresh provider when modal opens
  useEffect(() => {
    if (showOrderForm) {
      refreshProvider();
    }
  }, [showOrderForm]);

  const refreshProvider = async () => {
    try {
      const response = await givingAPI.getPaymentProvider();
      if (response.data?.success && response.data.provider) {
        setPaymentProvider(response.data.provider);
        setPaymentMethod(prev => prev || response.data.provider);
      }
    } catch (error) {
      // console.error('Error refreshing provider:', error);
    }
  };

  // ✅ Fetch book from database
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookAPI.getBySlug(bookSlug);

        if (response.data.success && response.data.data) {
          const foundBook = response.data.data;
          setBook({
            ...foundBook,
            priceDisplay: `₦${(foundBook.price || 0).toLocaleString()}`,
          });
          setFormData(prev => ({
            ...prev,
            cashAmountPaid: foundBook.price || 0
          }));
        } else {
          setBook(null);
        }
      } catch (error) {
        // console.error('Error fetching book:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (bookSlug) fetchBook();
  }, [bookSlug]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const total = book.price * formData.quantity;

      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: [{
          id: book.id,
          type: 'book',
          title: book.title,
          price: book.price,
          quantity: formData.quantity,
          image: book.image,
          description: book.subtitle
        }],
        paymentMethod: paymentMethod,
        notes: formData.message,
        deliveryMethod: 'pickup',
        ...(paymentMethod === 'cash' && {
          cashPaymentDetails: {
            amountPaid: formData.cashAmountPaid || total,
            paidBy: formData.cashPaidBy || formData.name,
            notes: formData.cashNotes || ''
          }
        })
      };

      const response = await orderAPI.create(orderData);

      if (response.data.success) {
        const orderId = response.data.data.order.id;
        const paymentLink = response.data.data.paymentLink;

        toast.success('🎉 Order placed successfully!');
        setShowOrderForm(false);

        if (paymentMethod !== 'cash' && paymentLink) {
          window.location.href = paymentLink;
        } else {
          window.location.href = `/order-confirmation/${orderId}`;
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold mx-auto" />
          <p className="mt-4 text-gray-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-church-navy">Book Not Found</h2>
          <p className="text-gray-500 mt-2">The book you're looking for doesn't exist.</p>
          <Link to="/books" className="inline-block mt-6 bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const total = book.price * formData.quantity;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to books store
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`h-2 bg-gradient-to-r ${book.color || 'from-amber-500 to-orange-500'}`}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-auto rounded-xl shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=800&fit=crop';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className={`bg-gradient-to-r ${book.color || 'from-amber-500 to-orange-500'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                  New Release
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-3 py-1 rounded-full">
                  {book.category || 'Book'}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{book.pages} pages</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{book.format}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-2">
                {book.title}
              </h1>
              <p className="text-church-gold font-medium mb-4">{book.subtitle}</p>
              <p className="text-sm text-gray-500 mb-2">By <span className="font-medium text-church-navy">{book.author}</span></p>

              <div className="bg-church-gold/10 rounded-xl p-4 mb-4 text-center border border-church-gold/20">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-church-navy">{book.priceDisplay}</p>
              </div>

              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <button
                onClick={() => setShowOrderForm(true)}
                className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now - {book.priceDisplay}
              </button>

              <button
                onClick={handleShare}
                className="mt-3 border-2 border-church-gold/30 text-church-navy px-6 py-2 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Pages</p>
                  <p className="text-sm font-bold text-church-navy">{book.pages}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Format</p>
                  <p className="text-sm font-bold text-church-navy">{book.format}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Release Date</p>
                  <p className="text-sm font-bold text-church-gold">{book.releaseDate || 'Available Now'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-bold text-church-navy">{book.category}</p>
                </div>
              </div>
            </div>
          </div>

          {book.reviews && book.reviews.length > 0 && (
            <div className="border-t border-gray-100 p-8">
              <h3 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-church-gold fill-church-gold" />
                Reviews
              </h3>
              <div className="space-y-4">
                {book.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-church-navy">{review.name}</span>
                      <div className="flex text-church-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-church-gold' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOrderForm(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-church-navy">Order Book</h2>
              <button
                onClick={() => setShowOrderForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <select
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Online - Uses paymentProvider from context */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(paymentProvider)}
                    disabled={!paymentProvider}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${
                      paymentMethod !== 'cash' && paymentMethod === paymentProvider
                        ? 'border-church-gold bg-church-gold/10'
                        : 'border-gray-200 hover:border-church-gold/50'
                    } ${!paymentProvider ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CreditCard className="w-5 h-5 text-church-gold" />
                    <span className="text-sm font-medium capitalize">
                      {paymentProvider || 'Loading...'}
                    </span>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${
                      paymentMethod === 'cash'
                        ? 'border-church-gold bg-church-gold/10'
                        : 'border-gray-200 hover:border-church-gold/50'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-church-gold" />
                    <span className="text-sm font-medium">Cash</span>
                  </button>
                </div>

                {paymentMethod && paymentMethod !== 'cash' && paymentProvider && (
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-church-gold" />
                    Secure payments via{' '}
                    <span className="font-semibold capitalize">{paymentProvider}</span>
                  </p>
                )}
              </div>

              {paymentMethod === 'cash' && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-church-navy">Cash Payment Details</p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount Paid</label>
                    <input
                      type="number"
                      value={formData.cashAmountPaid}
                      onChange={(e) => setFormData({ ...formData, cashAmountPaid: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Paid By</label>
                    <input
                      type="text"
                      value={formData.cashPaidBy}
                      onChange={(e) => setFormData({ ...formData, cashPaidBy: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                      placeholder="Name of person paying"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests..."
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-church-navy">Order Summary</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Book</span>
                  <span>{book.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-church-gold">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting || !paymentMethod}
                className="w-full bg-church-gold text-church-navy py-4 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-church-navy" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    {paymentMethod === 'cash'
                      ? 'Confirm Cash Order'
                      : `Pay with ${paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 'Online'}`
                    }
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default BookPurchase;