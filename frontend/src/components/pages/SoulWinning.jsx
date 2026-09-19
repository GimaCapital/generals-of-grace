// src/components/pages/SoulWinning.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Users, Globe, Trophy,
  Crown, Gift, TrendingUp,
  Award, Target, Flame, Rocket,
  GraduationCap, Wallet, Shield, Cross, Church,
  BookOpen, Stethoscope, Building,
  Briefcase, ChevronRight, ChevronDown,
  Diamond, Gem, Lightbulb, HeartPulse,
  Quote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  soulsAPI,
  badgesAPI,
  rewardsAPI,
  ranksAPI,
  settingsAPI,
} from '../../services/api';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useInView } from 'react-intersection-observer';

// ============================================================
// ICON MAP
// ============================================================
const ICON_BY_EMOJI = {
  '🌱': <Heart className="w-5 h-5" />,
  '🏅': <Award className="w-5 h-5" />,
  '🙏': <Church className="w-5 h-5" />,
  '🎖️': <Crown className="w-5 h-5" />,
  '📖': <BookOpen className="w-5 h-5" />,
  '👑': <Crown className="w-5 h-5" />,
  '📚': <BookOpen className="w-5 h-5" />,
  '📕': <BookOpen className="w-5 h-5" />,
  '🎫': <Trophy className="w-5 h-5" />,
  '🤝': <Users className="w-5 h-5" />,
  '🚀': <Rocket className="w-5 h-5" />,
  '☕': <Church className="w-5 h-5" />,
  '👥': <Users className="w-5 h-5" />,
  '🌍': <Globe className="w-5 h-5" />,
  '🏆': <Trophy className="w-5 h-5" />,
  '📓': <BookOpen className="w-5 h-5" />,
  '✍️': <BookOpen className="w-5 h-5" />,
  '🎁': <Gift className="w-5 h-5" />,
  '🍽️': <Heart className="w-5 h-5" />,
  '⛺': <Flame className="w-5 h-5" />,
  '⭐': <Crown className="w-5 h-5" />,
  '❤️': <Heart className="w-5 h-5" />,
  '🎓': <GraduationCap className="w-5 h-5" />,
  '💼': <Briefcase className="w-5 h-5" />,
  '🏥': <Stethoscope className="w-5 h-5" />,
  '🏛️': <Building className="w-5 h-5" />,
  '💎': <Diamond className="w-5 h-5" />,
  '💰': <Wallet className="w-5 h-5" />,
  '🛡️': <Shield className="w-5 h-5" />,
  '🌐': <Globe className="w-5 h-5" />,
  '🎯': <Target className="w-5 h-5" />,
};

const getIconForReward = (emoji) =>
  ICON_BY_EMOJI[emoji] || <Gift className="w-5 h-5" />;

// ============================================================
// STATIC MARKETING CONTENT
// ============================================================
const BENEFITS = [
  { icon: <Heart className="w-5 h-5" />, title: 'Eternal Rewards', description: 'Treasures stored in heaven that never fade' },
  { icon: <Users className="w-5 h-5" />, title: 'Impact Lives', description: 'Change destinies and bring hope to the lost' },
  { icon: <Award className="w-5 h-5" />, title: 'Recognition', description: 'Honored and celebrated in the church' },
  { icon: <GraduationCap className="w-5 h-5" />, title: 'Learning', description: 'Grow through Bible school and mentorship' },
  { icon: <Shield className="w-5 h-5" />, title: 'Spiritual Growth', description: 'Deepen your faith and walk with God' },
  { icon: <Briefcase className="w-5 h-5" />, title: 'Leadership', description: 'Rise in ministry and influence' },
  { icon: <Crown className="w-5 h-5" />, title: 'Honor', description: 'Public recognition for your faithfulness' },
  { icon: <HeartPulse className="w-5 h-5" />, title: 'Well-being', description: 'Prayer and pastoral care for you and your family' },
  { icon: <Church className="w-5 h-5" />, title: 'Community', description: 'Join a community of soul winners' },
  { icon: <Globe className="w-5 h-5" />, title: 'Mission', description: 'Be part of the Great Commission' },
];

const WHY_SOUL_WINNING = [
  { icon: <BookOpen className="w-6 h-6" />, title: "It's God's Heart", description: 'God desires that none should perish but all come to repentance. Soul winning is the heartbeat of God.', scripture: '2 Peter 3:9' },
  { icon: <Cross className="w-6 h-6" />, title: 'The Great Commission', description: 'Jesus commanded us to go and make disciples of all nations. It is our primary assignment as believers.', scripture: 'Matthew 28:19-20' },
  { icon: <Heart className="w-6 h-6" />, title: 'Eternal Impact', description: 'When you win a soul, you change their eternity. You help someone transition from death to life.', scripture: 'John 5:24' },
  { icon: <Crown className="w-6 h-6" />, title: 'Heavenly Rewards', description: 'God rewards those who diligently seek Him and win souls. Your labor in the Lord is not in vain.', scripture: '1 Corinthians 15:58' },
];

const TIPS = [
  { icon: <Lightbulb className="w-5 h-5" />, title: 'Pray First', description: 'Always start with prayer for boldness and divine appointments' },
  { icon: <Heart className="w-5 h-5" />, title: 'Love Them', description: 'Show genuine love and care, people are drawn to love' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Share Your Testimony', description: 'Your personal testimony is powerful and relatable' },
  { icon: <Cross className="w-5 h-5" />, title: 'Preach the Gospel', description: 'Share the simple message of salvation in Christ' },
  { icon: <Users className="w-5 h-5" />, title: 'Disciple Them', description: 'Help new believers grow in their faith' },
  { icon: <Church className="w-5 h-5" />, title: 'Bring to Church', description: 'Connect them to a local church community' },
];

const TESTIMONIES = [
  { quote: 'I led my friend to Christ and God blessed me with a business breakthrough the same month!', name: 'Brother David', souls: 12 },
  { quote: "The scholarship I received through this program changed my life! I'm now studying theology.", name: 'Sister Grace', souls: 8 },
  { quote: 'My health was restored after I started winning souls. God honors those who win souls!', name: 'Pastor John', souls: 25 },
];

// ============================================================
// COMPONENT
// ============================================================
function SoulWinning() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [userStats, setUserStats] = useState({
    soulsWon: 0,
    totalPoints: 0,
  });
  const [soulsToPoints, setSoulsToPoints] = useState(10);

  const pointsToSouls = (points) =>
    Math.round((points || 0) / soulsToPoints);

  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [rewardGroups, setRewardGroups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const { scrollYProgress } = useScroll();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const requireAuth = (targetSection) => {
    if (!currentUser) {
      toast.error('Please log in to continue');
      const returnTo = `/soul-winning${targetSection ? `#${targetSection}` : ''}`;
      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return false;
    }
    return true;
  };

  const fetchUserStats = async () => {
    if (!currentUser?.uid) return;
    try {
      const [soulsRes, badgesRes] = await Promise.all([
        soulsAPI.getStats(currentUser.uid).catch(() => ({ data: { data: {} } })),
        badgesAPI.getProgress(currentUser.uid).catch(() => ({ data: { data: [] } })),
      ]);

      const soulsData = soulsRes.data?.data || {};
      const badgesData = badgesRes.data?.data || [];
      const totalSouls = soulsData.total || 0;

      setUserStats({
        soulsWon: totalSouls,
        totalPoints: totalSouls * soulsToPoints,
      });
      setBadges(badgesData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchPublicData = async () => {
    try {
      const [ranksRes, rewardsRes, badgesRes, leaderRes, settingsRes] =
        await Promise.all([
          ranksAPI.getAll().catch(() => ({ data: { data: [] } })),
          rewardsAPI.getAll().catch(() => ({ data: { data: [] } })),
          badgesAPI.getAll().catch(() => ({ data: { data: [] } })),
          soulsAPI.getLeaderboard?.().catch(() => ({ data: { data: [] } })),
          settingsAPI.getSettings().catch(() => null),
        ]);

      setRankList(ranksRes.data?.data || []);
      setRewardGroups(rewardsRes.data?.data || []);
      setLeaderboard(leaderRes?.data?.data || []);

      const ratio = settingsRes?.data?.data?.soulsToPoints;
      if (ratio) setSoulsToPoints(Number(ratio));

      const allBadges = badgesRes.data?.data || [];
      if (!currentUser) {
        setBadges(allBadges.map((b) => ({ ...b, earned: false, progress: 0 })));
      }
    } catch (error) {
      console.error('Error fetching public data:', error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPublicData();
      if (currentUser?.uid) {
        await fetchUserStats();
      }
      setLoading(false);
    })();
    setTimeout(() => setShowConfetti(true), 1000);
    setTimeout(() => setShowConfetti(false), 4000);
  }, [currentUser]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location.hash]);

  const handleWinSoulClick = () => {
    if (!requireAuth()) return;
    navigate('/profile?tab=soul-winning');
  };

  const handleJoinMovementClick = () => {
    if (!requireAuth('join-movement')) return;
    navigate('/profile?tab=soul-winning');
  };

  const handleRewardClick = (reward) => {
    if (!requireAuth('soul-winners-honor')) return;
    setSelectedReward(reward);
  };

  const handleRewardModalAction = () => {
    setSelectedReward(null);
    navigate('/profile?tab=soul-winning');
  };

  const sortedRanks = [...rankList].sort(
    (a, b) => (a.pointsRequired || 0) - (b.pointsRequired || 0)
  );

  const currentRank =
    [...sortedRanks].reverse().find((r) => userStats.totalPoints >= (r.pointsRequired || 0)) ||
    sortedRanks[0] || {
      name: 'Disciple',
      icon: '⭐',
      color: '#6B7280',
      pointsRequired: 0,
    };

  const nextRank =
    sortedRanks.find((r) => (r.pointsRequired || 0) > userStats.totalPoints) ||
    sortedRanks[sortedRanks.length - 1] || {
      name: 'Legacy',
      pointsRequired: 100,
    };

  const progressToNext =
    nextRank.pointsRequired > userStats.totalPoints
      ? (userStats.totalPoints / nextRank.pointsRequired) * 100
      : 100;

  const confettiColors = ['#C9A84C', '#1B2A4A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A825'];

  const tabs = ['all', ...rewardGroups.map((g) => g.key)];

  const visibleRewards = (() => {
    if (activeTab === 'all') {
      return rewardGroups.flatMap((g) =>
        g.rewards.map((r) => ({ ...r, categoryLabel: g.label }))
      );
    }
    const group = rewardGroups.find((g) => g.key === activeTab);
    return group
      ? group.rewards.map((r) => ({ ...r, categoryLabel: group.label }))
      : [];
  })();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-church-gold border-t-transparent rounded-full"
        />
      </div>
    );
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

      {/* ===== HERO ===== */}
      <motion.div style={{ y: y1, opacity }} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-church-navy via-church-navy/90 to-church-gold/70">
          <div className="absolute inset-0 bg-[url('/images/soul.jpg')] bg-cover bg-center opacity-20" />
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

            <div className="flex justify-center flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWinSoulClick}
                className="bg-church-gold text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Win a Soul Today
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#soul-winners-honor"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('soul-winners-honor')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-2"
              >
                View Honor
                <ChevronDown className="w-4 h-4" />
              </motion.a>
            </div>

            {!currentUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-lg mx-auto"
              >
                <p className="text-white/90 text-sm">
                  <Link to="/login?redirect=%2Fsoul-winning" className="text-church-gold font-semibold underline">
                    Log in
                  </Link>{' '}
                  or{' '}
                  <Link to="/register?redirect=%2Fsoul-winning" className="text-church-gold font-semibold underline">
                    create an account
                  </Link>{' '}
                  to start winning souls and tracking your Kingdom rewards.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ===== WHY SOUL WINNING ===== */}
      <section id="why-soul-winning" className="py-20 bg-white scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">
              Why Soul Winning
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Why <span className="text-church-gold">Soul Winning</span> Matters
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 mx-auto rounded-full mt-4" />
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Understanding the heart of God and the eternal significance of winning souls for His Kingdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_SOUL_WINNING.map((item, index) => (
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

          <div className="mt-12 bg-gradient-to-r from-church-navy to-church-gold/90 rounded-2xl p-8 text-center text-white">
            <p className="text-xl italic leading-relaxed max-w-3xl mx-auto">
              "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
            </p>
            <p className="text-sm text-white/70 mt-2">— Matthew 28:19</p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
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
            {BENEFITS.map((benefit, index) => (
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
      {sortedRanks.length > 0 && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container-custom py-12"
        >
          <p className="text-center text-xs text-gray-500 mb-4">
            Every soul you win moves you up the ladder. Each rank unlocks at a specific soul count.
          </p>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${currentRank.color}20` }}
                >
                  <span style={{ color: currentRank.color }}>{currentRank.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {currentUser ? 'Your Rank' : 'Starting Rank'}
                  </p>
                  <p className="text-2xl font-bold text-church-navy">
                    {currentUser ? currentRank.name : sortedRanks[0]?.name || 'Disciple'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Rank</p>
                <p className="text-xl font-bold text-church-navy">
                  {currentUser ? nextRank.name : sortedRanks[1]?.name || 'Evangelist'}
                </p>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>
                  {currentUser ? `${userStats.soulsWon} souls` : '0 souls'}
                </span>
                <span className="text-church-gold font-medium">
                  {currentUser
                    ? `Needs ${pointsToSouls(nextRank.pointsRequired)} souls`
                    : `Needs ${pointsToSouls(sortedRanks[1]?.pointsRequired || 100)} souls`}
                </span>
              </div>
              <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentUser ? Math.min(progressToNext, 100) : 0}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-church-gold to-amber-400 rounded-full"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between overflow-x-auto py-2 gap-2">
              {sortedRanks.map((rank, index) => {
                const isUnlocked =
                  currentUser && userStats.totalPoints >= (rank.pointsRequired || 0);
                const soulsLabel = pointsToSouls(rank.pointsRequired || 0);
                return (
                  <motion.div
                    key={rank.docId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 text-xl ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-church-gold to-amber-400 text-white shadow-lg shadow-church-gold/30'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {rank.icon}
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isUnlocked ? 'text-church-gold font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {rank.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {soulsLabel} {soulsLabel === 1 ? 'soul' : 'souls'}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {!currentUser && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <Link
                    to="/login?redirect=%2Fsoul-winning%23soul-leaderboard"
                    className="text-church-gold font-semibold underline"
                  >
                    Log in
                  </Link>{' '}
                  to start earning points and unlocking ranks.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ===== HOW TO WIN SOULS ===== */}
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
            {TIPS.map((tip, index) => (
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

      {/* ===== BADGES ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container-custom py-8"
      >
        <div className="bg-gradient-to-br from-church-navy to-church-navy/90 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Award className="w-6 h-6 text-church-gold" />
            Kingdom Badges
            {currentUser && badges.length > 0 && (
              <span className="text-sm font-normal text-white/70 ml-2">
                ({badges.filter((b) => b.earned).length} of {badges.length} earned)
              </span>
            )}
          </h2>
          <p className="text-sm text-white/70 mb-6">
            {currentUser
              ? 'Win souls to unlock badges and track your journey.'
              : 'Every soul you win unlocks a new badge. Start your journey today.'}
          </p>

          {badges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">Badges will appear here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {badges.map((badge, index) => {
                const isEarned = currentUser && badge.earned;
                const showProgress = currentUser && !badge.earned && badge.target > 0;
                return (
                  <motion.div
                    key={badge.id || index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`text-center group ${!isEarned ? 'opacity-60' : ''}`}
                  >
                    <div
                      className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl transition-all duration-300 ${
                        isEarned
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg'
                          : 'bg-gray-700'
                      }`}
                    >
                      <span className={!isEarned ? 'grayscale opacity-70' : ''}>
                        {badge.emoji || '🏅'}
                      </span>
                    </div>
                    <p className="text-xs font-medium mt-2 text-white">{badge.name}</p>
                    <p className="text-[10px] text-white/50">{badge.target} souls</p>
                    {isEarned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[10px] text-green-400"
                      >
                        ✅ Earned
                      </motion.div>
                    )}
                    {showProgress && (
                      <div className="mt-1">
                        <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-church-gold"
                            style={{
                              width: `${Math.min(100, (badge.progress / badge.target) * 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-[9px] text-white/50 mt-0.5">
                          {badge.progress} / {badge.target}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {!currentUser && badges.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-white/70">
                <Link
                  to="/login?redirect=%2Fsoul-winning%23soul-leaderboard"
                  className="text-church-gold font-semibold underline"
                >
                  Log in
                </Link>{' '}
                to start earning badges as you win souls.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== TESTIMONIES ===== */}
      <section id="soul-testimonies" className="py-16 bg-white scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
              Testimonies from <span className="text-church-gold">Soul Winners</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIES.map((testimony, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <Quote className="w-5 h-5 text-church-gold mb-3" />
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

      {/* ===== SOUL WINNER'S HONOR ===== */}
      {rewardGroups.length > 0 && (
        <section id="soul-winners-honor" className="py-16 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="container-custom"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-church-navy">
                  Soul Winner's Honor
                </h2>
                <p className="text-gray-500 mt-1">
                  Recognition and blessings for your faithfulness to the Great Commission
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
                {tabs.map((tab) => {
                  const label =
                    tab === 'all'
                      ? 'All'
                      : rewardGroups.find((g) => g.key === tab)?.label ||
                        tab.charAt(0).toUpperCase() + tab.slice(1);
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab
                          ? 'bg-church-gold text-white shadow-lg shadow-church-gold/30'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {label}
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
                {visibleRewards.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No rewards in this category yet.
                  </div>
                ) : (
                  visibleRewards.map((item) => {
                    const unlocked =
                      currentUser && userStats.soulsWon >= (item.soulsRequired || 0);
                    return (
                      <motion.div
                        key={item.docId}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                          unlocked
                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg shadow-amber-500/10'
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                        onClick={() => handleRewardClick(item)}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                              unlocked ? 'bg-amber-500' : 'bg-gray-400'
                            }`}
                          >
                            {getIconForReward(item.icon)}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-bold ${
                                unlocked ? 'text-amber-800' : 'text-gray-500'
                              }`}
                            >
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Crown
                                className={`w-4 h-4 ${
                                  unlocked ? 'text-amber-500' : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`text-xs font-semibold ${
                                  unlocked ? 'text-amber-600' : 'text-gray-400'
                                }`}
                              >
                                {unlocked
                                  ? '✨ Earned'
                                  : `${item.soulsRequired} souls`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* ===== LEADERBOARD ===== */}
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
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No souls recorded yet. Be the first!
              </p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-church-gold/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-bold ${
                          index < 3 ? 'text-church-gold' : 'text-gray-400'
                        }`}
                      >
                        #{item.rank}
                      </span>
                      <div>
                        <p className="font-medium text-church-navy group-hover:text-church-gold transition-colors">
                          {item.displayName}
                        </p>
                        <p className="text-xs text-gray-500">{item.rankTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-church-navy">{item.soulsWon}</p>
                      <p className="text-xs text-gray-500">souls</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ===== JOIN THE MOVEMENT ===== */}
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
                  onClick={handleJoinMovementClick}
                  className="bg-white text-church-navy px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Win Your First Soul
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

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
                <h2 className="text-2xl font-display font-bold text-church-navy">
                  {selectedReward.title}
                </h2>
                <p className="text-gray-500 mt-1">{selectedReward.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Souls Required</span>
                  <span className="font-bold text-church-navy">
                    {selectedReward.soulsRequired} souls
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Your Progress</span>
                  <span className="font-bold text-church-navy">
                    {userStats.soulsWon} souls
                  </span>
                </div>
                <div className="mt-3 overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                  <div
                    className="bg-gradient-to-r from-church-gold to-amber-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        (userStats.soulsWon / selectedReward.soulsRequired) * 100,
                        100
                      )}%`,
                    }}
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
                  onClick={handleRewardModalAction}
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