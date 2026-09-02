// src/components/pages/SermonDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Download, Share2 } from 'lucide-react';
import ReactPlayer from 'react-player';
import { sermonAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate, getYouTubeEmbedUrl } from '../../utils';

function SermonDetail() {
  const { id } = useParams();
  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    fetchSermon();
  }, [id]);

  const fetchSermon = async () => {
    try {
      setLoading(true);
      const response = await sermonAPI.getById(id);
      setSermon(response.data.data);
    } catch (error) {
      console.error('Error fetching sermon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sermon.title,
        text: `Watch "${sermon.title}" by ${sermon.speaker}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ✅ Check if video URL is a YouTube link or Cloudinary link
  const getVideoUrl = (url) => {
    if (!url) return null;
    
    // ✅ If it's a YouTube URL, use the embed function
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    }
    
    // ✅ If it's a Cloudinary URL, use it directly
    if (url.includes('cloudinary.com')) {
      return url;
    }
    
    // ✅ Otherwise, use the URL as is
    return url;
  };

  // ✅ Check if video is a Cloudinary video
  const isCloudinaryVideo = (url) => {
    return url && url.includes('cloudinary.com') && url.includes('/video/upload/');
  };

  // ✅ Check if video is a YouTube video
  const isYouTubeVideo = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-display font-bold text-church-navy">Sermon not found</h2>
        <Link to="/sermons" className="btn-primary inline-block mt-4">Back to Sermons</Link>
      </div>
    );
  }

  // ✅ Get the correct video URL
  const videoUrl = getVideoUrl(sermon.videoUrl);
  const isCloudinary = isCloudinaryVideo(sermon.videoUrl);
  const isYouTube = isYouTubeVideo(sermon.videoUrl);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <Link to="/sermons" className="inline-flex items-center gap-2 text-church-gold hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Sermons
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* ✅ Video Player - Works with both YouTube and Cloudinary */}
          <div className="relative bg-black aspect-video">
            {videoUrl ? (
              isCloudinary ? (
                // ✅ Use native video tag for Cloudinary
                <video
                  controls
                  className="w-full h-full"
                  poster={sermon.thumbnailUrl}
                  controlsList="nodownload"
                  onError={() => setVideoError(true)}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // ✅ Use ReactPlayer for YouTube
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing={false}
                  config={{
                    youtube: {
                      playerVars: { modestbranding: 1, rel: 0 }
                    }
                  }}
                  onError={() => {
                    console.error('Video playback error');
                    setVideoError(true);
                  }}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No video available
              </div>
            )}
            
            {/* ✅ Show error message if video fails to load */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center text-white p-4">
                  <p className="text-lg font-semibold mb-2">⚠️ Video Unavailable</p>
                  <p className="text-sm text-gray-400">The video could not be loaded.</p>
                  {isCloudinary && (
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-church-gold hover:underline"
                    >
                      Try opening directly
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold text-church-navy">{sermon.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{sermon.speaker}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(sermon.date)}</span>
                  </div>
                  {isCloudinary && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Cloudinary</span>
                  )}
                  {isYouTube && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">YouTube</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
                {sermon.audioUrl && (
                  <a 
                    href={sermon.audioUrl} 
                    download
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 text-gray-500" />
                  </a>
                )}
              </div>
            </div>

            {sermon.scripture && sermon.scripture.length > 0 && (
              <div className="mt-4 p-4 bg-church-navy/5 rounded-lg">
                <p className="text-sm font-medium text-church-navy">Scripture Reference</p>
                <p className="text-gray-700">{sermon.scripture.join(', ')}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-display font-bold text-church-navy mb-2">About This Message</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {sermon.description || 'No description available.'}
              </p>
            </div>

            {sermon.categories && sermon.categories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {sermon.categories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SermonDetail;