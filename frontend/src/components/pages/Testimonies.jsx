// src/components/pages/Testimonies.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Quote, Loader, Play, Video, X } from 'lucide-react';
import { testimonyAPI } from '../../services/api';
import { formatDate } from '../../utils';

function Testimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchTestimonies();
    fetchFeatured();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const response = await testimonyAPI.getAll({ limit: 20 });
      setTestimonies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await testimonyAPI.getAll({ limit: 1, featured: 'true' });
      if (response.data.data && response.data.data.length > 0) {
        setFeatured(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching featured:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 text-church-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-church-navy">
            What God Is <span className="text-church-gold">Doing</span>
          </h1>
          <p className="text-gray-500 mt-2">Real testimonies of God's faithfulness</p>
        </div>

        {/* Share Button */}
        <div className="text-center mb-8">
          <Link to="/submit-testimony" className="inline-flex items-center gap-2 bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30">
            <Heart className="w-5 h-5" />
            Share Your Testimony
          </Link>
        </div>

        {/* Featured Testimony */}
        {featured && (
          <div className="mb-10 bg-gradient-to-r from-church-gold/10 to-amber-50/30 rounded-2xl p-8 border border-church-gold/20 relative">
            <div className="absolute top-3 right-3 bg-church-gold text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Featured
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-start gap-2 text-church-gold mb-2">
                  <Quote className="w-8 h-8 fill-church-gold/10" />
                </div>
                <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-4">
                  "{featured.testimony}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-church-gold/20 flex items-center justify-center text-church-gold font-bold text-lg">
                    {featured.name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <p className="font-semibold text-church-navy">{featured.name}</p>
                    {featured.location && (
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {featured.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Media */}
              {(featured.image || featured.video) && (
                <div className="relative">
                  {featured.video ? (
                    <div 
                      className="relative rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedVideo(featured.video)}
                    >
                      <video src={featured.video} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  ) : featured.image ? (
                    <img 
                      src={featured.image} 
                      alt={featured.name}
                      className="w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(featured.image)}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testimonies Grid */}
        {testimonies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🙏</div>
            <p className="text-gray-500">No testimonies yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonies.map((testimony) => (
              <div key={testimony.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Media */}
                {(testimony.image || testimony.video) && (
                  <div className="relative h-48 bg-gray-200">
                    {testimony.video ? (
                      <div 
                        className="relative w-full h-full cursor-pointer group"
                        onClick={() => setSelectedVideo(testimony.video)}
                      >
                        <video src={testimony.video} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : testimony.image ? (
                      <img 
                        src={testimony.image} 
                        alt={testimony.name}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        onClick={() => setSelectedImage(testimony.image)}
                      />
                    ) : null}
                    
                    {testimony.video && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-2 text-church-gold/50 mb-2">
                    <Quote className="w-5 h-5" />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">
                    "{testimony.testimony}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-church-gold/10 flex items-center justify-center text-church-gold font-bold">
                        {testimony.name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <p className="font-semibold text-church-navy text-sm">{testimony.name}</p>
                        {testimony.location && (
                          <p className="text-xs text-gray-400">{testimony.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(testimony.createdAt)}
                    </div>
                  </div>
                  
                  {testimony.category && testimony.category !== 'general' && (
                    <div className="mt-3">
                      <span className="text-xs bg-church-gold/10 text-church-gold px-2 py-0.5 rounded-full capitalize">
                        {testimony.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
}

export default Testimonies;