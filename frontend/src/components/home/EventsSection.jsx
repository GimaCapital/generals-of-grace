// src/components/home/EventsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { formatDate } from '../../utils';

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getAll({ limit: 6 });
        setEvents(response.data.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-church-gold"></div>
            <p className="mt-2 text-gray-500">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Join us in our upcoming services and programs</p>
          </div>
          <Link to="/events" className="text-church-gold hover:text-opacity-80 font-medium flex items-center group">
            View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={event.imageUrl || event.thumbnailUrl || '/images/event-placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/images/event-placeholder.jpg'; }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full capitalize ${
                    event.status === 'upcoming' ? 'bg-green-500' :
                    event.status === 'ongoing' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}>
                    {event.status || 'Event'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-display font-bold text-church-navy mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description || 'Join us for this event'}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-church-gold" />
                    <span>{formatDate(event.date)}</span>
                    {event.time && (
                      <>
                        <Clock className="w-4 h-4 text-church-gold ml-2" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-church-gold" />
                      <span>{event.venue}</span>
                    </div>
                  )}
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
      </div>
    </section>
  );
}

export default EventsSection;