// frontend/src/components/pages/OrderConfirmation.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft, Package, CreditCard, BookOpen, Download, RefreshCw, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../services/api';

// ============================================
// CONSTANTS & HELPERS (moved outside component)
// ============================================
const PAYMENT_METHODS = {
  flutterwave: 'Flutterwave',
  paystack: 'Paystack',
  cash: 'Cash',
  bank_transfer: 'Bank Transfer'
};

const ITEM_TYPES = {
  book: '📖 Book',
  merch: '👕 Merchandise',
  resource: '📚 Resource',
  dvd: '💿 DVD',
  cd: '💿 CD',
  apparel: '👔 Apparel',
  other: '📦 Other'
};

const getItemTypeLabel = (type) => ITEM_TYPES[type] || type || '📦 Item';
const getPaymentMethodDisplay = (method) => PAYMENT_METHODS[method] || method || 'Unknown';

const getPaymentType = (order) => {
  const payment = order.paymentResponse || {};
  return (payment.payment_type || payment.channel || payment.authorization?.channel || 'N/A').toUpperCase();
};

const getTransactionRef = (order) => {
  const payment = order.paymentResponse || {};
  return payment.tx_ref || payment.reference || order.paymentReference || 'N/A';
};

const getPaymentStatus = (order) => {
  const status = order.paymentStatus || order.status || '';
  if (['paid', 'PAID', 'confirmed', 'CONFIRMED', 'success'].includes(status)) {
    return { label: '✅ Paid', className: 'bg-green-100 text-green-800' };
  }
  if (['pending', 'PENDING', 'processing'].includes(status)) {
    return { label: '⏳ Pending', className: 'bg-yellow-100 text-yellow-800' };
  }
  return { label: '❌ Failed', className: 'bg-red-100 text-red-800' };
};

// ============================================
// SUB-COMPONENTS (for better readability)
// ============================================
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader className="w-12 h-12 text-church-gold animate-spin mx-auto" />
      <p className="mt-4 text-gray-500">Verifying your payment...</p>
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-display font-bold text-church-navy mb-2">
        Payment Verification Failed
      </h1>
      <p className="text-gray-600 mb-6">
        We couldn't verify your payment. Please contact our support team or try again.
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

const OrderItem = ({ item }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
    <div>
      <p className="font-medium text-church-navy">{item.title}</p>
      <p className="text-sm text-gray-500">
        {getItemTypeLabel(item.type)} • Quantity: {item.quantity}
      </p>
      {item.description && (
        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
      )}
    </div>
    <p className="font-semibold text-church-gold">
      ₦{item.total.toLocaleString()}
    </p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
function OrderConfirmation() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  
  // State
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('verifying');
  const [retryCount, setRetryCount] = useState(0);
  
  // Refs for preventing duplicate calls
  const verificationAttempted = useRef(false);
  const toastShown = useRef(false);

  // Get reference from URL params (supports multiple payment gateways)
  const reference = useCallback(() => {
    return searchParams.get('reference') || 
           searchParams.get('trxref') || 
           searchParams.get('tx_ref') ||
           searchParams.get('txref');
  }, [searchParams]);

  // ============================================
  // API FUNCTIONS
  // ============================================
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(orderId);
      
      if (response.data.success) {
        setOrder(response.data.data);
        setStatus('success');
        
        // Only show toast once
        if (!toastShown.current) {
          toastShown.current = true;
          toast.success('✅ Order found!');
        }
      } else {
        setStatus('failed');
        toast.error(response.data.message || 'Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setStatus('failed');
      toast.error('Unable to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const verifyPayment = useCallback(async () => {
    const ref = reference();
    
    try {
      setLoading(true);
      
      const response = await orderAPI.verifyPayment(ref);
      
      if (response.data.success) {
        const orderData = response.data.data.order || response.data.data;
        setOrder(orderData);
        setStatus('success');
        
        // Only show toast once
        if (!toastShown.current) {
          toastShown.current = true;
          toast.success('🎉 Payment verified successfully!', {
            duration: 5000,
            position: 'top-center',
            icon: '✅'
          });
        }
      } else {
        setStatus('failed');
        toast.error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('failed');
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Payment verification failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [reference]);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    // Prevent duplicate verification
    if (verificationAttempted.current) return;
    
    const ref = reference();
    
    if (orderId && ref) {
      verificationAttempted.current = true;
      verifyPayment();
    } else if (orderId) {
      verificationAttempted.current = true;
      fetchOrder();
    } else {
      setStatus('failed');
      setLoading(false);
      toast.error('Invalid order reference');
    }
  }, [orderId, reference, verifyPayment, fetchOrder]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleRetry = useCallback(() => {
    // Reset verification attempt
    verificationAttempted.current = false;
    toastShown.current = false;
    setRetryCount(prev => prev + 1);
    setStatus('verifying');
    setLoading(true);
    
    // Re-run verification
    const ref = reference();
    if (orderId && ref) {
      verifyPayment();
    } else if (orderId) {
      fetchOrder();
    }
  }, [orderId, reference, verifyPayment, fetchOrder]);

  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  if (loading) {
    return <LoadingState />;
  }

  if (status === 'failed' || !order) {
    return <ErrorState onRetry={handleRetry} />;
  }

  // Success state
  const paymentStatus = getPaymentStatus(order);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center border-b border-green-100">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            <h1 className="text-2xl font-display font-bold text-church-navy">
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-600">
              Thank you for your order. Your payment has been confirmed.
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Verified on attempt {retryCount + 1}
              </p>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* Order Status Badge */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <h2 className="text-xl font-display font-bold text-church-navy">
                Order Details
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentStatus.className}`}>
                {paymentStatus.label}
              </span>
            </div>

            {/* Order Number */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold text-church-navy">
                {order.orderNumber || 'N/A'}
              </p>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-church-navy mb-3">Items</h3>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <OrderItem key={item.id || index} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No items found</div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₦{order.subtotal?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>₦{order.shippingCost?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>₦{order.tax?.toLocaleString() || 0}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-church-gold">₦{order.total?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-6">
              <h3 className="font-semibold text-church-navy mb-2">Customer Details</h3>
              <p className="text-gray-600">{order.customerName || 'N/A'}</p>
              <p className="text-gray-600">{order.customerEmail || 'N/A'}</p>
              <p className="text-gray-600">{order.customerPhone || 'N/A'}</p>
            </div>

            {/* Payment Details */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-church-navy mb-3">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-semibold text-church-navy capitalize">
                    {getPaymentMethodDisplay(order.paymentProvider || order.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Type</p>
                  <p className="font-semibold text-church-navy">
                    {getPaymentType(order)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Transaction Reference</p>
                  <p className="font-mono text-xs text-church-navy break-all">
                    {getTransactionRef(order)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-semibold text-green-600">
                    {paymentStatus.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-church-navy mb-3">Delivery Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Delivery Method</p>
                  <p className="font-semibold text-church-navy capitalize">
                    {order.deliveryMethod || 'Pickup'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Delivery Status</p>
                  <p className="font-semibold text-church-navy capitalize">
                    {order.deliveryStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/books"
                className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-opacity-90 transition-colors"
              >
                <Package className="w-5 h-5" />
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="border-2 border-gray-300 text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;