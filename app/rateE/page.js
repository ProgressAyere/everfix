'use client';
import { useState } from 'react';
import { Star, TrendingUp, CheckCircle, Clock, RotateCcw, Filter, ChevronDown, ChevronUp, MessageSquare, Send, AlertCircle, Award, Smartphone, Wrench } from 'lucide-react';

export default function RateE() {
  const [expandedCards, setExpandedCards] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [trendView, setTrendView] = useState('weekly');
  const [filterDate, setFilterDate] = useState('all');
  const [filterStars, setFilterStars] = useState('all');

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const ratings = [
    { id: 1, stars: 5, customer: 'Sarah M.', feedback: 'Excellent work! Fixed my iPhone screen perfectly and was very professional. Highly recommend!', device: 'iPhone 13 Pro', repair: 'Screen Replacement', date: 'Jan 22, 2024', verified: true },
    { id: 2, stars: 4, customer: 'John D.', feedback: 'Good service but took a bit longer than expected. Quality of work was great though.', device: 'Samsung Galaxy S22', repair: 'Battery Replacement', date: 'Jan 20, 2024', verified: true, reply: 'Thank you for your feedback! I apologize for the delay. I always prioritize quality to ensure your device works perfectly.' },
    { id: 3, stars: 5, customer: 'Ada O.', feedback: 'Very fast and efficient! My phone works like new. Will definitely use again.', device: 'iPhone 12', repair: 'Water Damage Repair', date: 'Jan 18, 2024', verified: true },
    { id: 4, stars: 3, customer: 'Mike T.', feedback: 'The repair was okay but communication could have been better. Would appreciate more updates during the process.', device: 'Google Pixel 7', repair: 'Charging Port Repair', date: 'Jan 15, 2024', verified: true },
    { id: 5, stars: 5, customer: 'Blessing K.', feedback: 'Outstanding service! Very knowledgeable and explained everything clearly.', device: 'iPhone 14', repair: 'Screen Replacement', date: 'Jan 12, 2024', verified: true },
  ];

  const averageRating = 4.8;
  const totalRatings = 60;

  const starDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 10, percentage: 17 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  const weeklyData = [
    { label: 'Mon', value: 4.8 },
    { label: 'Tue', value: 4.7 },
    { label: 'Wed', value: 4.9 },
    { label: 'Thu', value: 4.8 },
    { label: 'Fri', value: 5.0 },
    { label: 'Sat', value: 4.9 },
    { label: 'Sun', value: 4.8 },
  ];

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {totalRatings === 0 ? (
        // Empty State
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Ratings Yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              You haven't received any ratings yet. Complete repair jobs to start building your reputation.
            </p>
            <div className="p-4 bg-green-50 rounded-lg mb-4">
              <p className="text-sm text-green-800 mb-2">
                <span className="font-medium">Next Step:</span> Complete 1 more repair to unlock ratings visibility
              </p>
              <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium">
              View Available Jobs
            </button>
          </div>
        </div>
      ) : (
        <>
      {/* Ratings Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg mt-[62]">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award size={24} className="text-yellow-300" />
            <h1 className="text-xl font-bold">Your Reputation</h1>
          </div>
          <div className="text-6xl font-bold mb-2">{averageRating}</div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {renderStars(5)}
          </div>
          <p className="text-green-100 text-sm">Based on {totalRatings} ratings</p>
        </div>

        {/* Star Distribution */}
        <div className="space-y-2 bg-white bg-opacity-10 rounded-xl p-4">
          {starDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-sm w-6">{item.stars}</span>
              <Star size={14} className="fill-yellow-300 text-yellow-300" />
              <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-300 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wrench size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">127</p>
            <p className="text-xs text-gray-600">Total Repairs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">98%</p>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <RotateCcw size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">42%</p>
            <p className="text-xs text-gray-600">Repeat Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock size={20} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">1.2h</p>
            <p className="text-xs text-gray-600">Avg Response</p>
          </div>
        </div>

        {/* Trend Visualization */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Rating Trends</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTrendView('daily')}
                className={`px-3 py-1 text-xs rounded ${trendView === 'daily' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setTrendView('weekly')}
                className={`px-3 py-1 text-xs rounded ${trendView === 'weekly' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTrendView('monthly')}
                className={`px-3 py-1 text-xs rounded ${trendView === 'monthly' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-32 mb-3">
            {weeklyData.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg absolute bottom-0 transition-all duration-500"
                    style={{ height: `${(day.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{day.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp size={18} className="text-green-600" />
            <p className="text-sm text-green-800">
              <span className="font-medium">Great work!</span> Your average rating improved by 0.3 stars this week.
            </p>
          </div>
        </div>

        {/* Performance Alert (shown when rating < 4.0) */}
        {averageRating < 4.0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">Improvement Opportunity</h3>
                <p className="text-sm text-orange-800 mb-3">Your rating is below 4.0, which may affect job visibility. Here are some tips:</p>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Respond to customer inquiries within 2 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Provide detailed updates during repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Set realistic completion timeframes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <span className="font-medium">Filters</span>
            </div>
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showFilters && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                <div className="grid grid-cols-4 gap-2">
                  {['7d', '30d', '90d', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setFilterDate(period)}
                      className={`py-2 text-xs rounded-lg ${
                        filterDate === period
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {period === 'all' ? 'All' : period}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Star Rating</label>
                <div className="grid grid-cols-6 gap-2">
                  {['all', '5', '4', '3', '2', '1'].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFilterStars(star)}
                      className={`py-2 text-xs rounded-lg ${
                        filterStars === star
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {star === 'all' ? 'All' : `${star}★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Individual Ratings */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Customer Feedback</h2>

          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(rating.stars)}
                    {rating.verified && (
                      <CheckCircle size={14} className="text-green-600" />
                    )}
                  </div>
                  <p className="text-sm font-medium">{rating.customer}</p>
                  <p className="text-xs text-gray-500">{rating.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  rating.stars === 5 ? 'bg-green-100 text-green-700' :
                  rating.stars === 4 ? 'bg-blue-100 text-blue-700' :
                  rating.stars === 3 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {rating.stars} Star{rating.stars !== 1 ? 's' : ''}
                </span>
              </div>

              <p className={`text-sm text-gray-700 mb-3 ${!expandedCards[rating.id] && rating.feedback.length > 100 ? 'line-clamp-2' : ''}`}>
                {rating.feedback}
              </p>

              {rating.feedback.length > 100 && (
                <button
                  onClick={() => toggleCard(rating.id)}
                  className="text-green-600 text-xs font-medium mb-3"
                >
                  {expandedCards[rating.id] ? 'Show less' : 'Read more'}
                </button>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-600 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <Smartphone size={14} />
                  <span>{rating.device}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wrench size={14} />
                  <span>{rating.repair}</span>
                </div>
              </div>

              {rating.reply && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <p className="text-xs font-medium text-green-900 mb-1">Your Reply</p>
                  <p className="text-sm text-green-800">{rating.reply}</p>
                </div>
              )}

              {!rating.reply && replyingTo !== rating.id && (
                <button
                  onClick={() => setReplyingTo(rating.id)}
                  className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium"
                >
                  <MessageSquare size={16} />
                  Reply to Customer
                </button>
              )}

              {replyingTo === rating.id && (
                <div className="mt-3 space-y-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-xs text-blue-800">
                    <AlertCircle size={14} className="inline mr-1" />
                    Keep replies professional and constructive. Avoid defensive language.
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a professional response..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="3"
                    maxLength={250}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{replyText.length}/250</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg flex items-center gap-2">
                        <Send size={14} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
