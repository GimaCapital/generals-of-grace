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
import { ArrowLeft, Users, Calendar, MapPin, Mail, Clock, User, Share2, Heart, Image as ImageIcon, Video, X } from 'lucide-react';
import { ministryAPI } from '../../services/api';

function MinistryDetail() {
  const { id } = useParams();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        setMinistry(null);
      }
    } catch (error) {
      console.error('Error fetching ministry:', error);
      setMinistry(null);
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
          {/* Coming Soon Overlay */}
          {ministry.comingSoon && (
            <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4" />
              Coming Soon
            </div>
          )}

          {/* Header with gradient bar */}
          <div className={`h-2 bg-gradient-to-r ${colors.from} ${colors.to}`}></div>
          
          {/* Hero Image with Coming Soon Overlay */}
          {ministry.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={ministry.image} 
                alt={ministry.name}
                className="w-full h-full object-cover"
              />
              {ministry.comingSoon && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-amber-500/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-2xl flex items-center gap-3 shadow-2xl">
                    <Clock className="w-8 h-8" />
                    Coming Soon
                  </div>
                </div>
              )}
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
                  <Users className="w-10 h-10 text-church-gold" />
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

            {/* Type Badge */}
            {ministry.type && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-church-gold bg-church-gold/10 px-3 py-1 rounded-full">
                  {ministry.type}
                </span>
              </div>
            )}

            {/* Details Grid */}
            {ministry.comingSoon ? (
              <div className="my-6 p-6 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-amber-700">This Ministry is Coming Soon!</h3>
                <p className="text-amber-600 mt-2">We're preparing something amazing for you. Stay tuned!</p>
                <p className="text-amber-500 text-sm mt-3 font-medium">Check back later for updates.</p>
              </div>
            ) : (
              <>
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

                {/* Gallery Images */}
                {ministry.galleryImages && ministry.galleryImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-display font-bold text-church-navy mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ministry.galleryImages.map((img, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => {
                            setSelectedImage(img);
                            setShowGallery(true);
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video */}
                {ministry.videoUrl && (
                  <div className="mt-8">
                    <h3 className="text-xl font-display font-bold text-church-navy mb-4">Watch Video</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                      <video 
                        src={ministry.videoUrl} 
                        controls
                        className="w-full h-full"
                        poster={ministry.image}
                      />
                    </div>
                  </div>
                )}

                {/* Gallery Videos */}
                {ministry.galleryVideos && ministry.galleryVideos.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-display font-bold text-church-navy mb-4">More Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ministry.galleryVideos.map((video, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-black">
                          <video 
                            src={video} 
                            controls
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              {ministry.comingSoon ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed inline-flex items-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  Coming Soon
                </button>
              ) : (
                <Link
                  to="/contact"
                  className="bg-church-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-church-gold/30 hover:shadow-church-gold/50 inline-flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Join This Ministry
                </Link>
              )}
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

      {/* Gallery Modal */}
      {showGallery && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowGallery(false);
            setSelectedImage(null);
          }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => {
              setShowGallery(false);
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery full view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default MinistryDetail;