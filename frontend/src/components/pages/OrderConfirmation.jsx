// frontend/src/components/pages/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft, Package, CreditCard, BookOpen, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../services/api';

function OrderConfirmation() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('verifying');

  const reference = searchParams.get('reference') || 
                    searchParams.get('trxref') || 
                    searchParams.get('tx_ref') ||
                    searchParams.get('txref');

  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    
    if (orderId && reference) {
      verifyPayment();
    } else if (orderId) {
      fetchOrder();
    }
  }, [orderId, reference]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(orderId);
      
      if (response.data.success) {
        setOrder(response.data.data);
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (error) {
    //   console.error('Error fetching order:', error);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      setLoading(true);
    //   console.log('📤 Verifying with reference:', reference);
      
      const response = await orderAPI.verifyPayment(reference);
    //   console.log('📥 Verification response:', response.data);
      
      if (response.data.success) {
        const orderData = response.data.data.order || response.data.data;
        setOrder(orderData);
        setStatus('success');
        toast.success('🎉 Payment verified successfully!');
      } else {
        setStatus('failed');
        toast.error('Payment verification failed');
      }
    } catch (error) {
    //   console.error('Error verifying payment:', error);
      setStatus('failed');
      toast.error('Error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function to get item type label
  const getItemTypeLabel = (type) => {
    const types = {
      'book': '📖 Book',
      'merch': '👕 Merchandise',
      'resource': '📚 Resource',
      'dvd': '💿 DVD',
      'cd': '💿 CD',
      'apparel': '👔 Apparel',
      'other': '📦 Other'
    };
    return types[type] || type || '📦 Item';
  };

  // ✅ Helper function to get payment method display
  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'flutterwave': 'Flutterwave',
      'paystack': 'Paystack',
      'cash': 'Cash',
      'bank_transfer': 'Bank Transfer'
    };
    return methods[method] || method || 'Unknown';
  };

  // ✅ Helper function to get payment type from response
  const getPaymentType = (order) => {
    if (order.paymentResponse?.payment_type) {
      return order.paymentResponse.payment_type.toUpperCase();
    }
    if (order.paymentResponse?.channel) {
      return order.paymentResponse.channel.toUpperCase();
    }
    if (order.paymentResponse?.authorization?.channel) {
      return order.paymentResponse.authorization.channel.toUpperCase();
    }
    return 'N/A';
  };

  // ✅ Helper function to get transaction reference
  const getTransactionRef = (order) => {
    if (order.paymentResponse?.tx_ref) {
      return order.paymentResponse.tx_ref;
    }
    if (order.paymentResponse?.reference) {
      return order.paymentResponse.reference;
    }
    if (order.paymentReference) {
      return order.paymentReference;
    }
    return 'N/A';
  };

  // ✅ Helper function to get payment status
  const getPaymentStatus = (order) => {
    if (order.paymentStatus === 'paid' || order.paymentStatus === 'PAID') {
      return '✅ Paid';
    }
    if (order.status === 'confirmed' || order.status === 'CONFIRMED') {
      return '✅ Confirmed';
    }
    return '⏳ Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-church-gold animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-church-navy mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. Please contact our support team.
          </p>
          <Link
            to="/"
            className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

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
          </div>

          <div className="p-6 md:p-8">
            {/* Order Status Badge */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-church-navy">
                Order Details
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {getPaymentStatus(order)}
              </span>
            </div>

            {/* Order Number */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold text-church-navy">
                {order.orderNumber}
              </p>
            </div>

            {/* Items - Enhanced with Type */}
            <div className="mb-6">
              <h3 className="font-semibold text-church-navy mb-3">Items</h3>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3">
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
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>₦{order.shippingCost?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>₦{order.tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-church-gold">₦{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-6">
              <h3 className="font-semibold text-church-navy mb-2">Customer Details</h3>
              <p className="text-gray-600">{order.customerName}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
            </div>

            {/* Payment Details - Enhanced */}
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
                    {getPaymentStatus(order)}
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
                className="bg-church-gold text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="border-2 border-gray-300 text-church-navy px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-gray-50"
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