// src/components/pages/SubmitTestimony.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, User, Mail, MapPin, Tag, Loader } from 'lucide-react';
import { testimonyAPI } from '../../services/api';
import MediaUpload from '../common/MediaUpload';
import toast from 'react-hot-toast';

function SubmitTestimony() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image upload
  const handleImageUpload = (url) => {
    setFormData({ ...formData, image: url });
  };

  // ✅ Handle video upload
  const handleVideoUpload = (url) => {
    setFormData({ ...formData, video: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.testimony.trim()) {
      toast.error('Please write your testimony');
      return;
    }
    if (formData.testimony.length < 10) {
      toast.error('Testimony should be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      await testimonyAPI.submit(formData);
      toast.success('🎉 Testimony submitted! It will be reviewed by our team.');
      navigate('/testimonies');
    } catch (error) {
      console.error('Error submitting testimony:', error);
      toast.error(error.response?.data?.message || 'Failed to submit testimony');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-church-gold/20 to-church-gold/5 p-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-church-gold" />
              <div>
                <h1 className="text-3xl font-display font-bold text-church-navy">Share Your Testimony</h1>
                <p className="text-gray-500 text-sm">Tell us what God has done for you</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Sister Grace"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                  required
                />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>    
               <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +234 801 234 5678"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                  />
                </div>
             </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Port Harcourt"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Testimony */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Testimony <span className="text-red-500">*</span>
              </label>
              <textarea
                name="testimony"
                value={formData.testimony}
                onChange={handleChange}
                placeholder="Share what God has done for you..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-church-gold transition-colors resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.testimony.length} characters (minimum 10)
              </p>
            </div>

            <div>
              <MediaUpload
                onUpload={handleImageUpload}
                currentMedia={formData.image}
                label="Add Image (Optional)"
                type="image"
                folder="testimonies/images"
              />
            </div>

            <div>
              <MediaUpload
                onUpload={handleVideoUpload}
                currentMedia={formData.video}
                label="Add Video (Optional)"
                type="video"
                folder="testimonies/videos"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-church-gold text-church-navy py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30 inline-flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Testimony
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Your testimony will be reviewed before being published.
              We may edit for clarity or length.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitTestimony;