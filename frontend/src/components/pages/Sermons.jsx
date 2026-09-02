// src/components/pages/Sermons.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, Calendar, User, Filter } from 'lucide-react';
import { sermonAPI } from '../../services/api';
import { formatDate, truncateText, SERMON_CATEGORIES } from '../../utils';

function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [liveStream, setLiveStream] = useState(null);

  useEffect(() => {
    fetchSermons();
    fetchLiveStream();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        search: searchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      };
      const response = await sermonAPI.getAll(params);
      setSermons(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      // console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveStream = async () => {
    try {
      const response = await sermonAPI.getLive();
      if (response.data && response.data.success && response.data.data) {
        setLiveStream(response.data.data);
      } else {
        setLiveStream(null);
      }
    } catch (error) {
      // console.error('Error fetching live stream:', error);
      setLiveStream(null);
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="section-title mb-4">Sermons</h1>
        <p className="section-subtitle mb-8">Watch, listen, and grow in the Word of God</p>

        {/* Live Stream - Only shows when there's an actual live sermon */}
        {liveStream && liveStream.isLive && (
          <div className="bg-church-navy text-white p-6 rounded-xl mb-8">
            <div className="flex items-center">
              <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              <h2 className="text-xl font-semibold">🔴 Live Now</h2>
            </div>
            <p className="mt-2">{liveStream.title}</p>
            <Link 
              to={`/sermons/${liveStream.id}`}
              className="mt-3 inline-block bg-church-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Watch Live
            </Link>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold appearance-none bg-white"
              >
                {SERMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sermons found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="card group">
                <div className="relative pb-[56.25%] bg-gray-200">
                  <img 
                    src={sermon.thumbnailUrl || '/images/sermon-placeholder.jpg'} 
                    alt={sermon.title}
                    className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  {sermon.isLive && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{truncateText(sermon.title, 40)}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    {sermon.speaker}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(sermon.date)}
                  </div>
                  <Link 
                    to={`/sermons/${sermon.id}`}
                    className="mt-3 inline-block text-church-gold font-medium text-sm hover:text-opacity-80"
                  >
                    Watch Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page 
                    ? 'bg-church-gold text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sermons;