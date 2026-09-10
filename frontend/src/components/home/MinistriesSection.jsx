// src/components/home/MinistriesSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ChevronRight, Image as ImageIcon, Video } from 'lucide-react';
import { ministryAPI } from '../../services/api';

function MinistriesSection() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoading(true);
        const response = await ministryAPI.getAll();
        setMinistries(response.data.data || []);
      } catch (error) {
        console.error('Error fetching ministries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistries();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
            <p className="mt-4 text-gray-500">Loading ministries...</p>
          </div>
        </div>
      </section>
    );
  }

  if (ministries.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="mb-12">
          <p className="text-red-600 text-xs md:text-sm font-semibold uppercase tracking-widest">GET INVOLVED</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy">Ministries</h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">TO LEADING LIGHT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.slice(0, 6).map((ministry) => (
            <Link key={ministry.id} to={`/ministries/${ministry.id}`} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block">
              <div className="relative h-72 overflow-hidden bg-gray-200">
                {ministry.image ? (
                  <img src={ministry.image} alt={ministry.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-church-gold/20 to-church-gold/5 flex items-center justify-center">
                    <Users className="w-16 h-16 text-church-gold/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {ministry.comingSoon && (
                  <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Clock className="w-3.5 h-3.5" />
                    Coming Soon
                  </div>
                )}

                {ministry.videoUrl && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Watch
                  </div>
                )}

                {ministry.galleryImages?.length > 0 && (
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {ministry.galleryImages.length}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{ministry.name}</h3>
                  <p className="text-white/80 text-sm">{ministry.subtitle || 'Join us in serving the Lord'}</p>
                  {ministry.leader && <p className="text-white/60 text-xs mt-1">Led by {ministry.leader}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {ministries.length > 6 && (
          <div className="text-center mt-10">
            <Link to="/ministries" className="inline-flex items-center gap-2 bg-church-gold text-church-navy px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30">
              View All Ministries
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default MinistriesSection;