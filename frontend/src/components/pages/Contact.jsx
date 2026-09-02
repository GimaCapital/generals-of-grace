// src/components/pages/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';
import { SERVICE_TIMES, isValidEmail, required } from '../../utils';

function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!required(formData.name)) newErrors.name = 'Name is required';
    if (!isValidEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!required(formData.subject)) newErrors.subject = 'Subject is required';
    if (!required(formData.message)) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="section-title mb-6">Contact Us</h1>
        <p className="section-subtitle mb-8">We'd love to hear from you</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent`}
                  required
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent`}
                  required
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-display font-bold text-church-navy mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-gray-600">{settings?.siteAddress || 'Opp Happy Rolling Junction Alakahia Port Harcourt, Rivers State, Nigeria'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-600">{settings?.sitePhone || '+234 81234566789'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">{settings?.siteEmail || 'info@generalsofgrace.org'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-church-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Service Times</h4>
                    {SERVICE_TIMES.map((service, index) => (
                      <p key={index} className="text-gray-600">{service.day}: {service.time}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;