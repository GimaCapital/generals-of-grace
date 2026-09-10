// src/components/pages/MinistryDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin, Mail, Clock, User, Share2, Heart, X } from 'lucide-react';
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
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ FULL WIDTH HERO IMAGE */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        {ministry.image ? (
          <>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${colors.from} ${colors.to} flex items-center justify-center`}>
            <Users className="w-24 h-24 text-white/30" />
          </div>
        )}

        {/* Back Button - Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <Link to="/ministries" className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-church-navy px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all group shadow-lg">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        {/* Coming Soon Badge */}
        {ministry.comingSoon && (
          <div className="absolute top-6 right-6 z-20 bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container-custom pb-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2">
                  {ministry.name}
                </h1>
                {ministry.subtitle && (
                  <p className="text-white/90 text-lg md:text-xl">{ministry.subtitle}</p>
                )}
                {ministry.leader && (
                  <p className="text-white/80 mt-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-church-gold" />
                    Led by <span className="font-medium text-white">{ministry.leader}</span>
                  </p>
                )}
              </div>
              {ministry.type && (
                <span className="text-sm font-semibold text-white bg-church-gold/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  {ministry.type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="container-custom py-12">
        {ministry.comingSoon ? (
          /* Coming Soon State */
          <div className="max-w-2xl mx-auto p-8 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-amber-700">This Ministry is Coming Soon!</h3>
            <p className="text-amber-600 mt-3">We're preparing something amazing for you. Stay tuned!</p>
            <p className="text-amber-500 text-sm mt-4 font-medium">Check back later for updates.</p>
          </div>
        ) : (
          <>
            {/* Row 1: About + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* About (2 columns) */}
              <div className="lg:col-span-2">
                {ministry.description && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
                    <h2 className="text-2xl font-display font-bold text-church-navy mb-4 flex items-center gap-3">
                      <span className={`w-1 h-8 bg-gradient-to-b ${colors.from} ${colors.to} rounded-full`}></span>
                      About This Ministry
                    </h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line space-y-3">
                      {ministry.description.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar (1 column) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${colors.from} ${colors.to}`}></div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-bold text-church-navy mb-4">
                      Meeting Information
                    </h3>
                    
                    <div className="space-y-4">
                      {ministry.meetingDay && (
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Calendar className="w-5 h-5 text-church-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Meeting Day</p>
                            <p className="font-semibold text-church-navy">{ministry.meetingDay}</p>
                          </div>
                        </div>
                      )}

                      {ministry.meetingTime && (
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Clock className="w-5 h-5 text-church-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time</p>
                            <p className="font-semibold text-church-navy">{ministry.meetingTime}</p>
                          </div>
                        </div>
                      )}

                      {ministry.venue && (
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <MapPin className="w-5 h-5 text-church-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Location</p>
                            <p className="font-semibold text-church-navy">{ministry.venue}</p>
                          </div>
                        </div>
                      )}

                      {ministry.leader && (
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <User className="w-5 h-5 text-church-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Leader</p>
                            <p className="font-semibold text-church-navy">{ministry.leader}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                      {ministry.comingSoon ? (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-xl font-semibold cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                          <Clock className="w-5 h-5" />
                          Coming Soon
                        </button>
                      ) : (
                        <Link
                          to="/contact"
                          className="w-full bg-church-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all inline-flex items-center justify-center gap-2"
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
                        className="w-full border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Main Video - FULL WIDTH */}
            {ministry.videoUrl && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-display font-bold text-church-navy mb-4 flex items-center gap-3">
                  <span className={`w-1 h-8 bg-gradient-to-b ${colors.from} ${colors.to} rounded-full`}></span>
                  Watch Video
                </h2>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <video 
                    src={ministry.videoUrl} 
                    controls
                    className="w-full h-full"
                    poster={ministry.image}
                  />
                </div>
              </div>
            )}

            {/* ✅ Row 3: Gallery + More Videos - FULL WIDTH SIDE BY SIDE */}
            {(ministry.galleryImages?.length > 0 || ministry.galleryVideos?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* LEFT: Gallery Images */}
                {ministry.galleryImages && ministry.galleryImages.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-3">
                      <span className={`w-1 h-6 bg-gradient-to-b ${colors.from} ${colors.to} rounded-full`}></span>
                      Gallery
                      <span className="text-xs font-normal text-gray-400 ml-auto">
                        {ministry.galleryImages.length} {ministry.galleryImages.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {ministry.galleryImages.map((img, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group"
                          onClick={() => {
                            setSelectedImage(img);
                            setShowGallery(true);
                          }}
                        >
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RIGHT: More Videos */}
                {ministry.galleryVideos && ministry.galleryVideos.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <h2 className="text-xl font-display font-bold text-church-navy mb-4 flex items-center gap-3">
                      <span className={`w-1 h-6 bg-gradient-to-b ${colors.from} ${colors.to} rounded-full`}></span>
                      More Videos
                      <span className="text-xs font-normal text-gray-400 ml-auto">
                        {ministry.galleryVideos.length} {ministry.galleryVideos.length === 1 ? 'video' : 'videos'}
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {ministry.galleryVideos.map((video, index) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-black">
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
              </div>
            )}
          </>
        )}
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