import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Code, BookOpen, Users, Globe, Heart, Home, Info, Video, Library, Church, Gift, Share2 } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current path
  const currentPath = location.pathname;

  // Define page information based on the path - matching your header nav
  const getPageInfo = () => {
    const path = currentPath.toLowerCase();
    
    // Check each route
    if (path === '/' || path === '') {
      return {
        title: 'Home Page',
        message: 'We are preparing something special for you. Our homepage is being enhanced to serve you better.',
        icon: <Home className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/about')) {
      return {
        title: 'About Us',
        message: 'We are finalizing our story and mission. You will soon learn more about who we are and what we believe.',
        icon: <Info className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/soul-winning')) {
      return {
        title: 'Soul Winning',
        message: 'We are curating resources to equip you for soul winning. This page will be available soon.',
        icon: <Heart className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/sermons')) {
      return {
        title: 'Sermons',
        message: 'We are curating powerful sermons that will strengthen your faith. This page will be available soon.',
        icon: <Video className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/events')) {
      return {
        title: 'Events',
        message: 'We are preparing our upcoming events calendar. You will be able to see all our services and programs here.',
        icon: <Users className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/books')) {
      return {
        title: 'Books',
        message: 'We are compiling a collection of life-changing books. You will be able to explore and purchase them here.',
        icon: <BookOpen className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/bible-study')) {
      return {
        title: 'Bible Study',
        message: 'We are preparing Bible study materials to help you grow in your faith. This page will be available soon.',
        icon: <BookOpen className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/resources/')) {
      return {
        title: 'Resources',
        message: 'We are organizing a comprehensive resource library. You will find articles, videos, and more here.',
        icon: <Library className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/ministries')) {
      return {
        title: 'Ministries',
        message: 'We are organizing information about all our ministries. You will soon find your place in the body of Christ.',
        icon: <Church className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/give')) {
      return {
        title: 'Giving & Offerings',
        message: 'We are setting up a secure giving platform. Thank you for your patience as we build this page.',
        icon: <Gift className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/pastor-social')) {
      return {
        title: "Pastor's Social",
        message: 'We are connecting you with our pastor\'s social media presence. This page will be available soon.',
        icon: <Share2 className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/church-social')) {
      return {
        title: 'Church Social',
        message: 'We are connecting you with our church\'s social media presence. This page will be available soon.',
        icon: <Share2 className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/contact')) {
      return {
        title: 'Contact Us',
        message: 'We are setting up our contact page. You will be able to reach out to us easily and quickly.',
        icon: <Heart className="w-12 h-12 text-church-gold" />
      };
    }
    if (path.includes('/live')) {
      return {
        title: 'Live Stream',
        message: 'We are setting up our live stream page. You will soon be able to join us online.',
        icon: <Video className="w-12 h-12 text-church-gold" />
      };
    }
    
    // Default fallback
    return {
      title: 'Page Under Construction',
      message: "We're currently building this page to serve you better. Please check back soon.",
      icon: <Code className="w-12 h-12 text-church-gold" />
    };
  };

  const pageInfo = getPageInfo();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Icon */}
        <div className="w-24 h-24 bg-church-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-display font-bold text-church-gold">404</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-church-navy mb-3">
          {pageInfo.title}
        </h2>

        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          {pageInfo.message}
        </p>

        {/* Professional Dev Message */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
          <p className="text-gray-600 text-sm font-medium flex items-center justify-center gap-2">
            <span className="text-church-gold">{pageInfo.icon}</span>
            Our development team is working on this page
          </p>
          <p className="text-gray-400 text-xs mt-1">
            We apologize for the inconvenience. Please check back soon.
          </p>
        </div>

        {/* Dynamic Back Button */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 mt-8 text-church-navy hover:text-church-gold transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;