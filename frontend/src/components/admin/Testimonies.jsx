// src/components/admin/Testimonies.jsx
import React, { useState, useEffect } from 'react';
import { testimonyAPI } from '../../services/api';
import toast from 'react-hot-toast';
import MediaUpload from '../common/MediaUpload';
import { 
  CheckCircle, XCircle, Trash2, Star, Clock, 
  Filter, Search, Loader, Mail, MapPin, 
  Video, X, Edit, Save, User, Tag
} from 'lucide-react';

function AdminTestimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  // ✅ Edit form data
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    location: '',
    testimony: '',
    category: 'general',
    image: '',
    video: ''
  });

  const categories = [
    { value: 'general', label: 'General Testimony' },
    { value: 'healing', label: 'Healing' },
    { value: 'deliverance', label: 'Deliverance' },
    { value: 'provision', label: 'Provision / Finances' },
    { value: 'salvation', label: 'Salvation' },
    { value: 'family', label: 'Family / Relationships' },
    { value: 'business', label: 'Business / Career' },
  ];

  useEffect(() => {
    fetchTestimonies();
    fetchStats();
  }, [filter]);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const response = await testimonyAPI.adminGetAll({ status: filter === 'all' ? undefined : filter });
      setTestimonies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
      toast.error('Failed to load testimonies');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await testimonyAPI.adminGetStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ✅ Open edit modal with testimony data
  const handleOpenEdit = (testimony) => {
    setSelectedTestimony(testimony);
    setEditFormData({
      name: testimony.name || '',
      email: testimony.email || '',
      location: testimony.location || '',
      testimony: testimony.testimony || '',
      category: testimony.category || 'general',
      image: testimony.image || '',
      video: testimony.video || ''
    });
    setShowEditModal(true);
  };

  // ✅ Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // ✅ Save edited testimony
  const handleSaveEdit = async () => {
    if (!editFormData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editFormData.testimony.trim()) {
      toast.error('Testimony is required');
      return;
    }

    setSaving(true);
    try {
      await testimonyAPI.adminUpdate(selectedTestimony.id, editFormData);
      toast.success('Testimony updated successfully!');
      setShowEditModal(false);
      setSelectedTestimony(null);
      fetchTestimonies();
    } catch (error) {
      console.error('Error updating testimony:', error);
      toast.error('Failed to update testimony');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await testimonyAPI.adminApprove(id);
      toast.success('Testimony approved!');
      fetchTestimonies();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve testimony');
    }
  };

  const handleReject = async (id) => {
    try {
      await testimonyAPI.adminReject(id, rejectReason);
      toast.success('Testimony rejected');
      setRejectReason('');
      setShowRejectModal(false);
      fetchTestimonies();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject testimony');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimony?')) {
      try {
        await testimonyAPI.adminDelete(id);
        toast.success('Testimony deleted');
        fetchTestimonies();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete testimony');
      }
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await testimonyAPI.adminToggleFeatured(id, !currentFeatured);
      toast.success(`Testimony ${!currentFeatured ? 'featured' : 'unfeatured'}`);
      fetchTestimonies();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredTestimonies = testimonies.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.testimony?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 text-church-gold animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-church-navy">Manage Testimonies</h1>
          <p className="text-gray-500 text-sm">Review, edit and approve user testimonies</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            {stats.pending} Pending
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {stats.approved} Approved
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-church-navy">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-yellow-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-green-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-red-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, testimony, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold appearance-none bg-white"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonies List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Testimony</th>
                <th className="px-6 py-3 font-medium">Media</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Featured</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No testimonies found
                  </td>
                </tr>
              ) : (
                filteredTestimonies.map((testimony) => (
                  <tr key={testimony.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-church-navy">{testimony.name}</p>
                        {testimony.email && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {testimony.email}
                          </p>
                        )}
                        {testimony.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {testimony.location}
                          </p>
                        )}
                        {testimony.editedByAdmin && (
                          <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            <Edit className="w-3 h-3" />
                            Edited by admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {testimony.testimony}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {testimony.image && (
                          <img 
                            src={testimony.image} 
                            alt={testimony.name}
                            className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(testimony.image)}
                            title="View Image"
                          />
                        )}
                        {testimony.video && (
                          <button
                            onClick={() => setSelectedVideo(testimony.video)}
                            className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                            title="View Video"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                        )}
                        {!testimony.image && !testimony.video && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs capitalize bg-gray-100 px-2 py-1 rounded-full">
                        {testimony.category || 'general'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(testimony.status)}`}>
                        {getStatusIcon(testimony.status)}
                        {testimony.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(testimony.id, testimony.featured)}
                        className={`p-1 rounded-lg transition-colors ${testimony.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-gray-400'}`}
                        title={testimony.featured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className={`w-5 h-5 ${testimony.featured ? 'fill-yellow-500' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        {/* ✅ Edit Button - Always visible */}
                        <button
                          onClick={() => handleOpenEdit(testimony)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit Testimony"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {testimony.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(testimony.id)}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTestimony(testimony);
                                setShowRejectModal(true);
                              }}
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(testimony.id)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal - Admin can edit before approving */}
      {showEditModal && selectedTestimony && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-church-navy">Edit Testimony</h2>
                <p className="text-sm text-gray-500">Edit before approving</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTestimony(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Testimony */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimony</label>
                <textarea
                  name="testimony"
                  value={editFormData.testimony}
                  onChange={handleEditChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {editFormData.testimony.length} characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => setEditFormData({ ...editFormData, image: url })}
                  currentMedia={editFormData.image}
                  label="Image"
                  type="image"
                  folder="testimonies/images"
                />
              </div>

              {/* Video Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => setEditFormData({ ...editFormData, video: url })}
                  currentMedia={editFormData.video}
                  label="Video"
                  type="video"
                  folder="testimonies/videos"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTestimony(null);
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 bg-church-gold text-church-navy py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedTestimony && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-display font-bold text-church-navy mb-2">Reject Testimony</h2>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to reject {selectedTestimony.name}'s testimony?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Why is this testimony being rejected?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedTestimony(null);
                }}
                className="flex-1 border-2 border-gray-300 text-gray-600 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTestimony.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminTestimonies;