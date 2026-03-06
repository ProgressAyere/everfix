'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Truck, Wrench, Phone, MessageSquare, FileText, Star, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const stages = [
  { id: 1, name: 'Pending', description: 'Order placed, awaiting pickup' },
  { id: 2, name: 'Picked Up', description: 'Device collected, en route to engineer' },
  { id: 3, name: 'In Repair', description: 'Engineer is working on your device' },
  { id: 4, name: 'Returned', description: 'Device repaired and delivered' }
];

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderData(orderId);
    } else {
      loadLatestOrder();
    }
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      if (orderId) loadOrderData(orderId);
      else loadLatestOrder();
    }, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrderData = async (id) => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setOrderData(data);
        setCurrentStage(getStageFromStatus(data.status));
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const loadLatestOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['pending', 'ongoing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setOrderData(data);
          setCurrentStage(getStageFromStatus(data.status));
        }
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const getStageFromStatus = (status) => {
    const stageMap = {
      'pending': 1,
      'picked_up': 2,
      'ongoing': 3,
      'completed': 4
    };
    return stageMap[status] || 1;
  };

  const handleCancelOrder = async () => {
    try {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderData.id);
      setShowCancelModal(false);
      window.location.href = '/dashboardC';
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleSubmitRating = async () => {
    try {
      await supabase.from('orders').update({ rating, review }).eq('id', orderData.id);
      setShowRatingModal(false);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const supportContacts = {
    1: { title: 'Pickup Delayed?', action: 'Contact Rider', phone: '+234 818 363 4915' },
    2: { title: 'Track Rider', action: 'Call Rider', phone: '+234 806 062 4622' },
    3: { title: 'Repair Question?', action: 'Contact Engineer', phone: '+234 708 463 8704' },
    4: { title: 'Delivery Issue?', action: 'Contact Support', phone: '+234 704 949 0588' }
  };

  const currentSupport = supportContacts[currentStage];

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboardC" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 mt-1">Order ID: {orderData.order_number}</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Repair Progress</h2>
              
              <div className="relative">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-start mb-8 last:mb-0">
                    {/* Timeline Line */}
                    {index < stages.length - 1 && (
                      <div className={`absolute left-5 top-12 w-0.5 h-16 ${
                        currentStage > stage.id ? 'bg-green-500' : 'bg-gray-300'
                      }`} style={{ marginTop: '-0.5rem' }}></div>
                    )}
                    
                    {/* Stage Icon */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentStage > stage.id 
                        ? 'bg-green-500 text-white' 
                        : currentStage === stage.id 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStage > stage.id ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">{stage.id}</span>
                      )}
                    </div>
                    
                    {/* Stage Info */}
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${
                        currentStage === stage.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {stage.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                      
                      {currentStage === stage.id && (
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                            {stage.id === 2 && <><Truck className="w-4 h-4" /> Your device is on the way to the repair center</>}
                            {stage.id === 3 && <><Wrench className="w-4 h-4" /> Engineer is currently working on your device</>}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Estimated Completion:</span> {orderData.estimated_completion || 'TBD'}
                </p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Location</h2>
              
              {orderData.latitude && orderData.longitude ? (
                <iframe
                  width="100%"
                  height="256"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${orderData.latitude},${orderData.longitude}&zoom=15`}
                  allowFullScreen
                />
              ) : (
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 font-medium">Location not available</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 mt-4">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">{orderData.current_location || 'Location updating...'}</p>
                  <p className="text-sm text-blue-700 mt-1">{orderData.location_details || ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold text-gray-900">{orderData.device_info}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-gray-900">{orderData.service_type}</p>
                </div>
                {orderData.engineer_name && (
                  <div>
                    <p className="text-sm text-gray-600">Engineer</p>
                    <p className="font-semibold text-gray-900">{orderData.engineer_name}</p>
                  </div>
                )}
                {orderData.amount && (
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">₦{orderData.amount.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <Link 
                href="/details"
                className="mt-4 block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                View Full Details
              </Link>
            </div>

            {/* Support Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">{currentSupport.title}</p>
                <p className="text-sm text-blue-700">{currentSupport.action}</p>
              </div>

              <a 
                href={`tel:${orderData.engineer_phone || currentSupport.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition mb-3"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>

              <a 
                href={`mailto:${orderData.engineer_email || 'support@phonefix.com'}`}
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <button onClick={() => setShowReceiptModal(true)} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">View Receipt</span>
                </button>
                <button onClick={() => setShowRatingModal(true)} disabled={orderData.status !== 'completed'} className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50">
                  <Star className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Rate Service</span>
                </button>
                <button onClick={() => setShowCancelModal(true)} disabled={orderData.status === 'completed' || orderData.status === 'cancelled'} className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2 disabled:opacity-50">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 font-medium">Cancel Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Order Receipt</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Order ID:</span><span className="font-medium">{orderData.order_number}</span></div>
                <div className="flex justify-between"><span>Device:</span><span className="font-medium">{orderData.device_info}</span></div>
                <div className="flex justify-between"><span>Service:</span><span className="font-medium">{orderData.service_type}</span></div>
                {orderData.amount && <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total:</span><span className="font-bold">₦{orderData.amount.toLocaleString()}</span></div>}
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Rate Service</h3>
              <div className="flex gap-2 justify-center mb-4">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className={`text-3xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Write your review..." className="w-full px-3 py-2 border rounded-lg" rows="4" />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowRatingModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSubmitRating} disabled={!rating} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-2 text-red-600">Cancel Order</h3>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 border rounded-lg">No, Keep Order</button>
                <button onClick={handleCancelOrder} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
