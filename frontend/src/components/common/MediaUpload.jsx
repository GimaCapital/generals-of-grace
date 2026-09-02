// src/components/common/MediaUpload.jsx
import React, { useState } from 'react';
import { Upload, X, Loader2, Video, Image, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'church_uploads';

function MediaUpload({ 
  onUpload, 
  currentMedia, 
  label = 'Upload Media', 
  type = 'image',
  folder = 'sermons'
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentMedia || null);
  const [mediaType, setMediaType] = useState(type);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // ✅ Smart Upload - decides where to store
  const smartUpload = async (file) => {
    const fileSizeMB = file.size / (1024 * 1024);
    
    // ✅ Small file (< 100MB) → Cloudinary
    if (fileSizeMB < 100) {
      return await uploadToCloudinary(file);
    }
    
    // ✅ Large file (> 100MB) → Ask for YouTube URL
    toast.warning('Video is larger than 100MB. Please upload to YouTube and paste the URL.');
    setShowYoutubeInput(true);
    return null;
  };

  // ✅ Upload to Cloudinary (for small files)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', mediaType === 'video' ? 'video' : 'image');

    const endpoint = mediaType === 'video' ? 'video' : 'image';

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}/upload`,
        { method: 'POST', body: formData }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // ✅ Handle YouTube URL submission
  const handleYoutubeSubmit = () => {
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    // ✅ Extract YouTube video ID
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    onUpload(embedUrl);
    setPreview(embedUrl);
    setShowYoutubeInput(false);
    setYoutubeUrl('');
    toast.success('YouTube video added successfully!');
  };

  // ✅ Extract YouTube Video ID
  const extractYoutubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validation
    if (mediaType === 'image') {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image (JPEG, PNG, or WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      // ✅ Image → Always upload to Cloudinary
      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        const url = await uploadToCloudinary(file);
        onUpload(url);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
        setPreview(currentMedia || null);
      } finally {
        setUploading(false);
      }
    } else {
      // ✅ Video → Smart decision based on size
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      
      // ✅ Check if file is too large
      if (fileSizeMB > 100) {
        toast.warning(`Video is ${Math.round(fileSizeMB)}MB. Please upload to YouTube and paste the URL.`);
        setShowYoutubeInput(true);
        return;
      }

      // ✅ Small video → Upload to Cloudinary
      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        const url = await uploadToCloudinary(file);
        onUpload(url);
        toast.success('Video uploaded successfully to Cloudinary!');
      } catch (error) {
        toast.error('Failed to upload video');
        setPreview(currentMedia || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    setShowYoutubeInput(false);
    setYoutubeUrl('');
  };

  // ✅ Render preview (supports both image and video)
  const renderPreview = () => {
    if (!preview) return null;

    // ✅ YouTube embed preview
    if (preview.includes('youtube.com/embed')) {
      return (
        <div className="relative">
          <iframe
            src={preview}
            className="w-full h-48 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (mediaType === 'video') {
      return (
        <div className="relative">
          <video 
            src={preview} 
            className="w-full h-48 object-cover rounded-lg"
            controls
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <img 
          src={preview} 
          alt="Preview" 
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {/* ✅ Dynamic toggle - Image/Video */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMediaType('image')}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
              mediaType === 'image' 
                ? 'bg-church-gold text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Image className="w-4 h-4" />
            Image
          </button>
          <button
            type="button"
            onClick={() => setMediaType('video')}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
              mediaType === 'video' 
                ? 'bg-church-gold text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Video className="w-4 h-4" />
            Video
          </button>
        </div>
      </div>

      {/* ✅ YouTube URL Input (for large videos) */}
      {showYoutubeInput && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-2 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            Video too large. Paste YouTube URL instead:
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold"
            />
            <button
              type="button"
              onClick={handleYoutubeSubmit}
              className="btn-primary px-4 py-2"
            >
              Add Video
            </button>
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-church-gold transition-colors">
        {preview ? (
          renderPreview()
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer py-4">
            {mediaType === 'video' ? (
              <Video className="w-8 h-8 text-gray-400 mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500">
              Click to upload {mediaType}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {mediaType === 'video' 
                ? 'MP4, WEBM, MOV (max 100MB on Cloudinary)' 
                : 'PNG, JPG, WEBP (max 5MB)'}
            </span>
            <span className="text-xs text-church-gold mt-1">
              {mediaType === 'video' && 'Larger videos → Upload to YouTube'}
            </span>
            <input
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {uploading && (
        <p className="text-sm text-church-gold flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading {mediaType}...
        </p>
      )}
    </div>
  );
}

export default MediaUpload;