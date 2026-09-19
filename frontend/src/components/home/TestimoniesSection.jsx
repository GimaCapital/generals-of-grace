// src/components/home/TestimoniesSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Quote, ChevronLeft, ChevronRight, MapPin, Star, Heart, Play, X, Image as ImageIcon, Video } from 'lucide-react';
import { testimonyAPI } from '../../services/api';

function TestimoniesSection() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const response = await testimonyAPI.getAll({ limit: 10 });
      // console.log('📊 Testimonies data:', response.data.data);
      setTestimonies(response.data.data || []);
    } catch (error) {
      // console.error('Error fetching testimonies:', error);
      setTestimonies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testimonies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonies.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonies.length]);

  // ✅ Safe check for valid URLs
  const hasValidMedia = (value) => {
    return value && typeof value === 'string' && value.trim() !== '' && value.length > 5;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
            <p className="mt-4 text-gray-500">Loading testimonies...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonies.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-2xl font-display font-bold text-church-navy">No Testimonies Yet</h3>
            <p className="text-gray-500 mt-2">Be the first to share what God has done for you!</p>
            <Link 
              to="/submit-testimony" 
              className="inline-block mt-4 bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Share Your Testimony
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
      <div className="absolute top-20 right-10 opacity-10">
        <Quote className="w-32 h-32 text-church-gold" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Quote className="w-32 h-32 text-church-gold" />
      </div>

      <div className="container-custom">
        <div className="text-start mb-12">
          <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Testimonies</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mt-2">
            What GOD Is <span className="text-church-gold">Doing</span>
          </h2>
          <p className="text-gray-500 mt-1">Real stories of transformation from our members</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonies.map((testimony, index) => {
                const hasVideo = hasValidMedia(testimony.video);
                const hasImage = hasValidMedia(testimony.image);
                const hasMedia = hasVideo || hasImage;

                return (
                  <div key={testimony.id || index} className="min-w-full px-4">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                      <div className={hasMedia ? 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center' : ''}>
                        {/* Text Content */}
                        <div>
                          {testimony.featured && (
                            <div className="inline-flex items-center gap-1 bg-church-gold/10 text-church-gold text-xs font-bold px-3 py-1 rounded-full mb-4">
                              <Star className="w-3 h-3 fill-church-gold" />
                              Featured
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-church-gold mb-4">
                            <Quote className="w-8 h-8 fill-church-gold/10" />
                            <span className="text-sm font-medium text-church-gold/70">
                              Testimony {index + 1}
                            </span>
                          </div>

                          <p className="text-gray-700 text-lg md:text-xl italic leading-relaxed mb-6">
                            "{testimony.testimony}"
                          </p>

                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-church-gold to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                              {testimony.name?.charAt(0) || 'G'}
                            </div>
                            <div>
                              <p className="font-semibold text-church-navy text-lg">{testimony.name}</p>
                              {testimony.location && (
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {testimony.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ✅ Media Section - Show BOTH image and video if available */}
                        {hasMedia && (
                          <div className="space-y-3">
                            {/* Image */}
                            {hasImage && (
                              <div className="relative">
                                <img 
                                  src={testimony.image} 
                                  alt={testimony.name}
                                  className="w-full h-40 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setSelectedImage(testimony.image)}
                                />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  Photo
                                </div>
                              </div>
                            )}

                            {/* Video */}
                            {hasVideo && (
                              <div 
                                className="relative rounded-xl overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedVideo(testimony.video)}
                              >
                                <video 
                                  src={testimony.video} 
                                  className="w-full h-40 object-cover"
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                  <Play className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Video
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          {testimonies.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => prev === 0 ? testimonies.length - 1 : prev - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-church-navy hover:text-church-gold transition-all duration-300 z-10 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => (prev === testimonies.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-church-navy hover:text-church-gold transition-all duration-300 z-10 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex justify-center gap-2 mt-8">
                {testimonies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentIndex === index
                        ? 'w-10 h-2.5 bg-church-gold'
                        : 'w-2.5 h-2.5 bg-gray-300 hover:bg-church-gold/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="text-center mt-6">
            <Link to="/submit-testimony" className="text-sm text-church-gold hover:underline font-medium inline-flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Share Your Testimony →
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Testimony" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <video 
            src={selectedVideo} 
            controls 
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default TestimoniesSection;