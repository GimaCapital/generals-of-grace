// src/components/pages/Give.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { givingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Heart, CreditCard, Wallet, CheckCircle, 
  Shield, Lock, Sparkles, ArrowRight, 
  Building, Globe, Users, TrendingUp,
  Church, Crown, Quote, Phone, Mail, MapPin,
  ChevronLeft, ChevronRight, Gift, Star,
  Hand, PiggyBank, DollarSign, Send,
  BookOpen, Coffee, Music, Camera, Pen
} from 'lucide-react';
import { GIVING_TYPES, PRESET_AMOUNTS, formatCurrency } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';

function Give() {
  const { currentUser, userProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('tithe');
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState(false);
  const [customGivingType, setCustomGivingType] = useState('');
  const [showCustomType, setShowCustomType] = useState(false);
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Extended giving types with icons
  const givingTypes = [
    { id: 'tithe', label: 'Tithe', icon: <Heart className="w-6 h-6" />, description: '10% of your income to God' },
    { id: 'offering', label: 'Offering', icon: <Wallet className="w-6 h-6" />, description: 'Freewill offering to God' },
    { id: 'building', label: 'Building Fund', icon: <Building className="w-6 h-6" />, description: 'For church construction' },
    { id: 'mission', label: 'Missions', icon: <Globe className="w-6 h-6" />, description: 'Support missionaries' },
    { id: 'seed', label: 'Seed Offering', icon: <Gift className="w-6 h-6" />, description: 'Special seed for breakthrough' },
    { id: 'thanksgiving', label: 'Thanksgiving', icon: <Star className="w-6 h-6" />, description: 'Thanksgiving offering' },
  ];

  const getIcon = (id) => {
    const found = givingTypes.find(t => t.id === id);
    return found ? found.icon : <Heart className="w-6 h-6" />;
  };

  const getTypeColor = (id) => {
    switch(id) {
      case 'tithe': return 'from-rose-500 to-pink-500';
      case 'offering': return 'from-blue-500 to-cyan-500';
      case 'building': return 'from-amber-500 to-yellow-500';
      case 'mission': return 'from-emerald-500 to-green-500';
      case 'seed': return 'from-purple-500 to-indigo-500';
      case 'thanksgiving': return 'from-orange-500 to-red-500';
      default: return 'from-church-gold to-amber-500';
    }
  };

  const getTypeBg = (id) => {
    switch(id) {
      case 'tithe': return 'bg-rose-50 border-rose-200';
      case 'offering': return 'bg-blue-50 border-blue-200';
      case 'building': return 'bg-amber-50 border-amber-200';
      case 'mission': return 'bg-emerald-50 border-emerald-200';
      case 'seed': return 'bg-purple-50 border-purple-200';
      case 'thanksgiving': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIconColor = (id) => {
    switch(id) {
      case 'tithe': return 'text-rose-500';
      case 'offering': return 'text-blue-500';
      case 'building': return 'text-amber-500';
      case 'mission': return 'text-emerald-500';
      case 'seed': return 'text-purple-500';
      case 'thanksgiving': return 'text-orange-500';
      default: return 'text-church-gold';
    }
  };

  const getImpactStatement = (amount) => {
    const num = parseFloat(amount);
    if (num >= 10000) return "Your generous gift will help fund major Kingdom projects and support our missionaries worldwide! 🌍";
    if (num >= 5000) return "Your gift will support church programs, outreach events, and community impact initiatives! 🙏";
    if (num >= 2000) return "Your giving will help spread the Gospel and support our weekly ministries! ✝️";
    if (num >= 1000) return "Your contribution will help provide resources for our worship services and church operations! 🎵";
    if (num >= 500) return "Your gift will support our community outreach and prayer initiatives! 🤝";
    return "Every seed you sow brings blessing to your life and advances God's Kingdom! 🌱";
  };

  const testimonials = [
    { 
      id: 1,
      quote: "I've been giving faithfully and God has blessed me beyond measure. This church is a true house of God!", 
      name: "Sister Grace", 
      location: "Port Harcourt",
      image: "https://images.unsplash.com/photo-1494790108376-be9c45b7e6b5?w=100&h=100&fit=crop&crop=face"
    },
    { 
      id: 2,
      quote: "Giving to this ministry has transformed my life. I've seen miracles, breakthroughs, and divine provision.", 
      name: "Brother Emmanuel", 
      location: "Lagos",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    { 
      id: 3,
      quote: "The teachings on giving have changed my perspective. I now give with joy, knowing God rewards faithfulness.", 
      name: "Sister Esther", 
      location: "Abuja",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    { 
      id: 4,
      quote: "My business flourished after I started tithing faithfully. God is faithful to His promises!", 
      name: "Brother David", 
      location: "Enugu",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    { 
      id: 5,
      quote: "I've experienced supernatural provision since I became a cheerful giver. God always provides!", 
      name: "Sister Mary", 
      location: "Warri",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    { 
      id: 6,
      quote: "The blessing of giving is not just financial—it's spiritual. My faith has grown tremendously!", 
      name: "Brother Peter", 
      location: "Ibadan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = 380;
        const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
        
        if (scrollContainerRef.current.scrollLeft >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const handlePresetClick = (preset) => {
    setAmount(preset.toString());
    setSelectedPreset(preset);
    setCustomAmount(false);
  };

  const handleCustomAmount = () => {
    setCustomAmount(true);
    setSelectedPreset(null);
  };

  const handleGive = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to give');
      return;
    }

    if (!amount || parseFloat(amount) < 100) {
      toast.error('Please enter a valid amount (minimum ₦100)');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        amount: parseFloat(amount),
        type: type,
        currency: 'NGN'
      };
      
      console.log('📦 Sending payload:', payload);
      
      const response = await givingAPI.initialize(payload);
      console.log('✅ Full response:', response);
      console.log('✅ Response data:', response.data);
      
      const authUrl = response.data?.data?.authorization_url || 
                       response.data?.authorization_url;
      
      if (authUrl) {
        console.log('🔗 Redirecting to:', authUrl);
        window.location.href = authUrl;
      } else {
        console.error('❌ No authorization URL found in response');
        toast.error('Payment link not found. Please try again.');
      }
    } catch (error) {
      console.error('❌ Giving error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Payment initialization failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - With Financial Image */}
      <section className="relative bg-gradient-to-r from-church-gold/10 to-amber-50/30 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-church-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-church-gold/10 px-4 py-2 rounded-full text-church-gold text-sm font-semibold mb-4">
                <Heart className="w-4 h-4 fill-church-gold" />
                Give with Purpose
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy leading-tight mb-4">
                Give Online
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Support the work of the Kingdom and make an eternal impact with your giving.
                Every seed you sow brings blessing to your life and advances God's Kingdom.
              </p>
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Shield className="w-4 h-4 text-church-gold" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Lock className="w-4 h-4 text-church-gold" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CheckCircle className="w-4 h-4 text-church-gold" />
                  <span>Instant Receipt</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop"
                  alt="Giving"
                  className="rounded-xl w-full h-[280px] object-cover"
                />
                <div className="mt-4 text-center">
                  <p className="text-gray-700 text-lg font-display italic">"Give, and it will be given to you."</p>
                  <p className="text-church-gold text-sm font-semibold mt-1">— Luke 6:38</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Financial Icons */}
      <div className="container-custom max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: 'Total Given', value: '₦50M+' },
            { icon: <Users className="w-5 h-5" />, label: 'Lives Impacted', value: '10,000+' },
            { icon: <Globe className="w-5 h-5" />, label: 'Nations Reached', value: '5+' },
            { icon: <Heart className="w-5 h-5" />, label: 'Souls Saved', value: '1,000+' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100"
            >
              <div className="text-church-gold flex justify-center mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-church-navy">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Giving Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              {/* Tithe Number Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Your Tithe Number</p>
                    <p className="text-3xl md:text-4xl font-mono font-bold text-church-navy mt-1">
                      {userProfile?.titheNumber || 'Login to view'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Shield className="w-5 h-5 text-church-gold" />
                    <span>Secure & Encrypted</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <form onSubmit={handleGive}>
                  {/* Giving Type Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Giving Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {givingTypes.map((gt) => (
                        <motion.button
                          key={gt.id}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setType(gt.id);
                            setShowCustomType(false);
                          }}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                            type === gt.id && !showCustomType
                              ? `border-church-gold bg-church-gold/10 shadow-lg shadow-church-gold/20`
                              : 'border-gray-200 hover:border-church-gold/50 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`flex justify-center mb-2 transition-colors ${
                            type === gt.id && !showCustomType ? `text-church-gold` : 'text-gray-400'
                          }`}>
                            {gt.icon}
                          </div>
                          <span className={`text-sm font-medium capitalize ${
                            type === gt.id && !showCustomType ? 'text-church-navy' : 'text-gray-600'
                          }`}>
                            {gt.label}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">{gt.description}</p>
                          {type === gt.id && !showCustomType && (
                            <div className="mt-1 flex justify-center">
                              <div className="w-2 h-2 bg-church-gold rounded-full"></div>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom Giving Type Input */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomType(!showCustomType);
                          if (!showCustomType) setType('custom');
                        }}
                        className={`w-full p-3 rounded-xl border-2 border-dashed transition-all duration-300 ${
                          showCustomType
                            ? 'border-church-gold bg-church-gold/5'
                            : 'border-gray-300 hover:border-church-gold/50 text-gray-500 hover:text-church-navy'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Pen className="w-4 h-4" />
                          {showCustomType ? 'Enter Custom Type' : '+ Add Custom Giving Type'}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showCustomType && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-3"
                          >
                            <input
                              type="text"
                              value={customGivingType}
                              onChange={(e) => {
                                setCustomGivingType(e.target.value);
                                setType('custom');
                              }}
                              placeholder="Enter custom giving type (e.g., 'Healing Offering')"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                            />
                            {customGivingType && (
                              <p className="text-xs text-church-gold mt-1">
                                You are giving: <span className="font-semibold">{customGivingType}</span>
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Amount (₦)
                    </label>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      {PRESET_AMOUNTS.map((preset) => (
                        <motion.button
                          key={preset}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePresetClick(preset)}
                          className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                            selectedPreset === preset && !customAmount
                              ? `bg-gradient-to-r ${getTypeColor(type)} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {formatCurrency(preset)}
                        </motion.button>
                      ))}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCustomAmount}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                          customAmount
                            ? `bg-gradient-to-r ${getTypeColor(type)} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Custom
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {customAmount && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="relative mt-2">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">₦</span>
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                setSelectedPreset(null);
                              }}
                              placeholder="Enter amount"
                              className="w-full pl-10 pr-6 py-4 text-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                              min="100"
                              step="100"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {amount && parseFloat(amount) >= 100 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-4 bg-gradient-to-r from-church-gold/10 to-amber-50 rounded-xl border border-church-gold/20"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-church-gold flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-church-navy">Your Impact</p>
                            <p className="text-sm text-gray-600">{getImpactStatement(amount)}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !amount}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      loading || !amount
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r ${getTypeColor(type)} text-white shadow-lg hover:shadow-xl`
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Proceed to Payment
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      <span>256-bit encrypted</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>PCI compliant</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>100% secure</span>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Why Give */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-display font-bold text-church-navy mb-4">Why Give?</h3>
              <div className="space-y-3">
                {[
                  { icon: <Church className="w-5 h-5 text-church-gold" />, text: 'Support Kingdom work and missions' },
                  { icon: <Users className="w-5 h-5 text-church-gold" />, text: 'Help the poor and needy' },
                  { icon: <Heart className="w-5 h-5 text-church-gold" />, text: 'Spread the Gospel worldwide' },
                  { icon: <Building className="w-5 h-5 text-church-gold" />, text: 'Build and expand the church' },
                  { icon: <Gift className="w-5 h-5 text-church-gold" />, text: 'Sow seeds of blessing' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {item.icon}
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bible Verse */}
            <div className="bg-gradient-to-r from-church-navy to-church-gold text-white rounded-2xl p-6">
              <h4 className="font-display font-bold text-lg mb-2">"Give, and it will be given to you."</h4>
              <p className="text-white/80 text-sm">Luke 6:38</p>
              <p className="text-white/60 text-xs mt-2">Good measure, pressed down, shaken together, running over</p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-semibold text-church-navy mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-church-gold" />
                  <span>+234 800 000 0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-church-gold" />
                  <span>info@generalsofgrace.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-church-gold" />
                  <span>123 Church Road, Port Harcourt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel - Auto Scrolling */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-display font-bold text-church-navy">What People Say</h3>
              <p className="text-gray-500 text-sm">Real testimonies from our members</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ y: -5 }}
                className="min-w-[340px] md:min-w-[380px] bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex-shrink-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-church-gold/20"
                  />
                  <div>
                    <p className="font-semibold text-church-navy">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-church-gold flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-sm italic">"{testimonial.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>

          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>For bank transfers or other giving methods, please contact our finance department.</p>
          <p className="mt-1">"God loves a cheerful giver." — 2 Corinthians 9:7</p>
        </div>
      </div>
    </div>
  );
}

export default Give;