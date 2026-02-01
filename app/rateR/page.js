'use client';
import { useState } from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Filter, ChevronDown, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const mockData = {
  overallRating: 4.8,
  totalRatings: 156,
  starDistribution: [
    { stars: 5, count: 120, percentage: 77 },
    { stars: 4, count: 28, percentage: 18 },
    { stars: 3, count: 6, percentage: 4 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 }
  ],
  performance: {
    onTimeRate: 95,
    completionRate: 98,
    cancellationRate: 2,
    trends: { onTime: 'up', completion: 'stable', cancellation: 'down' }
  },
  weeklyRatings: [4.6, 4.7, 4.8, 4.8, 4.9, 4.8, 4.8, 4.8],
  themes: [
    { name: 'Punctuality', score: 87, positive: true },
    { name: 'Professionalism', score: 92, positive: true },
    { name: 'Communication', score: 79, positive: false },
    { name: 'Device Handling', score: 88, positive: true }
  ],
  feedback: [
    { id: 1, rating: 5, text: 'Very fast and professional delivery! Highly recommend.', date: '2024-01-25', jobId: 'DEL-001', customer: 'John D.', verified: true, replied: false },
    { id: 2, rating: 5, text: 'Great service, on time and careful with the device.', date: '2024-01-24', jobId: 'DEL-002', customer: 'Ada N.', verified: true, replied: false },
    { id: 3, rating: 4, text: 'Good delivery but could improve communication.', date: '2024-01-23', jobId: 'DEL-003', customer: 'Emeka O.', verified: true, replied: false },
    { id: 4, rating: 5, text: 'Excellent rider, very polite and quick.', date: '2024-01-22', jobId: 'DEL-004', customer: 'Ngozi E.', verified: true, replied: false }
  ]
};

export default function RiderRatings() {
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const filteredFeedback = mockData.feedback.filter(f => 
    filterRating === 'all' || f.rating === parseInt(filterRating)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-14">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/dashboardR" className="w-10 h-10 flex items-center justify-center -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Ratings & Feedback</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Filter className={`w-5 h-5 ${showFilters ? 'text-blue-600' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      <div className="pt-14 px-4 space-y-4">
        
        {/* Ratings Summary */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg mt-6">
          <div className="text-center mb-6">
            <p className="text-6xl font-bold mb-2">{mockData.overallRating}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < Math.floor(mockData.overallRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} />
              ))}
            </div>
            <p className="text-blue-100">Based on {mockData.totalRatings} ratings</p>
          </div>

          <div className="space-y-2">
            {mockData.starDistribution.map(dist => (
              <div key={dist.stars} className="flex items-center gap-3">
                <span className="text-sm font-semibold w-8">{dist.stars}★</span>
                <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                </div>
                <span className="text-sm font-semibold w-12 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`rounded-xl p-4 border-2 ${getMetricColor(mockData.performance.onTimeRate)}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xl font-bold">{mockData.performance.onTimeRate}%</p>
              {getTrendIcon(mockData.performance.trends.onTime)}
            </div>
            <p className="text-xs font-semibold">On-Time</p>
          </div>
          <div className={`rounded-xl p-4 border-2 ${getMetricColor(mockData.performance.completionRate)}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xl font-bold">{mockData.performance.completionRate}%</p>
              {getTrendIcon(mockData.performance.trends.completion)}
            </div>
            <p className="text-xs font-semibold">Completion</p>
          </div>
          <div className={`rounded-xl p-4 border-2 ${getMetricColor(100 - mockData.performance.cancellationRate)}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xl font-bold">{mockData.performance.cancellationRate}%</p>
              {getTrendIcon(mockData.performance.trends.cancellation)}
            </div>
            <p className="text-xs font-semibold">Cancelled</p>
          </div>
        </div>

        {/* Rating Trends */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Trends (Last 8 Weeks)</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {mockData.weeklyRatings.map((rating, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-600 rounded-t" style={{ height: `${(rating / 5) * 100}%` }}></div>
                <p className="text-xs text-gray-600 mt-2">{rating}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Current Period</p>
              <p className="text-lg font-bold text-gray-900">{mockData.overallRating}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Previous Period</p>
              <p className="text-lg font-bold text-gray-900">4.7</p>
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-3">
            {mockData.themes.map(theme => (
              <div key={theme.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{theme.name}</span>
                  <span className={`text-sm font-bold ${theme.positive ? 'text-green-600' : 'text-yellow-600'}`}>
                    {theme.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${theme.positive ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${theme.score}%` }}
                  ></div>
                </div>
                {!theme.positive && (
                  <p className="text-xs text-gray-600 mt-1">💡 Improvement opportunity</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Filter by Rating</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${filterRating === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${filterRating === rating.toString() ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Customer Feedback</h3>
          {filteredFeedback.map(feedback => (
            <div key={feedback.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  {feedback.verified && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{feedback.date}</span>
              </div>

              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {expandedFeedback === feedback.id ? feedback.text : 
                  feedback.text.length > 100 ? `${feedback.text.substring(0, 100)}...` : feedback.text
                }
                {feedback.text.length > 100 && (
                  <button
                    onClick={() => setExpandedFeedback(expandedFeedback === feedback.id ? null : feedback.id)}
                    className="text-blue-600 font-semibold ml-1"
                  >
                    {expandedFeedback === feedback.id ? 'Show less' : 'Read more'}
                  </button>
                )}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Customer: {feedback.customer}</p>
                  <p className="text-xs text-gray-500">Job: {feedback.jobId}</p>
                </div>
                {!feedback.replied && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === feedback.id ? null : feedback.id)}
                    className="flex items-center gap-1 text-sm text-blue-600 font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </button>
                )}
              </div>

              {replyingTo === feedback.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a professional response..."
                    maxLength={300}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{replyText.length}/300</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:bg-gray-300"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">💡 Keep responses professional and solution-focused</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No feedback matches your filters. Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
