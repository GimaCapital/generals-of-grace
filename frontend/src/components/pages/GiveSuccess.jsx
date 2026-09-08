// src/components/pages/GiveSuccess.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, Mail, ArrowRight, CreditCard, User, Hash, Heart, RefreshCw, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { givingAPI } from '../../services/api';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';

// ============================================
// CONSTANTS & HELPERS
// ============================================
const GIVING_TYPES = {
  tithe: 'Tithe',
  offering: 'Offering',
  seed: 'Seed Offering',
  building: 'Building Fund',
  mission: 'Missions',
  thanksgiving: 'Thanksgiving',
  custom: 'Custom Giving'
};

const getTypeDisplay = (type) => GIVING_TYPES[type?.toLowerCase()] || type || 'Giving';

// ============================================
// SUB-COMPONENTS
// ============================================
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader className="w-12 h-12 text-church-gold animate-spin mx-auto" />
      <p className="mt-4 text-gray-500">Loading donation details...</p>
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-display font-bold text-church-navy mb-2">
        Donation Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        We couldn't find your donation record. Please contact our support team or try again.
      </p>
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 w-full justify-center"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <Link
          to="/"
          className="border-2 border-gray-300 text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 w-full justify-center hover:bg-gray-50"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
function GiveSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);
  const [status, setStatus] = useState('verifying');
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchAttempted = useRef(false);
  const toastShown = useRef(false);

  const getReference = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get('reference') || 
           params.get('trxref') || 
           params.get('tx_ref') ||
           params.get('txref');
  }, [location.search]);

  const fetchDonation = useCallback(async () => {
    const ref = getReference();
    
    if (!ref) {
      setStatus('failed');
      setLoading(false);
      toast.error('No donation reference found');
      return;
    }

    try {
      setLoading(true);
      const response = await givingAPI.getByReference(ref);
      
      if (response.data.success) {
        const donationData = response.data.data;
        setDonation(donationData);
        setStatus('success');
        
        if (!toastShown.current) {
          toastShown.current = true;
          toast.success('🎉 Thank you for your generous giving!', {
            duration: 5000,
            position: 'top-center',
            icon: '✅'
          });
        }
      } else {
        setStatus('failed');
        toast.error(response.data.message || 'Failed to fetch donation');
      }
    } catch (error) {
      console.error('Error fetching donation:', error);
      setStatus('failed');
      toast.error(error.response?.data?.message || 'Failed to load donation details');
    } finally {
      setLoading(false);
    }
  }, [getReference]);

  useEffect(() => {
    if (fetchAttempted.current) return;
    
    const ref = getReference();
    if (ref) {
      fetchAttempted.current = true;
      fetchDonation();
    } else {
      setStatus('failed');
      setLoading(false);
      toast.error('No donation reference found');
    }
  }, [getReference, fetchDonation]);

  const handleRetry = useCallback(() => {
    fetchAttempted.current = false;
    toastShown.current = false;
    setRetryCount(prev => prev + 1);
    setStatus('verifying');
    setLoading(true);
    
    const ref = getReference();
    if (ref) {
      fetchDonation();
    }
  }, [getReference, fetchDonation]);

  if (loading) {
    return <LoadingState />;
  }

  if (status === 'failed' || !donation) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Success Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold text-church-navy mb-2">
            Giving Successful! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your generous giving to Generals of Grace Intl Church.
          </p>
          
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Loaded on attempt {retryCount + 1}
            </p>
          )}
        </div>

        {/* Donation Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
          <h3 className="font-semibold text-church-navy text-sm uppercase tracking-wider">
            Giving Details
          </h3>
          
          <div className="space-y-2 text-sm">
            {/* Tithe Number */}
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Tithe Number
              </span>
              <span className="font-mono text-xs text-church-navy break-all max-w-[180px] text-right">
                {donation.titheNumber || donation.user || 'N/A'}
              </span>
            </div>

            {/* Reference */}
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Reference
              </span>
              <span className="font-mono text-xs text-church-navy break-all max-w-[180px] text-right">
                {donation.reference || donation.paymentReference || 'N/A'}
              </span>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Amount
              </span>
              <span className="font-bold text-church-gold text-lg">
                {formatCurrency(donation.amount)}
              </span>
            </div>

            {/* Type */}
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Type
              </span>
              <span className="font-semibold text-church-navy capitalize">
                {getTypeDisplay(donation.type || donation.purpose)}
              </span>
            </div>

            {/* Name */}
            {donation.name && (
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </span>
                <span className="font-semibold text-church-navy">{donation.name}</span>
              </div>
            )}

            {/* Email */}
            {donation.email && (
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
                <span className="text-sm text-church-navy">{donation.email}</span>
              </div>
            )}

            {/* Payment Method - Always shows "Online Payment" */}
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-church-navy">
                Online Payment
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </span>
              <span className="text-church-navy">
                {formatDateTime(donation.createdAt || donation.date || donation.paidAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-6">
          <Mail className="w-4 h-4" />
          A receipt has been sent to your email.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/give"
            className="w-full block bg-church-gold text-church-navy py-3 rounded-xl font-semibold text-center hover:bg-opacity-90 transition-colors"
          >
            Make Another Donation
          </Link>

          <button
            onClick={() => navigate('/')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </button>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Having issues? Contact us at{' '}
          <a 
            href="mailto:support@generalsofgrace.com" 
            className="text-church-gold hover:underline"
          >
            support@generalsofgrace.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default GiveSuccess;