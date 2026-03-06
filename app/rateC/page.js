'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, CheckCircle, MessageSquare, Clock, ThumbsUp, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const quickFeedback = [
  { id: 'fast', label: 'Fast Service', icon: Clock },
  { id: 'professional', label: 'Professional', icon: ThumbsUp },
  { id: 'communication', label: 'Great Communication', icon: MessageSquare },
  { id: 'value', label: 'Good Value', icon: DollarSign },
  { id: 'recommend', label: 'Would Recommend', icon: Users }
];

function RateEngineerContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (data) setOrderData(data);
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const toggleChip = (chipId) => {
    setSelectedChips(prev =>
      prev.includes(chipId) ? prev.filter(id => id !== chipId) : [...prev, chipId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0 || !orderData) return;
    
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await supabase
        .from('orders')
        .update({ 
          rating, 
          review: feedback,
          quick_feedback: selectedChips 
        })
        .eq('id', orderData.id);
      
      if (orderData.engineer_id) {
        await supabase
          .from('engineer_ratings')
          .insert({
            engineer_id: orderData.engineer_id,
            customer_id: user.id,
            order_id: orderData.id,
            rating,
            review: feedback,
            quick_feedback: selectedChips
          });
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderData && orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600 mb-6">No order selected. Please select an order to rate.</p>
          <Link href="/dashboardC" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback helps us maintain quality service and recognize our best engineers.
          </p>
          <Link
            href="/dashboardC"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Indicator */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Repair Completed</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">How was your experience?</h1>
            <p className="text-blue-100">Help us improve by rating your repair service</p>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Job Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">{orderData.order_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Completed</p>
                  <p className="font-semibold text-gray-900">{new Date(orderData.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Device</p>
                  <p className="font-semibold text-gray-900">{orderData.device_info}</p>
                </div>
                <div>
                  <p className="text-gray-500">Engineer</p>
                  <p className="font-semibold text-gray-900">{orderData.engineer_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div className="text-center mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Rate Your Experience
              </label>
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <Star
                      size={48}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {(rating > 0 || hoverRating > 0) && (
                <p className="text-lg font-medium text-gray-700 animate-fade-in">
                  {ratingLabels[(hoverRating || rating) - 1]}
                </p>
              )}
            </div>

            {/* Quick Feedback Chips */}
            {rating > 0 && (
              <div className="mb-6 animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What did you like? (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickFeedback.map((chip) => {
                    const Icon = chip.icon;
                    const isSelected = selectedChips.includes(chip.id);
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => toggleChip(chip.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={16} />
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Text Area */}
            {rating > 0 && (
              <div className="mb-6 animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share more details about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your feedback is shared with our team to improve service quality
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                rating > 0 && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-98'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : rating > 0 ? 'Submit Rating' : 'Select a rating to continue'}
            </button>

            {/* Reassurance Note */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Ratings help engineers improve and earn recognition. Your honest feedback matters.
            </p>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Link
            href="/dashboardC"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip for now
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

export default function RateEngineer() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <RateEngineerContent />
    </Suspense>
  );
}
