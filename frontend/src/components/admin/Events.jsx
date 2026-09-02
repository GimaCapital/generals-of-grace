// src/components/admin/Events.jsx
import React, { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import MediaUpload from '../common/MediaUpload';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    type: 'service',
    registrationRequired: false,
    capacity: '',
    status: 'upcoming',
    thumbnailUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll({ limit: 50 });
      setEvents(response.data.data || []);
    } catch (error) {
      // console.error('Error fetching events:', error);
      toast.error('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (url) => {
    setFormData({ ...formData, thumbnailUrl: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate required fields
    if (!formData.title || !formData.date) {
      toast.error('Title and Date are required');
      return;
    }

    try {
      // ✅ Send the correct field name: imageUrl (not thumbnailUrl)
      const payload = {
        title: formData.title,
        description: formData.description || '',
        date: formData.date,
        time: formData.time || '',
        venue: formData.venue || '',
        type: formData.type || 'service',
        status: formData.status || 'upcoming',
        registrationRequired: formData.registrationRequired || false,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        imageUrl: formData.thumbnailUrl || ''  // ✅ Changed from thumbnailUrl to imageUrl
      };

      console.log('📤 Sending event payload:', payload);

      if (editingEvent) {
        await eventAPI.update(editingEvent.id, payload);
        toast.success('Event updated successfully!');
      } else {
        await eventAPI.create(payload);
        toast.success('Event created successfully!');
      }
      
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        type: 'service',
        registrationRequired: false,
        capacity: '',
        status: 'upcoming',
        thumbnailUrl: ''
      });
      fetchEvents();
    } catch (error) {
      // console.error('❌ Error saving event:', error);
      // console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error saving event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        toast.success('Event deleted!');
        fetchEvents();
      } catch (error) {
        // console.error('Error deleting event:', error);
        toast.error('Error deleting event');
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '',
      venue: event.venue || '',
      type: event.type || 'service',
      registrationRequired: event.registrationRequired || false,
      capacity: event.capacity || '',
      status: event.status || 'upcoming',
      thumbnailUrl: event.imageUrl || event.thumbnailUrl || ''  // ✅ Handle both field names
    });
    setShowForm(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-church-navy">Manage Events</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              time: '',
              venue: '',
              type: 'service',
              registrationRequired: false,
              capacity: '',
              status: 'upcoming',
              thumbnailUrl: ''
            });
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-display font-bold text-church-navy mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  placeholder="Main Auditorium"
                />
              </div>

              {/* ✅ Event Image Upload */}
              <div>
                <MediaUpload
                  onUpload={handleMediaUpload}
                  currentMedia={formData.thumbnailUrl}
                  label="Event Image"
                  type="image"
                  folder="events"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="service">Service</option>
                    <option value="conference">Conference</option>
                    <option value="outreach">Outreach</option>
                    <option value="prayer_meeting">Prayer Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.registrationRequired}
                  onChange={(e) => setFormData({...formData, registrationRequired: e.target.checked})}
                  className="h-4 w-4 text-church-gold focus:ring-church-gold border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Registration Required</label>
              </div>
              {formData.registrationRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                    placeholder="100"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingEvent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-church-gold" />
                      {new Date(event.date).toLocaleDateString()}
                      {event.time && (
                        <>
                          <Clock className="w-4 h-4 text-church-gold ml-2" />
                          {event.time}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="capitalize">{event.type?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;