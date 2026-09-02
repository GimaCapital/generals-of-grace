// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft, Users, Calendar, MapPin, Mail, Clock } from 'lucide-react';
// import { ministryAPI } from '../../services/api';

// function MinistryDetail() {
//   const { id } = useParams();
//   const [ministry, setMinistry] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMinistry();
//   }, [id]);

//   const fetchMinistry = async () => {
//     try {
//       setLoading(true);
//       const response = await ministryAPI.getById(id);
//       setMinistry(response.data.data);
//     } catch (error) {
//       console.error('Error fetching ministry:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
//       </div>
//     );
//   }

//   if (!ministry) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-display font-bold text-church-navy">Ministry not found</h2>
//         <Link to="/ministries" className="btn-primary inline-block mt-4">Back to Ministries</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 bg-gray-50 min-h-screen">
//       <div className="container-custom max-w-4xl">
//         <Link to="/ministries" className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6">
//           <ArrowLeft className="w-4 h-4" />
//           Back to Ministries
//         </Link>

//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-8">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="w-20 h-20 bg-church-gold/10 rounded-full flex items-center justify-center">
//                 <Users className="w-10 h-10 text-church-gold" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-display font-bold text-church-navy">{ministry.name}</h1>
//                 {ministry.leader && (
//                   <p className="text-gray-600 mt-1">Led by {ministry.leader}</p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
//               {ministry.meetingDay && (
//                 <div className="flex items-center gap-3 text-gray-600">
//                   <Calendar className="w-5 h-5 text-church-gold" />
//                   <div>
//                     <p className="text-sm font-medium">Meeting Day</p>
//                     <p>{ministry.meetingDay}</p>
//                   </div>
//                 </div>
//               )}
//               {ministry.meetingTime && (
//                 <div className="flex items-center gap-3 text-gray-600">
//                   <Clock className="w-5 h-5 text-church-gold" />
//                   <div>
//                     <p className="text-sm font-medium">Meeting Time</p>
//                     <p>{ministry.meetingTime}</p>
//                   </div>
//                 </div>
//               )}
//               {ministry.venue && (
//                 <div className="flex items-center gap-3 text-gray-600">
//                   <MapPin className="w-5 h-5 text-church-gold" />
//                   <div>
//                     <p className="text-sm font-medium">Location</p>
//                     <p>{ministry.venue}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {ministry.description && (
//               <div className="mt-6">
//                 <h3 className="text-xl font-display font-bold text-church-navy mb-2">About This Ministry</h3>
//                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                   {ministry.description}
//                 </p>
//               </div>
//             )}

//             {ministry.socialLinks && (
//               <div className="mt-6 pt-6 border-t">
//                 <h3 className="text-xl font-display font-bold text-church-navy mb-4">Connect With Us</h3>
//                 <div className="flex gap-4">
//                   {ministry.socialLinks.instagram && (
//                     <a href={ministry.socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
//                        className="p-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
//                       Instagram
//                     </a>
//                   )}
//                   {ministry.socialLinks.facebook && (
//                     <a href={ministry.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
//                        className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
//                       Facebook
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="mt-6 pt-6 border-t">
//               <Link
//                 to="/contact"
//                 className="btn-primary inline-flex items-center gap-2"
//               >
//                 <Mail className="w-5 h-5" />
//                 Contact Ministry
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MinistryDetail;

// src/components/pages/MinistryDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin, Mail, Clock, User, Share2, Heart, Church, Music, BookOpen, UserPlus, GraduationCap, Globe, Footprints } from 'lucide-react';
import { ministryAPI } from '../../services/api';

function MinistryDetail() {
  const { id } = useParams();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default ministries data for fallback - ENHANCED with all ministries
  const defaultMinistries = {
    // 1. Youth Ministry
    'youth': {
      id: 'youth',
      name: 'Youth Ministry',
      description: 'Empowering the next generation to rise and shine for Christ. We focus on discipleship, worship, and building strong foundations for young people.\n\nOur youth ministry is a vibrant community where young people discover their identity in Christ, develop their gifts, and grow in their faith through engaging programs, worship, and fellowship.',
      leader: 'Pastor David',
      meetingDay: 'Saturday',
      meetingTime: '10:00 AM',
      venue: 'Youth Center',
      icon: <Users className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Raising the next generation'
    },
    // 2. Women's Ministry
    'women': {
      id: 'women',
      name: "Women's Ministry",
      description: 'A sisterhood of faith, love, and empowerment. Women walking together in purpose, prayer, and power to impact their families and communities.\n\nWe create a safe and supportive environment where women can grow spiritually, build meaningful relationships, and discover their God-given purpose.',
      leader: 'Pastor Sarah',
      meetingDay: 'Wednesday',
      meetingTime: '6:00 PM',
      venue: 'Fellowship Hall',
      icon: <Heart className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Sisters in faith, love, and power'
    },
    // 3. Men's Ministry
    'men': {
      id: 'men',
      name: "Men's Ministry",
      description: 'Building godly men of integrity, strength, and purpose. Men who lead their families, serve their churches, and impact their communities for Christ.\n\nOur men\'s ministry is dedicated to raising up men who will be strong leaders in their homes, churches, and communities.',
      leader: 'Pastor Michael',
      meetingDay: 'Thursday',
      meetingTime: '7:00 PM',
      venue: 'Main Auditorium',
      icon: <UserPlus className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Building godly men of integrity'
    },
    // 4. Children's Church
    'children': {
      id: 'children',
      name: "Children's Church",
      description: 'Raising young warriors for the Kingdom. Teaching children the Word of God through fun, interactive, and engaging lessons that build faith.\n\nWe believe that children are the future of the church. Our children\'s ministry provides a safe, fun, and nurturing environment where kids can learn about God\'s love.',
      leader: 'Sister Esther',
      meetingDay: 'Sunday',
      meetingTime: '9:00 AM',
      venue: "Children's Wing",
      icon: <BookOpen className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Path to Faith filled with Laughter'
    },
    // 5. Worship Team
    'worship': {
      id: 'worship',
      name: 'Worship Team',
      description: 'Leading the church into the presence of God through powerful worship and praise. A team of dedicated musicians and singers who minister through song.\n\nWe are passionate about creating an atmosphere where people can encounter God through music and worship. Our team is made up of talented musicians and singers who serve with excellence.',
      leader: 'Brother Andrew',
      meetingDay: 'Friday',
      meetingTime: '5:00 PM',
      venue: 'Main Auditorium',
      icon: <Music className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Leading the church in praise'
    },
    // 6. Prayer Ministry
    'prayer': {
      id: 'prayer',
      name: 'Prayer Ministry',
      description: 'The prayer engine of the church. Interceding for the church, the community, and the nations. Where miracles happen through persistent prayer.\n\nOur prayer ministry is the heartbeat of the church. We believe in the power of prayer to transform lives, heal the sick, and bring breakthrough.',
      leader: 'Pastor Grace',
      meetingDay: 'Tuesday',
      meetingTime: '5:00 AM',
      venue: 'Prayer Room',
      icon: <Church className="w-10 h-10 text-church-gold" />,
      image: '/images/prayer.jpg',
      subtitle: 'Dedicated intercessory prayer'
    },
    // 7. Campus Ministry - NEW
    'campus': {
      id: 'campus',
      name: 'Campus Ministry',
      description: 'Reaching students with the Gospel and transforming university campuses for Christ. Discipling young leaders who will impact their generation.\n\nOur campus ministry is passionate about reaching students with the love of Christ. We believe that university students are the future leaders of the church and the nation.',
      leader: 'Pastor Joshua',
      meetingDay: 'Saturday',
      meetingTime: '3:00 PM',
      venue: 'University Campus',
      icon: <GraduationCap className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Reaching students with the Gospel'
    },
    // 8. Outreach & Missions - NEW
    'outreach': {
      id: 'outreach',
      name: 'Outreach & Missions',
      description: 'Sharing the Gospel worldwide through missions, community service, and evangelism. Bringing hope and transformation to communities near and far.\n\nWe are committed to fulfilling the Great Commission by reaching the lost with the love of Christ through missions, community outreach, and evangelism.',
      leader: 'Pastor Mark',
      meetingDay: 'Monthly',
      meetingTime: 'Varies',
      venue: 'Various Locations',
      icon: <Globe className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Sharing God\'s love worldwide'
    },
    // 9. Discipleship Ministry - NEW
    'discipleship': {
      id: 'discipleship',
      name: 'Discipleship Ministry',
      description: 'Making disciples for Christ through mentorship, training, and equipping believers for ministry. Growing deeper in faith and knowledge of God.\n\nOur discipleship ministry is dedicated to helping believers grow in their faith and become mature disciples of Christ who can then disciple others.',
      leader: 'Pastor Peter',
      meetingDay: 'Wednesday',
      meetingTime: '7:00 PM',
      venue: 'Main Auditorium',
      icon: <Footprints className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Making disciples for Christ'
    },
    // 10. Family Ministry - NEW
    'family': {
      id: 'family',
      name: 'Family Ministry',
      description: 'Strengthening families through God\'s Word. Building strong marriages, godly parenting, and creating a legacy of faith for generations to come.\n\nWe believe that strong families are the foundation of a strong church. Our family ministry provides resources, support, and community for families to thrive.',
      leader: 'Pastor Daniel',
      meetingDay: 'Sunday',
      meetingTime: '2:00 PM',
      venue: 'Fellowship Hall',
      icon: <Users className="w-10 h-10 text-church-gold" />,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop&crop=center',
      subtitle: 'Building strong families in Christ'
    }
  };

  useEffect(() => {
    fetchMinistry();
  }, [id]);

  const fetchMinistry = async () => {
    try {
      setLoading(true);
      const response = await ministryAPI.getById(id);
      if (response.data.data) {
        setMinistry(response.data.data);
      } else {
        const defaultMinistry = defaultMinistries[id];
        if (defaultMinistry) {
          setMinistry(defaultMinistry);
        } else {
          setMinistry(null);
        }
      }
    } catch (error) {
      console.error('Error fetching ministry:', error);
      const defaultMinistry = defaultMinistries[id];
      if (defaultMinistry) {
        setMinistry(defaultMinistry);
      } else {
        setMinistry(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get color scheme for ministry
  const getColorScheme = (ministryName) => {
    const colorMap = {
      'Youth Ministry': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', from: 'from-blue-500', to: 'to-cyan-500', iconBg: 'bg-blue-100' },
      "Women's Ministry": { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', from: 'from-pink-500', to: 'to-rose-500', iconBg: 'bg-pink-100' },
      "Men's Ministry": { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', from: 'from-blue-700', to: 'to-indigo-600', iconBg: 'bg-blue-100' },
      "Children's Church": { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', from: 'from-green-500', to: 'to-emerald-500', iconBg: 'bg-green-100' },
      'Worship Team': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', from: 'from-purple-500', to: 'to-violet-500', iconBg: 'bg-purple-100' },
      'Prayer Ministry': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', from: 'from-amber-500', to: 'to-orange-500', iconBg: 'bg-amber-100' },
      'Campus Ministry': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', from: 'from-teal-500', to: 'to-cyan-500', iconBg: 'bg-teal-100' },
      'Outreach & Missions': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', from: 'from-green-500', to: 'to-emerald-500', iconBg: 'bg-green-100' },
      'Discipleship Ministry': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', from: 'from-indigo-500', to: 'to-purple-500', iconBg: 'bg-indigo-100' },
      'Family Ministry': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', from: 'from-rose-500', to: 'to-pink-500', iconBg: 'bg-rose-100' },
    };
    return colorMap[ministryName] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', from: 'from-gray-500', to: 'to-gray-600', iconBg: 'bg-gray-100' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-display font-bold text-church-navy">Ministry not found</h2>
        <Link to="/ministries" className="inline-block mt-4 bg-church-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">Back to Ministries</Link>
      </div>
    );
  }

  const colors = getColorScheme(ministry.name);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <Link to="/ministries" className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Ministries
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with gradient bar */}
          <div className={`h-2 bg-gradient-to-r ${colors.from} ${colors.to}`}></div>
          
          {/* Hero Image */}
          {ministry.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={ministry.image} 
                alt={ministry.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{ministry.name}</h1>
                {ministry.subtitle && (
                  <p className="text-white/80 text-sm mt-1">{ministry.subtitle}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="p-8">
            {/* Title Section - If no image */}
            {!ministry.image && (
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                  {ministry.icon || <Users className="w-10 h-10 text-church-gold" />}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-church-navy">{ministry.name}</h1>
                  {ministry.leader && (
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                      <User className="w-4 h-4 text-church-gold" />
                      Led by <span className="font-medium text-church-navy">{ministry.leader}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Leader - If image is present */}
            {ministry.image && ministry.leader && (
              <div className="flex items-center gap-2 text-gray-500 mt-4 mb-6">
                <User className="w-4 h-4 text-church-gold" />
                <span>Led by <span className="font-medium text-church-navy">{ministry.leader}</span></span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 p-4 bg-gray-50 rounded-xl">
              {ministry.meetingDay && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-church-gold" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Meeting Day</p>
                    <p className="font-medium">{ministry.meetingDay}</p>
                  </div>
                </div>
              )}
              {ministry.meetingTime && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-church-gold" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Meeting Time</p>
                    <p className="font-medium">{ministry.meetingTime}</p>
                  </div>
                </div>
              )}
              {ministry.venue && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-church-gold" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Location</p>
                    <p className="font-medium">{ministry.venue}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {ministry.description && (
              <div className="mt-6">
                <h3 className="text-xl font-display font-bold text-church-navy mb-3">About This Ministry</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line space-y-3">
                  {ministry.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {ministry.socialLinks && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-xl font-display font-bold text-church-navy mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  {ministry.socialLinks.instagram && (
                    <a href={ministry.socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
                      Instagram
                    </a>
                  )}
                  {ministry.socialLinks.facebook && (
                    <a href={ministry.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-church-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Join This Ministry
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: ministry.name,
                      text: `Join the ${ministry.name} at Generals of Grace Intl Church`,
                      url: window.location.href,
                    });
                  }
                }}
                className="border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all inline-flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinistryDetail;