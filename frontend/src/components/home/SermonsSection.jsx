// src/components/home/SermonsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronRight, ArrowRight } from 'lucide-react';
import { sermonAPI } from '../../services/api';
import { formatDate, truncateText } from '../../utils';

function SermonsSection() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        const response = await sermonAPI.getAll({ limit: 3, featured: true });
        setSermons(response.data.data || []);
      } catch (error) {
        console.error('Error fetching sermons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-church-gold"></div>
            <p className="mt-2 text-gray-500">Loading sermons...</p>
          </div>
        </div>
      </section>
    );
  }

  if (sermons.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="section-title">Featured Sermons</h2>
            <p className="section-subtitle">Powerful messages to strengthen your faith</p>
          </div>
          <Link to="/sermons" className="text-church-gold hover:text-opacity-80 font-medium flex items-center group">
            View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="card group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative pb-[56.25%] bg-gray-200">
                <img
                  src={sermon.thumbnailUrl || '/images/sermon-placeholder.jpg'}
                  alt={sermon.title}
                  className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-church-navy">{truncateText(sermon.title, 30)}</h3>
                <p className="text-gray-600 text-sm">{sermon.speaker}</p>
                <p className="text-xs text-gray-400">{formatDate(sermon.date)}</p>
                <Link
                  to={`/sermons/${sermon.id}`}
                  className="mt-3 inline-block text-church-gold font-medium text-sm hover:text-opacity-80 group"
                >
                  Watch Now <ArrowRight className="w-3 h-3 inline-block group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SermonsSection;