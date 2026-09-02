import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { eventAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate, formatDateTime, EVENT_TYPES } from '../../utils';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(id);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getTypeLabel = (type) => {
    const found = EVENT_TYPES.find(t => t.id === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-display font-bold text-church-navy">Event not found</h2>
        <Link to="/events" className="btn-primary inline-block mt-4">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <Link to="/events" className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                  event.type === 'service' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'conference' ? 'bg-purple-100 text-purple-800' :
                  event.type === 'outreach' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {getTypeLabel(event.type)}
                </span>
                <h1 className="text-4xl font-display font-bold text-church-navy">{event.title}</h1>
              </div>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-church-gold" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>{formatDate(event.date)}</p>
                </div>
              </div>
              {event.time && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-church-gold" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p>{event.time}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-church-gold" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p>{event.venue || 'Main Auditorium'}</p>
                </div>
              </div>
            </div>

            {event.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none">
              <h3 className="text-xl font-display font-bold text-church-navy mb-2">About This Event</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.registrationRequired && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-display font-bold text-church-navy mb-4">Registration</h3>
                <button className="btn-primary">
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;