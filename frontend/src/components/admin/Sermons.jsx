// src/components/admin/Sermons.jsx
import React, { useState, useEffect } from 'react';
import { sermonAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import MediaUpload from '../common/MediaUpload';

function AdminSermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    description: '',
    date: '',
    videoUrl: '',
    thumbnailUrl: '',
    categories: [],
    status: 'draft',
    isLive: false  // ✅ Added
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await sermonAPI.getAll({ limit: 50 });
      setSermons(response.data.data || []);
    } catch (error) {
      // console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (url, type) => {
    if (type === 'image') {
      setFormData({ ...formData, thumbnailUrl: url });
    } else {
      setFormData({ ...formData, videoUrl: url });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSermon) {
        await sermonAPI.update(editingSermon.id, formData);
        toast.success('Sermon updated successfully!');
      } else {
        await sermonAPI.create(formData);
        toast.success('Sermon created successfully!');
      }
      setShowForm(false);
      setEditingSermon(null);
      setFormData({
        title: '',
        speaker: '',
        description: '',
        date: '',
        videoUrl: '',
        thumbnailUrl: '',
        categories: [],
        status: 'draft',
        isLive: false
      });
      fetchSermons();
    } catch (error) {
      toast.error('Error saving sermon');
      // console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
      try {
        await sermonAPI.delete(id);
        toast.success('Sermon deleted!');
        fetchSermons();
      } catch (error) {
        toast.error('Error deleting sermon');
        // console.error(error);
      }
    }
  };

  const handleEdit = (sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      description: sermon.description || '',
      date: sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : '',
      videoUrl: sermon.videoUrl || '',
      thumbnailUrl: sermon.thumbnailUrl || '',
      categories: sermon.categories || [],
      status: sermon.status || 'draft',
      isLive: sermon.isLive || false  // ✅ Added
    });
    setShowForm(true);
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
        <h1 className="text-3xl font-display font-bold text-church-navy">Manage Sermons</h1>
        <button
          onClick={() => {
            setEditingSermon(null);
            setFormData({
              title: '',
              speaker: '',
              description: '',
              date: '',
              videoUrl: '',
              thumbnailUrl: '',
              categories: [],
              status: 'draft',
              isLive: false
            });
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Sermon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-display font-bold text-church-navy mb-4">
              {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  required
                />
              </div>
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

              {/* ✅ Video Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => handleMediaUpload(url, 'video')}
                  currentMedia={formData.videoUrl}
                  label="Sermon Video"
                  type="video"
                  folder="sermons/videos"
                />
              </div>

              {/* ✅ Thumbnail Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => handleMediaUpload(url, 'image')}
                  currentMedia={formData.thumbnailUrl}
                  label="Sermon Thumbnail"
                  type="image"
                  folder="sermons/thumbnails"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* ✅ LIVE TOGGLE */}
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="isLive"
                  checked={formData.isLive || false}
                  onChange={(e) => setFormData({...formData, isLive: e.target.checked})}
                  className="h-5 w-5 text-church-gold focus:ring-church-gold border-gray-300 rounded"
                />
                <label htmlFor="isLive" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Mark as Live
                </label>
                <span className="text-xs text-gray-400">(This sermon will appear in the "Live Now" section)</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingSermon ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSermon(null);
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

      {/* Sermons List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Speaker</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Live</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((sermon) => (
                <tr key={sermon.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-church-gold" />
                      <span className="font-medium">{sermon.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">{sermon.speaker}</td>
                  <td className="px-6 py-3">{new Date(sermon.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sermon.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sermon.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {sermon.isLive ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-red-600">LIVE</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(sermon)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sermon.id)}
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

export default AdminSermons;