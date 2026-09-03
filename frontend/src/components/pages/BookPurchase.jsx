// frontend/src/components/pages/BookPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Heart, Share2, ChevronRight, 
  Star, ShoppingCart, Gift, X, CheckCircle,
  CreditCard, Wallet, Building, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../services/api';

function BookPurchase() {
  const { bookSlug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    message: '',
    // Cash payment details
    cashPaidBy: '',
    cashAmountPaid: 0,
    cashNotes: ''
  });

  // Book data
  const booksData = {
    'maximize-your-time': {
      id: 1,
      title: 'Maximize Your Time',
      subtitle: 'Redeeming Your Time for Kingdom Impact',
      slug: 'maximize-your-time',
      image: '/images/maximize-your-time.jpg',
      description: `Discover the secrets of redeeming your time for Kingdom impact. Learn how to prioritize what truly matters and make every moment count for eternity.`,
      pages: 256,
      format: 'Paperback',
      releaseDate: 'August 2026',
      category: 'Christian Living',
      price: 5000,
      priceDisplay: '₦5,000',
      author: 'Pastor Andrew Osalor',
      color: 'from-amber-500 to-orange-500',
      reviews: [
        { name: 'Brother John', rating: 5, comment: 'This book changed my perspective on time completely!' },
        { name: 'Sister Mary', rating: 5, comment: 'Every Christian needs to read this book.' },
      ]
    },
    'soul-winning': {
      id: 2,
      title: 'Soul Winning',
      subtitle: 'Sharing Your Faith with Boldness and Love',
      slug: 'soul-winning',
      image: '/images/soul.jpg',
      description: `A practical guide to sharing your faith with boldness and love. Learn how to lead people to Christ and disciple them effectively.`,
      pages: 320,
      format: 'Paperback',
      releaseDate: 'August 2026',
      category: 'Evangelism',
      price: 6000,
      priceDisplay: '₦6,000',
      author: 'Pastor Andrew Osalor',
      color: 'from-red-500 to-rose-500',
      reviews: [
        { name: 'Pastor David', rating: 5, comment: 'A must-read for every believer!' },
        { name: 'Sister Grace', rating: 5, comment: 'This book gave me boldness to share my faith.' },
      ]
    },
    'relationship': {
      id: 3,
      title: 'Relationship',
      subtitle: 'Building Godly Relationships That Honor God',
      slug: 'relationship',
      image: '/images/relationship-book.jpg',
      description: `Building healthy, godly relationships that honor God and bless others. Discover the principles for lasting and fulfilling connections.`,
      pages: 288,
      format: 'Paperback',
      releaseDate: 'August 2026',
      category: 'Relationships',
      price: 5500,
      priceDisplay: '₦5,500',
      author: 'Pastor Andrew Osalor',
      color: 'from-purple-500 to-pink-500',
      reviews: [
        { name: 'Brother Michael', rating: 5, comment: 'This book saved my marriage!' },
        { name: 'Sister Esther', rating: 5, comment: 'Every couple should read this together.' },
      ]
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundBook = booksData[bookSlug];
      if (foundBook) {
        setBook(foundBook);
        // Set default cash amount
        setFormData(prev => ({
          ...prev,
          cashAmountPaid: foundBook.price
        }));
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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
        toast.success('🎉 Order placed successfully!');
        setShowOrderForm(false);
        
        // If Flutterwave, redirect to payment
        if (paymentMethod === 'flutterwave' && response.data.data.paymentLink) {
          window.location.href = response.data.data.paymentLink;
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          quantity: 1,
          message: '',
          cashPaidBy: '',
          cashAmountPaid: book?.price || 0,
          cashNotes: ''
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold mx-auto"></div>
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
          <Link to="/" className="inline-block mt-6 bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const total = book.price * formData.quantity;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Book Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`h-2 bg-gradient-to-r ${book.color}`}></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
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
                <span className={`bg-gradient-to-r ${book.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                  New Release
                </span>
              </div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-church-gold text-xs font-bold uppercase tracking-wider bg-church-gold/10 px-3 py-1 rounded-full">
                  Book {book.id}
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

              {/* Price */}
              <div className="bg-church-gold/10 rounded-xl p-4 mb-4 text-center border border-church-gold/20">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-church-navy">{book.priceDisplay}</p>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => setShowOrderForm(true)}
                className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now - {book.priceDisplay}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="mt-3 border-2 border-church-gold/30 text-church-navy px-6 py-2 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              {/* Book Details Grid */}
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
                  <p className="text-sm font-bold text-church-gold">{book.releaseDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-bold text-church-navy">{book.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
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
              {/* Customer Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <select
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                >
                  {[1,2,3,4,5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('flutterwave')}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${
                      paymentMethod === 'flutterwave' 
                        ? 'border-church-gold bg-church-gold/10' 
                        : 'border-gray-200 hover:border-church-gold/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-church-gold" />
                    <span className="text-sm font-medium">Online</span>
                  </button>
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
              </div>

              {/* Cash Payment Details */}
              {paymentMethod === 'cash' && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-church-navy">Cash Payment Details</p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount Paid</label>
                    <input
                      type="number"
                      value={formData.cashAmountPaid}
                      onChange={(e) => setFormData({...formData, cashAmountPaid: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Paid By</label>
                    <input
                      type="text"
                      value={formData.cashPaidBy}
                      onChange={(e) => setFormData({...formData, cashPaidBy: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests..."
                />
              </div>

              {/* Order Summary */}
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
                disabled={submitting}
                className="w-full bg-church-gold text-church-navy py-4 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-church-navy"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    {paymentMethod === 'flutterwave' ? 'Pay with Flutterwave' : 'Confirm Cash Order'}
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