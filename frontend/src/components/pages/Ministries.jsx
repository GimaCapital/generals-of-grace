// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Heart, BookOpen, Music, Church, UserPlus } from 'lucide-react';
// import { ministryAPI } from '../../services/api';
// import { truncateText } from '../../utils';

// function Ministries() {
//   const [ministries, setMinistries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMinistries();
//   }, []);

//   const fetchMinistries = async () => {
//     try {
//       setLoading(true);
//       const response = await ministryAPI.getAll();
//       setMinistries(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching ministries:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ministryIcons = {
//     'Youth Ministry': <Users className="w-12 h-12 text-church-gold" />,
//     'Women\'s Ministry': <Heart className="w-12 h-12 text-church-gold" />,
//     'Men\'s Ministry': <UserPlus className="w-12 h-12 text-church-gold" />,
//     'Children\'s Church': <BookOpen className="w-12 h-12 text-church-gold" />,
//     'Worship Team': <Music className="w-12 h-12 text-church-gold" />,
//     'Prayer Ministry': <Church className="w-12 h-12 text-church-gold" />,
//   };

//   return (
//     <div className="py-12 bg-gray-50 min-h-screen">
//       <div className="container-custom">
//         <h1 className="section-title mb-4">Our Ministries</h1>
//         <p className="section-subtitle mb-8">Find your place to serve and grow</p>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
//           </div>
//         ) : ministries.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No ministries found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {ministries.map((ministry) => (
//               <div key={ministry.id} className="card p-6 hover:shadow-2xl transition-shadow">
//                 <div className="flex flex-col items-center text-center">
//                   <div className="mb-4">
//                     {ministryIcons[ministry.name] || <Users className="w-12 h-12 text-church-gold" />}
//                   </div>
//                   <h3 className="font-display font-bold text-xl text-church-navy mb-2">
//                     {ministry.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4">{truncateText(ministry.description, 80)}</p>
//                   {ministry.leader && (
//                     <p className="text-sm text-gray-500">
//                       <span className="font-medium">Leader:</span> {ministry.leader}
//                     </p>
//                   )}
//                   {ministry.meetingDay && (
//                     <p className="text-sm text-gray-500">
//                       <span className="font-medium">Meets:</span> {ministry.meetingDay} at {ministry.meetingTime}
//                     </p>
//                   )}
//                   <Link
//                     to={`/ministries/${ministry.id}`}
//                     className="mt-4 inline-block btn-primary text-sm px-4 py-2"
//                   >
//                     Learn More
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Ministries;


// src/components/pages/Ministries.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Heart, BookOpen, Music, Church, UserPlus, 
  Calendar, MapPin, Mail, Clock, ArrowRight,
  Sparkles, Crown, Shield, Target, Flame, Award,
  ChevronRight, Star, Gem, Diamond, Cross,
  Hand, Globe, Coffee, Footprints, GraduationCap 
} from 'lucide-react';
import { ministryAPI } from '../../services/api';
import { truncateText } from '../../utils';

function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pre-defined ministries data - ENHANCED with more ministries
  const defaultMinistries = [
    // 1. Youth Ministry
    {
      id: 'youth',
      name: 'Youth Ministry',
      description: 'Empowering the next generation to rise and shine for Christ. We focus on discipleship, worship, and building strong foundations for young people.',
      leader: 'Pastor David',
      meetingDay: 'Saturday',
      meetingTime: '10:00 AM',
      venue: 'Youth Center',
      icon: <Users className="w-12 h-12 text-church-gold" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Raising the next generation'
    },
    // 2. Women's Ministry
    {
      id: 'women',
      name: "Women's Ministry",
      description: 'A sisterhood of faith, love, and empowerment. Women walking together in purpose, prayer, and power to impact their families and communities.',
      leader: 'Pastor Sarah',
      meetingDay: 'Wednesday',
      meetingTime: '6:00 PM',
      venue: 'Fellowship Hall',
      icon: <Heart className="w-12 h-12 text-church-gold" />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Sisters in faith, love, and power'
    },
    // 3. Men's Ministry
    {
      id: 'men',
      name: "Men's Ministry",
      description: 'Building godly men of integrity, strength, and purpose. Men who lead their families, serve their churches, and impact their communities for Christ.',
      leader: 'Pastor Michael',
      meetingDay: 'Thursday',
      meetingTime: '7:00 PM',
      venue: 'Main Auditorium',
      icon: <UserPlus className="w-12 h-12 text-church-gold" />,
      color: 'from-blue-700 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Building godly men of integrity'
    },
    // 4. Children's Church
    {
      id: 'children',
      name: "Children's Church",
      description: 'Raising young warriors for the Kingdom. Teaching children the Word of God through fun, interactive, and engaging lessons that build faith.',
      leader: 'Sister Esther',
      meetingDay: 'Sunday',
      meetingTime: '9:00 AM',
      venue: 'Children\'s Wing',
      icon: <BookOpen className="w-12 h-12 text-church-gold" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Path to Faith filled with Laughter'
    },
    // 5. Worship Team
    {
      id: 'worship',
      name: 'Worship Team',
      description: 'Leading the church into the presence of God through powerful worship and praise. A team of dedicated musicians and singers who minister through song.',
      leader: 'Brother Andrew',
      meetingDay: 'Friday',
      meetingTime: '5:00 PM',
      venue: 'Main Auditorium',
      icon: <Music className="w-12 h-12 text-church-gold" />,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Leading the church in praise'
    },
    // 6. Prayer Ministry
    {
      id: 'prayer',
      name: 'Prayer Ministry',
      description: 'The prayer engine of the church. Interceding for the church, the community, and the nations. Where miracles happen through persistent prayer.',
      leader: 'Pastor Grace',
      meetingDay: 'Tuesday',
      meetingTime: '5:00 AM',
      venue: 'Prayer Room',
      icon: <Church className="w-12 h-12 text-church-gold" />,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600',
      image: 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Dedicated intercessory prayer'
    },
    // 7. Campus Ministry - NEW
    {
      id: 'campus',
      name: 'Campus Ministry',
      description: 'Reaching students with the Gospel and transforming university campuses for Christ. Discipling young leaders who will impact their generation.',
      leader: 'Pastor Joshua',
      meetingDay: 'Saturday',
      meetingTime: '3:00 PM',
      venue: 'University Campus',
      icon: <GraduationCap className="w-12 h-12 text-church-gold" />,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-600',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Reaching students with the Gospel'
    },
    // 8. Outreach Ministry - NEW
    {
      id: 'outreach',
      name: 'Outreach & Missions',
      description: 'Sharing the Gospel worldwide through missions, community service, and evangelism. Bringing hope and transformation to communities near and far.',
      leader: 'Pastor Mark',
      meetingDay: 'Monthly',
      meetingTime: 'Varies',
      venue: 'Various Locations',
      icon: <Globe className="w-12 h-12 text-church-gold" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Sharing God\'s love worldwide'
    },
    // 9. Discipleship Ministry - NEW
    {
      id: 'discipleship',
      name: 'Discipleship Ministry',
      description: 'Making disciples for Christ through mentorship, training, and equipping believers for ministry. Growing deeper in faith and knowledge of God.',
      leader: 'Pastor Peter',
      meetingDay: 'Wednesday',
      meetingTime: '7:00 PM',
      venue: 'Main Auditorium',
      icon: <Footprints className="w-12 h-12 text-church-gold" />,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-600',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Making disciples for Christ'
    },
    // 10. Family Ministry - NEW
    {
      id: 'family',
      name: 'Family Ministry',
      description: 'Strengthening families through God\'s Word. Building strong marriages, godly parenting, and creating a legacy of faith for generations to come.',
      leader: 'Pastor Daniel',
      meetingDay: 'Sunday',
      meetingTime: '2:00 PM',
      venue: 'Fellowship Hall',
      icon: <Users className="w-12 h-12 text-church-gold" />,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-600',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop&crop=center',
      subtitle: 'Building strong families in Christ'
    },
  ];

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await ministryAPI.getAll();
      if (response.data.data && response.data.data.length > 0) {
        setMinistries(response.data.data);
      } else {
        setMinistries(defaultMinistries);
      }
    } catch (error) {
      console.error('Error fetching ministries:', error);
      setMinistries(defaultMinistries);
    } finally {
      setLoading(false);
    }
  };

  // Get icon for ministry
  const getMinistryIcon = (ministry) => {
    const iconMap = {
      'Youth Ministry': <Users className="w-12 h-12 text-church-gold" />,
      "Women's Ministry": <Heart className="w-12 h-12 text-church-gold" />,
      "Men's Ministry": <UserPlus className="w-12 h-12 text-church-gold" />,
      "Children's Church": <BookOpen className="w-12 h-12 text-church-gold" />,
      'Worship Team': <Music className="w-12 h-12 text-church-gold" />,
      'Prayer Ministry': <Church className="w-12 h-12 text-church-gold" />,
      'Campus Ministry': <GraduationCap className="w-12 h-12 text-church-gold" />,
      'Outreach & Missions': <Globe className="w-12 h-12 text-church-gold" />,
      'Discipleship Ministry': <Footprints className="w-12 h-12 text-church-gold" />,
      'Family Ministry': <Users className="w-12 h-12 text-church-gold" />,
    };
    return iconMap[ministry.name] || <Users className="w-12 h-12 text-church-gold" />;
  };

  // Get color scheme for ministry
  const getColorScheme = (ministry) => {
    const colorMap = {
      'Youth Ministry': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', from: 'from-blue-500', to: 'to-cyan-500' },
      "Women's Ministry": { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', from: 'from-pink-500', to: 'to-rose-500' },
      "Men's Ministry": { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', from: 'from-blue-700', to: 'to-indigo-600' },
      "Children's Church": { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', from: 'from-green-500', to: 'to-emerald-500' },
      'Worship Team': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', from: 'from-purple-500', to: 'to-violet-500' },
      'Prayer Ministry': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', from: 'from-amber-500', to: 'to-orange-500' },
      'Campus Ministry': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', from: 'from-teal-500', to: 'to-cyan-500' },
      'Outreach & Missions': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', from: 'from-green-500', to: 'to-emerald-500' },
      'Discipleship Ministry': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', from: 'from-indigo-500', to: 'to-purple-500' },
      'Family Ministry': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', from: 'from-rose-500', to: 'to-pink-500' },
    };
    return colorMap[ministry.name] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', from: 'from-gray-500', to: 'to-gray-600' };
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container-custom">
        {/* Header - Salvation Ministries Style */}
        <div className="mb-12">
          <p className="text-red-600 text-xs md:text-sm font-semibold uppercase tracking-widest">GET INVOLVED</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy">
            Ministries
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">TO LEADING LIGHT</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
            <p className="mt-4 text-gray-500">Loading ministries...</p>
          </div>
        ) : ministries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-church-navy">No Ministries Found</h3>
            <p className="text-gray-500 mt-2">Check back soon for our ministry listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => {
              const icon = getMinistryIcon(ministry);
              const colors = getColorScheme(ministry);
              return (
                <div 
                  key={ministry.id} 
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${colors.border} hover:border-church-gold/50 hover:-translate-y-2`}
                >
                  {/* Ministry Card */}
                  <div className="p-6">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {icon}
                    </div>
                    
                    {/* Ministry Name */}
                    <h3 className={`text-xl font-display font-bold text-church-navy mb-2 group-hover:${colors.text} transition-colors duration-300`}>
                      {ministry.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {truncateText(ministry.description, 100)}
                    </p>
                    
                    {/* Leader */}
                    {ministry.leader && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Users className="w-4 h-4 text-church-gold" />
                        <span>Led by <span className="font-medium text-church-navy">{ministry.leader}</span></span>
                      </div>
                    )}
                    
                    {/* Meeting Details */}
                    <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                      {ministry.meetingDay && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-church-gold" />
                          <span>{ministry.meetingDay}</span>
                          {ministry.meetingTime && <span>• {ministry.meetingTime}</span>}
                        </div>
                      )}
                      {ministry.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-church-gold" />
                          <span>{ministry.venue}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Learn More Button */}
                    <Link
                      to={`/ministries/${ministry.id}`}
                      className="inline-flex items-center gap-2 text-church-gold font-semibold text-sm hover:gap-3 transition-all group-hover:text-church-navy"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Decorative bottom bar */}
                  <div className={`h-1 bg-gradient-to-r ${colors.from} ${colors.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-church-navy to-church-gold/90 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Join a Ministry?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Discover your God-given purpose and connect with a community that will help you grow
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-church-navy px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Get Involved
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white/50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ministries;