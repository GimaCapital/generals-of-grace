// src/components/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-church-navy mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-4">
            We've sent a password reset link to:
          </p>
          <p className="font-medium text-church-gold">{email}</p>
          <p className="text-sm text-gray-500 mt-4">
            Click the link in the email to reset your password.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block btn-primary w-full"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-church-navy mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
        
        <h2 className="text-3xl font-display font-bold text-church-navy mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-gold focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-church-gold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;