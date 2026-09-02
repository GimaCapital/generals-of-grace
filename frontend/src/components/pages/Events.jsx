import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Filter, Search } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { formatDate, truncateText, EVENT_TYPES } from '../../utils';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type) => {
    const found = EVENT_TYPES.find(t => t.id === type);
    return found ? found.label : type;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="section-title mb-4">Events</h1>
        <p className="section-subtitle mb-8">Join us in our upcoming services and programs</p>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold appearance-none bg-white"
              >
                <option value="all">All Events</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                {/* Event Image - Now showing */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={event.imageUrl || event.thumbnailUrl || '/images/event-placeholder.jpg'} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { 
                      e.target.src = '/images/event-placeholder.jpg'; 
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${
                      event.type === 'service' ? 'bg-blue-500' :
                      event.type === 'conference' ? 'bg-purple-500' :
                      event.type === 'outreach' ? 'bg-green-500' :
                      'bg-orange-500'
                    }`}>
                      {getTypeLabel(event.type)}
                    </span>
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-xl text-church-navy mb-2 line-clamp-2">
                    {truncateText(event.title, 30)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {truncateText(event.description, 60)}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-church-gold flex-shrink-0" />
                      {formatDate(event.date)}
                    </div>
                    {event.time && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-church-gold flex-shrink-0" />
                        {event.time}
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-church-gold flex-shrink-0" />
                      {event.venue || 'Main Auditorium'}
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="mt-4 inline-block w-full text-center bg-church-gold text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-church-gold/30"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;