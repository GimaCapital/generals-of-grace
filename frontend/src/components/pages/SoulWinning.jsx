// src/components/pages/SoulWinning.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Users, Share2, Globe, Trophy, Star,
  Crown, Medal, Gift, TrendingUp, CheckCircle,
  Award, Target, Sparkles, Flame, Zap, Rocket,
  GraduationCap, Wallet, Shield, Cross, Church,
  BookOpen, Stethoscope, Building, PiggyBank, Briefcase,
  ChevronRight, ArrowUp, Clock, Calendar, Play,
  Menu, X, Search, LogOut, ChevronDown,
  Diamond, Gem, Crown as CrownIcon, Coffee,
  Lightbulb, BookMarked, School, HeartPulse,
  Star as StarIcon, Quote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';

function SoulWinning() {
  const { currentUser, userProfile } = useAuth();
  const [userStats, setUserStats] = useState({
    soulsWon: 0,
    totalSouls: 0,
    rank: 'Disciple',
    points: 0,
    nextRank: 'Evangelist',
    pointsToNext: 100,
    totalPoints: 0,
    badgeCount: 0,
    financialRewards: 0,
    scholarships: 0
  });
  const [loading, setLoading] = useState(true);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [activeTab, setActiveTab] = useState('rewards');
  const [animateSouls, setAnimateSouls] = useState(false);
  const [referralData, setReferralData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    need: 'spiritual'
  });
  const [soulsList, setSoulsList] = useState([]);
  const { scrollYProgress } = useScroll();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    fetchUserStats();
    fetchSoulsList();
    // Trigger confetti on first load
    setTimeout(() => setShowConfetti(true), 1000);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  useEffect(() => {
    if (inView) {
      setAnimateSouls(true);
    }
  }, [inView]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with API call
      setUserStats({
        soulsWon: 0,
        totalSouls: 0,
        rank: 'Disciple',
        points: 0,
        nextRank: 'Evangelist',
        pointsToNext: 100,
        totalPoints: 0,
        badgeCount: 0,
        financialRewards: 0,
        scholarships: 0
      });
    } catch (error) {
      // console.error('Error fetching soul winning stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSoulsList = async () => {
    try {
      // Fetch list of souls won
    } catch (error) {
      // console.error('Error fetching souls list:', error);
    }
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowConfetti(true);
      toast.success('🎉 Soul won for the Kingdom! God bless you abundantly!');
      setShowReferralForm(false);
      setReferralData({ name: '', email: '', phone: '', message: '', need: 'spiritual' });
      fetchUserStats();
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      toast.error('Error submitting referral');
    }
  };

  // Ranks with icons and colors
  const ranks = [
    { name: 'Disciple', points: 0, icon: <Cross className="w-6 h-6" />, color: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-500' },
    { name: 'Evangelist', points: 100, icon: <Heart className="w-6 h-6" />, color: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-600' },
    { name: 'Harvester', points: 500, icon: <Target className="w-6 h-6" />, color: '#10B981', bg: 'bg-green-100', text: 'text-green-600' },
    { name: 'Kingdom Builder', points: 1000, icon: <Church className="w-6 h-6" />, color: '#F59E0B', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { name: 'General of Grace', points: 5000, icon: <Crown className="w-6 h-6" />, color: '#C9A84C', bg: 'bg-amber-100', text: 'text-amber-600' },
    { name: 'Great Commission', points: 10000, icon: <Rocket className="w-6 h-6" />, color: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-600' },
    { name: 'Legacy Builder', points: 25000, icon: <Flame className="w-6 h-6" />, color: '#EF4444', bg: 'bg-red-100', text: 'text-red-600' },
  ];

  // Rewards data - ENHANCED with more rewards
  const rewards = {
    financial: [
      { souls: 1, reward: '₦10,000 Seed Blessing', description: 'Seed for your business or personal need', icon: <Wallet className="w-5 h-5" /> },
      { souls: 5, reward: '₦50,000 Business Support', description: 'Capital to start or grow your business', icon: <Briefcase className="w-5 h-5" /> },
      { souls: 10, reward: '₦100,000 Kingdom Investment', description: 'Investment in your business or ministry', icon: <Diamond className="w-5 h-5" /> },
      { souls: 25, reward: '₦250,000 Business Expansion', description: 'Scale your business to the next level', icon: <Building className="w-5 h-5" /> },
      { souls: 50, reward: '₦500,000 Financial Freedom', description: 'Debt cancellation & financial breakthrough', icon: <Wallet className="w-5 h-5" /> },
      { souls: 100, reward: '₦1,000,000 Business Empire', description: 'Major business/ministry funding', icon: <Gem className="w-5 h-5" /> },
    ],
    academic: [
      { souls: 1, reward: 'Free BookOpen Study Materials', description: 'Full BookOpen study course materials', icon: <BookOpen className="w-5 h-5" /> },
      { souls: 5, reward: 'BookOpen School Scholarship', description: '3-month certificate program', icon: <GraduationCap className="w-5 h-5" /> },
      { souls: 10, reward: 'Diploma in Theology', description: '1-year diploma program', icon: <GraduationCap className="w-5 h-5" /> },
      { souls: 25, reward: 'Bachelor of Divinity', description: 'Full 4-year degree program', icon: <GraduationCap className="w-5 h-5" /> },
      { souls: 50, reward: "Master's in Ministry", description: 'Advanced theological education', icon: <GraduationCap className="w-5 h-5" /> },
      { souls: 100, reward: 'International Conference Sponsorship', description: 'All-expenses paid conference', icon: <Globe className="w-5 h-5" /> },
    ],
    health: [
      { souls: 1, reward: 'Prayer & Counseling Session', description: 'Professional pastoral counseling', icon: <Heart className="w-5 h-5" /> },
      { souls: 5, reward: 'Health & Wellness Checkup', description: 'Full medical screening', icon: <Stethoscope className="w-5 h-5" /> },
      { souls: 10, reward: 'Health Insurance Coverage', description: '6-month health insurance', icon: <Shield className="w-5 h-5" /> },
      { souls: 25, reward: 'Medical Treatment Support', description: 'Major medical bill assistance', icon: <HeartPulse className="w-5 h-5" /> },
      { souls: 50, reward: 'Full Health Coverage', description: '1-year comprehensive health plan', icon: <Shield className="w-5 h-5" /> },
      { souls: 100, reward: 'Medical Mission Sponsorship', description: 'Sponsor medical missions', icon: <Heart className="w-5 h-5" /> },
    ],
    business: [
      { souls: 1, reward: 'Business Mentorship', description: '1-on-1 business mentoring session', icon: <Briefcase className="w-5 h-5" /> },
      { souls: 5, reward: 'Business Training Workshop', description: 'Full entrepreneurship workshop', icon: <Building className="w-5 h-5" /> },
      { souls: 10, reward: 'Business Start-up Kit', description: 'Office equipment & materials', icon: <Briefcase className="w-5 h-5" /> },
      { souls: 25, reward: 'Business Incubation', description: 'Full business mentorship & funding', icon: <Rocket className="w-5 h-5" /> },
      { souls: 50, reward: 'Business Expansion Fund', description: 'Funds to expand your business', icon: <Diamond className="w-5 h-5" /> },
      { souls: 100, reward: 'Corporate Partnership', description: 'Strategic business partnership', icon: <Gem className="w-5 h-5" /> },
    ]
  };

  // Benefits of Soul Winning
  const benefits = [
    { icon: <Heart className="w-5 h-5" />, title: 'Eternal Rewards', description: 'Treasures stored in heaven that never fade' },
    { icon: <Users className="w-5 h-5" />, title: 'Impact Lives', description: 'Change destinies and bring hope to the lost' },
    { icon: <Wallet className="w-5 h-5" />, title: 'Financial Blessings', description: 'Receive financial rewards and support' },
    { icon: <GraduationCap className="w-5 h-5" />, title: 'Scholarships', description: 'Access to academic sponsorships' },
    { icon: <Shield className="w-5 h-5" />, title: 'Health Coverage', description: 'Medical support and health insurance' },
    { icon: <Briefcase className="w-5 h-5" />, title: 'Business Support', description: 'Start-up capital and mentorship' },
    { icon: <Award className="w-5 h-5" />, title: 'Recognition', description: 'Honored and celebrated in the church' },
    { icon: <Crown className="w-5 h-5" />, title: 'Leadership', description: 'Rise in rank and influence' },
    { icon: <Heart className="w-5 h-5" />, title: 'Spiritual Growth', description: 'Deepen your faith and walk with God' },
    { icon: <Users className="w-5 h-5" />, title: 'Community', description: 'Join a community of soul winners' },
  ];

  // Why Soul Winning - Explanation
  const whySoulWinning = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Its Gods Heart',
      description: 'God desires that none should perish but all come to repentance. Soul winning is the heartbeat of God.',
      scripture: '2 Peter 3:9'
    },
    {
      icon: <Cross className="w-6 h-6" />,
      title: 'The Great Commission',
      description: 'Jesus commanded us to go and make disciples of all nations. It is our primary assignment as believers.',
      scripture: 'Matthew 28:19-20'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Eternal Impact',
      description: 'When you win a soul, you change their eternity. You help someone transition from death to life.',
      scripture: 'John 5:24'
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'Heavenly Rewards',
      description: 'God rewards those who diligently seek Him and win souls. Your labor in the Lord is not in vain.',
      scripture: '1 Corinthians 15:58'
    }
  ];

  // Soul Winning Tips
  const tips = [
    { icon: <Lightbulb className="w-5 h-5" />, title: 'Pray First', description: 'Always start with prayer for boldness and divine appointments' },
    { icon: <Heart className="w-5 h-5" />, title: 'Love Them', description: 'Show genuine love and care, people are drawn to love' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Share Your Testimony', description: 'Your personal testimony is powerful and relatable' },
    { icon: <Cross className="w-5 h-5" />, title: 'Preach the Gospel', description: 'Share the simple message of salvation in Christ' },
    { icon: <Users className="w-5 h-5" />, title: 'Disciple Them', description: 'Help new believers grow in their faith' },
    { icon: <Church className="w-5 h-5" />, title: 'Bring to Church', description: 'Connect them to a local church community' },
  ];

  // Testimonials
  const testimonies = [
    { quote: "I led my friend to Christ and God blessed me with a business breakthrough the same month!", name: "Brother David", souls: 12 },
    { quote: "The scholarship I received through this program changed my life! I'm now studying theology.", name: "Sister Grace", souls: 8 },
    { quote: "My health was restored after I started winning souls. God honors those who win souls!", name: "Pastor John", souls: 25 },
  ];

  const currentRank = ranks.find(function (r) { return userStats.points >= r.points; }) || ranks[0];
  const nextRank = ranks.find(function (r) { return r.points > userStats.points; }) || ranks[ranks.length - 1];
  const progressToNext = nextRank.points > userStats.points
    ? (userStats.points / nextRank.points) * 100
    : 100;

  // Badges
  const badges = [
    { name: 'First Soul', icon: <Heart className="w-6 h-6" />, souls: 1, color: 'from-pink-500 to-rose-500' },
    { name: 'Disciple Maker', icon: <Users className="w-6 h-6" />, souls: 5, color: 'from-blue-500 to-cyan-500' },
    { name: 'Harvester', icon: <Medal className="w-6 h-6" />, souls: 10, color: 'from-green-500 to-emerald-500' },
    { name: 'Kingdom Builder', icon: <Award className="w-6 h-6" />, souls: 25, color: 'from-yellow-500 to-orange-500' },
    { name: 'General of Grace', icon: <Trophy className="w-6 h-6" />, souls: 50, color: 'from-amber-500 to-yellow-500' },
    { name: 'Legacy Builder', icon: <Crown className="w-6 h-6" />, souls: 100, color: 'from-purple-500 to-indigo-500' },
  ];

  var unlockedBadges = badges.filter(function (b) { return userStats.soulsWon >= b.souls; });

  // Confetti colors
  var confettiColors = ['#C9A84C', '#1B2A4A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A825'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-church-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Function to render rewards based on active tab
  function renderRewards() {
    if (activeTab === 'rewards') {
      var allRewards = [];
      Object.keys(rewards).forEach(function (category) {
        rewards[category].forEach(function (item) {
          allRewards.push(item);
        });
      });

      return allRewards.map(function (item, index) {
        var unlocked = userStats.soulsWon >= item.souls;
        return (
          <motion.div
            key={index}
            whileHover={{ y: -8, scale: 1.02 }}
            className={'rounded-2xl p-6 transition-all duration-300 cursor-pointer ' + (unlocked
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg shadow-green-500/20'
              : 'bg-gray-50 border-2 border-gray-200')}
            onClick={() => setSelectedReward(item)}
          >
            <div className="flex items-start gap-4">
              <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + (unlocked ? 'bg-green-500' : 'bg-gray-400') + ' text-white'}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className={'font-bold ' + (unlocked ? 'text-green-700' : 'text-gray-500')}>
                  {item.reward}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Heart className={'w-4 h-4 ' + (unlocked ? 'text-green-500' : 'text-gray-400')} />
                  <span className={'text-xs font-semibold ' + (unlocked ? 'text-green-600' : 'text-gray-400')}>
                    {unlocked ? '✅ Unlocked' : item.souls + ' souls needed'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      });
    } else {
      var categoryRewards = rewards[activeTab] || [];
      return categoryRewards.map(function (item, index) {
        var unlocked = userStats.soulsWon >= item.souls;
        return (
          <motion.div
            key={index}
            whileHover={{ y: -8, scale: 1.02 }}
            className={'rounded-2xl p-6 transition-all duration-300 cursor-pointer ' + (unlocked
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg shadow-green-500/20'
              : 'bg-gray-50 border-2 border-gray-200')}
            onClick={() => setSelectedReward(item)}
          >
            <div className="flex items-start gap-4">
              <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + (unlocked ? 'bg-green-500' : 'bg-gray-400') + ' text-white'}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className={'font-bold ' + (unlocked ? 'text-green-700' : 'text-gray-500')}>
                  {item.reward}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Heart className={'w-4 h-4 ' + (unlocked ? 'text-green-500' : 'text-gray-400')} />
                  <span className={'text-xs font-semibold ' + (unlocked ? 'text-green-600' : 'text-gray-400')}>
                    {unlocked ? '✅ Unlocked' : item.souls + ' souls needed'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      });
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={confettiColors}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* ===== HERO SECTION ===== */}
      <motion.div
        style={{ y: y1, opacity: opacity }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy via-church-navy/90 to-church-gold/70">
          <div className="absolute inset-0 bg-[url('images/soul.jpg')] bg-cover bg-center opacity-20" />
        </div>

        <div className="relative container-custom py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Win Souls,
              <span className="text-church-gold block">Transform Lives</span>
            </h1>

            {/* <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
      Every soul you win brings you closer to God's abundant blessings. 
      Receive financial, academic, health, and business rewards for your Kingdom impact.
    </p> */}

            <div className="flex justify-center flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReferralForm(true)}
                className="bg-church-gold text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Win a Soul Today
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/kingdom-rewards"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-2"
              >
                View Rewards
                <ChevronDown className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Stats Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            >
              {[
                // { icon: <Heart className="w-5 h-5" />, label: 'Souls Won', value: userStats.soulsWon },
                // { icon: <Trophy className="w-5 h-5" />, label: 'Kingdom Points', value: userStats.totalPoints },
                // { icon: <Wallet className="w-5 h-5" />, label: 'Financial Rewards', value: '₦' + (userStats.financialRewards || 0) },
                // { icon: <GraduationCap className="w-5 h-5" />, label: 'Scholarships', value: userStats.scholarships || 0 },
              ].map(function (stat, index) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center border border-white/10"
                  >
                    <div className="flex justify-center mb-1">{stat.icon}</div>
                    <motion.p
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-white/70">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-10 top-20 opacity-20"
        >
          <Heart className="w-32 h-32 text-church-gold" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute left-20 bottom-20 opacity-10"
        >
          <Cross className="w-40 h-40 text-white" />
        </motion.div>
      </motion.div>

      {/* ===== WHY SOUL WINNING SECTION - NEW ===== */}
      <section id="why-soul-winning" className="py-20 bg-white scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Why Soul Winning</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Why <span className="text-church-gold">Soul Winning</span> Matters
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 mx-auto rounded-full mt-4"></div>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Understanding the heart of God and the eternal significance of winning souls for His Kingdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySoulWinning.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:border-church-gold/30 group"
              >
                <div className="w-14 h-14 bg-church-gold/10 rounded-lg flex items-center justify-center text-church-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-church-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                <div className="mt-3 inline-block text-xs text-church-gold/70 bg-church-gold/5 px-3 py-1 rounded-full border border-church-gold/10">
                  {item.scripture}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scripture Focus */}
          <div className="mt-12 bg-gradient-to-r from-church-navy to-church-gold/90 rounded-2xl p-8 text-center text-white">
            <p className="text-xl italic leading-relaxed max-w-3xl mx-auto">
              "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
            </p>
            <p className="text-sm text-white/70 mt-2">— Matthew 28:19</p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS OF SOUL WINNING SECTION - ID ===== */}
      <section id="benefits-of-soul-winning" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Benefits of <span className="text-church-gold">Soul Winning</span>
            </h2>
            <p className="text-gray-500 mt-2">Eternal rewards and earthly blessings await you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-white rounded-xl hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="w-12 h-12 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold mx-auto mb-2">
                  {benefit.icon}
                </div>
                <h4 className="font-semibold text-church-navy text-sm">{benefit.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RANK SECTION ===== */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="container-custom py-12"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={'w-16 h-16 rounded-2xl ' + currentRank.bg + ' flex items-center justify-center'}>
                <span className={currentRank.text}>{currentRank.icon}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Rank</p>
                <p className="text-2xl font-bold text-church-navy">{currentRank.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next Rank</p>
              <p className="text-xl font-bold text-church-navy">{nextRank.name}</p>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>{userStats.points} pts</span>
              <span className="text-church-gold font-medium">{nextRank.points} pts needed</span>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: Math.min(progressToNext, 100) + '%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-church-gold to-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Rank Path */}
          <div className="mt-6 flex items-center justify-between overflow-x-auto py-2 gap-1">
            {ranks.map(function (rank, index) {
              var isUnlocked = userStats.points >= rank.points;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className={'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ' + (isUnlocked
                    ? 'bg-gradient-to-br from-church-gold to-amber-400 text-white shadow-lg shadow-church-gold/30'
                    : 'bg-gray-200 text-gray-400')}>
                    {rank.icon}
                  </div>
                  <p className={'text-xs mt-1 ' + (isUnlocked ? 'text-church-gold font-semibold' : 'text-gray-400')}>
                    {rank.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ===== HOW TO WIN SOULS SECTION - ID ===== */}
      <section id="how-to-win-souls" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Practical Guide</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              How to Win <span className="text-church-gold">Souls Effectively</span>
            </h2>
            <p className="text-gray-500 mt-2">Simple yet powerful strategies for soul winning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="w-12 h-12 bg-church-gold/10 rounded-lg flex items-center justify-center text-church-gold mb-3">
                  {tip.icon}
                </div>
                <h4 className="text-lg font-display font-bold text-church-navy">{tip.title}</h4>
                <p className="text-gray-500 text-sm mt-1">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BADGES SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container-custom py-8"
      >
        <div className="bg-gradient-to-br from-church-navy to-church-navy/90 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-church-gold" />
            Kingdom Badges Earned
            <span className="text-sm font-normal text-white/70 ml-2">({unlockedBadges.length} of {badges.length})</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {badges.map(function (badge, index) {
              var unlocked = userStats.soulsWon >= badge.souls;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={'text-center group ' + (!unlocked ? 'opacity-40' : '')}
                >
                  <div className={'w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-2xl transition-all duration-300 ' + (unlocked
                    ? 'bg-gradient-to-br ' + badge.color + ' shadow-lg'
                    : 'bg-gray-700')}>
                    <span className="text-white">{badge.icon}</span>
                  </div>
                  <p className="text-xs font-medium mt-2 text-white">{badge.name}</p>
                  <p className="text-[10px] text-white/50">{badge.souls} souls</p>
                  {unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[10px] text-green-400"
                    >
                      ✅ Earned
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

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
                src="images/aday.jpg"
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
                  src="images/maximize-your-time.jpg"
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

      {/* ===== TESTIMONIES SECTION - ID ===== */}
      <section id="soul-testimonies" className="py-16 bg-white scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Testimonies from <span className="text-church-gold">Soul Winners</span>
            </h2>
            <p className="text-gray-500 mt-2">Hear what God is doing through soul winners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonies.map((testimony, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-church-gold mb-3">
                  <Quote className="w-5 h-5" />
                </div>
                <p className="text-gray-600 italic">"{testimony.quote}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-church-navy">{testimony.name}</p>
                  <p className="text-xs text-church-gold">{testimony.souls} souls won</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KINGDOM REWARDS SECTION - ID ===== */}
      <section id="kingdom-rewards" className="py-16 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="container-custom"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-church-navy">Kingdom Rewards</h2>
              <p className="text-gray-500 mt-1">Unlock these rewards by winning souls</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
              {['rewards', 'financial', 'academic', 'health', 'business'].map(function (tab) {
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={'px-4 py-2 rounded-xl text-sm font-medium transition-all ' + (activeTab === tab
                      ? 'bg-church-gold text-white shadow-lg shadow-church-gold/30'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {renderRewards()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ===== LEADERBOARD SECTION - ID ===== */}
      <section id="soul-leaderboard" className="py-8 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="container-custom"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-display font-bold text-church-navy mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-church-gold" />
              Top Soul Winners
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Pastor Gideon', souls: 145, rank: 'General of Grace', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
                { name: 'Brother David', souls: 130, rank: 'Kingdom Builder', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
                { name: 'Sister Mary', souls: 95, rank: 'Harvester', image: 'https://images.unsplash.com/photo-1494790108376-be9c45b7e6b5?w=100&h=100&fit=crop&crop=face' },
                { name: 'Brother John', souls: 70, rank: 'Evangelist', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
              ].map(function (item, index) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-church-gold/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={'text-2xl font-bold ' + (index < 3 ? 'text-church-gold' : 'text-gray-400')}>#{index + 1}</span>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div>
                        <p className="font-medium text-church-navy group-hover:text-church-gold transition-colors">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-church-navy">{item.souls}</p>
                      <p className="text-xs text-gray-500">souls</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== JOIN THE MOVEMENT / CALL TO ACTION SECTION - ID ===== */}
      <section id="join-movement" className="py-12 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="container-custom"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-church-navy to-church-gold p-12 text-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=1400&q=80')] bg-cover bg-center opacity-10" />

            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-6"
              >
                <Flame className="w-4 h-4 text-yellow-400" />
                The Harvest is Plentiful
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Ready to Win Souls and <span className="text-church-gold">Receive Rewards?</span>
              </h2>

              <p className="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                Start your journey today. Every soul you win brings you closer to God's abundant blessings and eternal rewards.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReferralForm(true)}
                  className="bg-white text-church-navy px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Win Your First Soul
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#kingdom-rewards"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Explore Rewards
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== REFERRAL FORM MODAL ===== */}
      <AnimatePresence>
        {showReferralForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReferralForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-church-navy flex items-center gap-2">
                  <Heart className="w-6 h-6 text-church-gold" />
                  Win a Soul for the Kingdom
                </h2>
                <button
                  onClick={() => setShowReferralForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-500 mb-6">Record the details of someone who gave their life to Christ through your witness.</p>

              <form onSubmit={handleReferralSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={referralData.name}
                      onChange={(e) => setReferralData({ ...referralData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent transition-all"
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={referralData.email}
                      onChange={(e) => setReferralData({ ...referralData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={referralData.phone}
                    onChange={(e) => setReferralData({ ...referralData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent transition-all"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimony / Message</label>
                  <textarea
                    value={referralData.message}
                    onChange={(e) => setReferralData({ ...referralData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Share the testimony of how this person came to Christ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area of Need</label>
                  <select
                    value={referralData.need}
                    onChange={(e) => setReferralData({ ...referralData, need: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-church-gold focus:border-transparent transition-all bg-white"
                  >
                    <option value="spiritual">Spiritual Growth</option>
                    <option value="financial">Financial Support</option>
                    <option value="academic">Academic Sponsorship</option>
                    <option value="health">Health & Medical</option>
                    <option value="business">Business Support</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-church-gold to-amber-500 text-white py-4 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Record This Soul for the Kingdom 🎉
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SELECTED REWARD MODAL ===== */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-church-gold to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-church-navy">{selectedReward.reward}</h2>
                <p className="text-gray-500 mt-1">{selectedReward.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Souls Required</span>
                  <span className="font-bold text-church-navy">{selectedReward.souls} souls</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Your Progress</span>
                  <span className="font-bold text-church-navy">{userStats.soulsWon} souls</span>
                </div>
                <div className="mt-3 overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                  <div
                    className="bg-gradient-to-r from-church-gold to-amber-400 rounded-full"
                    style={{ width: Math.min((userStats.soulsWon / selectedReward.souls) * 100, 100) + '%' }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedReward(null);
                    setShowReferralForm(true);
                  }}
                  className="flex-1 px-4 py-3 bg-church-gold text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Win More Souls
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SoulWinning;