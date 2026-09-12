// src/components/admin/Ministries.jsx
import React, { useState, useEffect } from 'react';
import { ministryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, User, Clock, X, Image, Video, Upload, Save } from 'lucide-react';
import MediaUpload from '../common/MediaUpload';

function AdminMinistries() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    meetingDay: '',
    meetingTime: '',
    venue: '',
    subtitle: '',
    type: 'ministry',
    status: 'active',
    image: '',
    galleryImages: [],
    videoUrl: '',
    galleryVideos: [],
    comingSoon: false,
    date: ''
  });

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await ministryAPI.getAll({ limit: 50 });
      setMinistries(response.data.data || []);
    } catch (error) {
      // console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (url, type) => {
    if (type === 'main') {
      setFormData({ ...formData, image: url });
    } else if (type === 'gallery') {
      setFormData({ 
        ...formData, 
        galleryImages: [...formData.galleryImages, url] 
      });
    } else if (type === 'video') {
      setFormData({ ...formData, videoUrl: url });
    } else if (type === 'gallery-video') {
      setFormData({ 
        ...formData, 
        galleryVideos: [...formData.galleryVideos, url] 
      });
    }
  };

  // ✅ Single handler for BOTH single and bulk uploads
  const handleGalleryUpload = (urls) => {
    if (!urls) return;
    
    const urlsArray = Array.isArray(urls) ? urls : [urls];
    
    if (urlsArray.length > 0) {
      setFormData({ 
        ...formData, 
        galleryImages: [...formData.galleryImages, ...urlsArray] 
      });
      toast.success(`${urlsArray.length} image(s) uploaded successfully!`);
    }
  };

  // ✅ Single handler for BOTH single and bulk video uploads
  const handleGalleryVideoUpload = (urls) => {
    if (!urls) return;
    
    const urlsArray = Array.isArray(urls) ? urls : [urls];
    
    if (urlsArray.length > 0) {
      setFormData({ 
        ...formData, 
        galleryVideos: [...formData.galleryVideos, ...urlsArray] 
      });
      toast.success(`${urlsArray.length} video(s) uploaded successfully!`);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...formData.galleryImages];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: newGallery });
  };

  const removeGalleryVideo = (index) => {
    const newGallery = [...formData.galleryVideos];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryVideos: newGallery });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMinistry) {
        await ministryAPI.update(editingMinistry.id, formData);
        toast.success('Ministry updated successfully!');
      } else {
        await ministryAPI.create(formData);
        toast.success('Ministry created successfully!');
      }
      closeForm();
      fetchMinistries();
    } catch (error) {
      toast.error('Error saving ministry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ministry?')) {
      try {
        await ministryAPI.delete(id);
        toast.success('Ministry deleted!');
        fetchMinistries();
      } catch (error) {
        toast.error('Error deleting ministry');
      }
    }
  };

  const handleEdit = (ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description || '',
      leader: ministry.leader || '',
      meetingDay: ministry.meetingDay || '',
      meetingTime: ministry.meetingTime || '',
      venue: ministry.venue || '',
      subtitle: ministry.subtitle || '',
      type: ministry.type || 'ministry',
      status: ministry.status || 'active',
      image: ministry.image || '',
      galleryImages: ministry.galleryImages || [],
      videoUrl: ministry.videoUrl || '',
      galleryVideos: ministry.galleryVideos || [],
      comingSoon: ministry.comingSoon || false,
      date: ministry.date ? new Date(ministry.date).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  // ✅ Reset form and close
  const closeForm = () => {
    setShowForm(false);
    setEditingMinistry(null);
    setFormData({
      name: '',
      description: '',
      leader: '',
      meetingDay: '',
      meetingTime: '',
      venue: '',
      subtitle: '',
      type: 'ministry',
      status: 'active',
      image: '',
      galleryImages: [],
      videoUrl: '',
      galleryVideos: [],
      comingSoon: false,
      date: ''
    });
  };

  // ✅ Open form for new ministry
  const openNewForm = () => {
    setEditingMinistry(null);
    setFormData({
      name: '',
      description: '',
      leader: '',
      meetingDay: '',
      meetingTime: '',
      venue: '',
      subtitle: '',
      type: 'ministry',
      status: 'active',
      image: '',
      galleryImages: [],
      videoUrl: '',
      galleryVideos: [],
      comingSoon: false,
      date: ''
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
        <h1 className="text-3xl font-display font-bold text-church-navy">Manage Ministries</h1>
        <button
          onClick={openNewForm}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Ministry
        </button>
      </div>

      {/* ✅ Form Modal with Close Button at Top */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* ✅ STICKY HEADER WITH CLOSE BUTTON */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10 rounded-t-xl">
              <div>
                <h2 className="text-2xl font-display font-bold text-church-navy">
                  {editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingMinistry ? 'Update ministry details' : 'Fill in the details below'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Close"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Youth Ministry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="e.g., Raising the next generation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Leader */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leader</label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({...formData, leader: e.target.value})}
                  placeholder="e.g., Pastor David"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="ministry">Ministry</option>
                    <option value="fellowship">Fellowship</option>
                    <option value="group">Group</option>
                    <option value="program">Program</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Meeting Day & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Day</label>
                  <select
                    value={formData.meetingDay}
                    onChange={(e) => setFormData({...formData, meetingDay: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
                  <select
                    value={formData.meetingTime}
                    onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  >
                    <option value="">Select Time</option>
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  placeholder="e.g., Youth Center"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                />
              </div>

              {/* Main Image Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => handleMediaUpload(url, 'main')}
                  currentMedia={formData.image}
                  label="Main Ministry Image"
                  type="image"
                  folder="ministries"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                  <span className="text-xs text-gray-400">{formData.galleryImages.length} images</span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-church-gold transition-colors">
                  <MediaUpload
                    onUpload={handleGalleryUpload}
                    currentMedia=""
                    label=""
                    type="image"
                    folder="ministries/gallery"
                    showUploadButton={true}
                    multiple={true}
                    buttonText="+ Add Images (Select one or multiple)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Select one image or hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                {formData.galleryImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {formData.galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Video Upload */}
              <div>
                <MediaUpload
                  onUpload={(url) => handleMediaUpload(url, 'video')}
                  currentMedia={formData.videoUrl}
                  label="Main Ministry Video"
                  type="video"
                  folder="ministries/videos"
                />
                {formData.videoUrl && (
                  <div className="mt-2">
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video uploaded successfully
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Videos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Gallery Videos</label>
                  <span className="text-xs text-gray-400">{formData.galleryVideos.length} videos</span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-church-gold transition-colors">
                  <MediaUpload
                    onUpload={handleGalleryVideoUpload}
                    currentMedia=""
                    label=""
                    type="video"
                    folder="ministries/gallery-videos"
                    showUploadButton={true}
                    multiple={true}
                    buttonText="+ Add Videos (Select one or multiple)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Select one video or hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                {formData.galleryVideos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.galleryVideos.map((video, index) => (
                      <div key={index} className="relative group flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Video className="w-5 h-5 text-church-gold flex-shrink-0" />
                        <span className="text-sm text-gray-600 flex-1 truncate">
                          Video {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGalleryVideo(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the ministry..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
                  rows="3"
                />
              </div>

              {/* Coming Soon Toggle */}
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="comingSoon"
                  checked={formData.comingSoon || false}
                  onChange={(e) => setFormData({...formData, comingSoon: e.target.checked})}
                  className="h-5 w-5 text-church-gold focus:ring-church-gold border-gray-300 rounded"
                />
                <label htmlFor="comingSoon" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Coming Soon
                </label>
                <span className="text-xs text-gray-400">(This ministry will show as "Coming Soon")</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingMinistry ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Ministries List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Ministry</th>
                <th className="px-6 py-3 font-medium">Leader</th>
                <th className="px-6 py-3 font-medium">Schedule</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Media</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ministries.map((ministry) => (
                <tr key={ministry.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {ministry.image ? (
                        <img 
                          src={ministry.image} 
                          alt={ministry.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-church-gold/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-church-gold" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-church-navy">{ministry.name}</p>
                        {ministry.subtitle && (
                          <p className="text-xs text-gray-400">{ministry.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {ministry.leader ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{ministry.leader}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {ministry.meetingDay && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-church-gold flex-shrink-0" />
                          <span>{ministry.meetingDay}</span>
                          {ministry.meetingTime && (
                            <span className="text-gray-400">• {ministry.meetingTime}</span>
                          )}
                        </div>
                      )}
                      {ministry.venue && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{ministry.venue}</span>
                        </div>
                      )}
                      {!ministry.meetingDay && !ministry.venue && (
                        <span className="text-sm text-gray-400">No schedule set</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                        ministry.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ministry.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {ministry.status || 'active'}
                      </span>
                      {ministry.comingSoon && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 w-fit">
                          <Clock className="w-3 h-3" />
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {ministry.image && (
                        <div className="flex items-center gap-0.5 text-xs text-gray-500" title="Main Image">
                          <Image className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-700">1</span>
                        </div>
                      )}
                      {ministry.galleryImages?.length > 0 && (
                        <div className="flex items-center gap-0.5 text-xs text-gray-500" title="Gallery Images">
                          <Image className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-gray-700">{ministry.galleryImages.length}</span>
                        </div>
                      )}
                      {ministry.videoUrl && (
                        <div className="flex items-center gap-0.5 text-xs text-gray-500" title="Main Video">
                          <Video className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-700">1</span>
                        </div>
                      )}
                      {ministry.galleryVideos?.length > 0 && (
                        <div className="flex items-center gap-0.5 text-xs text-gray-500" title="Gallery Videos">
                          <Video className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-gray-700">{ministry.galleryVideos.length}</span>
                        </div>
                      )}
                      {!ministry.image && !ministry.galleryImages?.length && 
                       !ministry.videoUrl && !ministry.galleryVideos?.length && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(ministry)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Ministry"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ministry.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Ministry"
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

export default AdminMinistries;