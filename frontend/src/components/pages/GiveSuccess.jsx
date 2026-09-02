// src/components/pages/GiveSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function GiveSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-church-navy mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your generous giving to Generals of Grace Intl Church.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          A receipt has been sent to your email.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full"
        >
          Return to Home
        </button>
        <p className="text-xs text-gray-400 mt-4">
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}

export default GiveSuccess;