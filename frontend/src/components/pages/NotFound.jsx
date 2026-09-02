import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-display font-bold text-church-gold">404</h1>
        <h2 className="text-3xl font-display font-bold text-church-navy mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 btn-primary"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;