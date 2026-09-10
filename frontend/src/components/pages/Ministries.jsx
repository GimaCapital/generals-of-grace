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
  ChevronRight, Globe, Footprints, GraduationCap,
  Image as ImageIcon, Video
} from 'lucide-react';
import { ministryAPI } from '../../services/api';
import { truncateText } from '../../utils';

function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        setMinistries([]);
      }
    } catch (error) {
      console.error('Error fetching ministries:', error);
      setMinistries([]);
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

  // Filter ministries based on search
  const filteredMinistries = ministries.filter(ministry =>
    ministry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.leader?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <p className="text-red-600 text-xs md:text-sm font-semibold uppercase tracking-widest">GET INVOLVED</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy">
            Ministries
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">TO LEADING LIGHT</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ministries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
            />
          </div>
        </div>

        {ministries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-church-navy">No Ministries Found</h3>
            <p className="text-gray-500 mt-2">Check back soon for our ministry listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMinistries.map((ministry) => {
              const icon = getMinistryIcon(ministry);
              const colors = getColorScheme(ministry);
              return (
                <div 
                  key={ministry.id} 
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${colors.border} hover:border-church-gold/50 hover:-translate-y-2 relative`}
                >
                  {/* Coming Soon Badge */}
                  {ministry.comingSoon && (
                    <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Clock className="w-3.5 h-3.5" />
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Image */}
                  {ministry.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={ministry.image} 
                        alt={ministry.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Video Badge */}
                      {ministry.videoUrl && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          Watch
                        </div>
                      )}
                      {/* Gallery Images Count */}
                      {ministry.galleryImages?.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {ministry.galleryImages.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-church-gold/20 to-church-gold/5 flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  
                  {/* Ministry Card */}
                  <div className="p-6">
                    {/* Ministry Name */}
                    <h3 className={`text-xl font-display font-bold text-church-navy mb-2 group-hover:${colors.text} transition-colors duration-300`}>
                      {ministry.name}
                    </h3>

                    {/* Subtitle */}
                    {ministry.subtitle && (
                      <p className="text-sm text-church-gold mb-2">{ministry.subtitle}</p>
                    )}
                    
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
                    {ministry.comingSoon ? (
                      <div className="mb-4 text-sm text-amber-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Launching Soon</span>
                      </div>
                    ) : (
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
                        {!ministry.meetingDay && !ministry.venue && (
                          <span className="text-gray-400 text-sm">Schedule TBD</span>
                        )}
                      </div>
                    )}
                    
                    {/* Learn More Button */}
                    <Link
                      to={`/ministries/${ministry.id}`}
                      className="inline-flex items-center gap-2 text-church-gold font-semibold text-sm hover:gap-3 transition-all group-hover:text-church-navy"
                    >
                      {ministry.comingSoon ? 'Coming Soon' : 'Learn More'}
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