'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockReviews = [
  { id: 1, customer: 'Chioma A.', rating: 5, comment: 'Excellent work! My iPhone screen looks brand new. Very professional and quick service.', date: '2 days ago', device: 'iPhone 14 Pro' },
  { id: 2, customer: 'Emeka O.', rating: 5, comment: 'Great engineer. Fixed my Samsung battery issue perfectly. Highly recommend!', date: '1 week ago', device: 'Samsung Galaxy S23' },
  { id: 3, customer: 'Fatima M.', rating: 4, comment: 'Good service, took a bit longer than expected but the repair quality is excellent.', date: '2 weeks ago', device: 'MacBook Pro M2' },
  { id: 4, customer: 'Tunde B.', rating: 5, comment: 'Very knowledgeable and explained everything clearly. Phone works perfectly now.', date: '3 weeks ago', device: 'iPhone 13' },
  { id: 5, customer: 'Ada N.', rating: 5, comment: 'Professional and reliable. Will definitely use again for future repairs.', date: '1 month ago', device: 'HP Pavilion 15' }
];

export default function EngineerProfile() {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const profileData = {
    name: 'Chukwudi Okafor',
    specialization: 'iPhone & MacBook Specialist',
    bio: 'Certified phone and laptop repair technician with 5+ years of experience. Specialized in Apple products, screen replacements, and motherboard repairs. Committed to quality service and customer satisfaction.',
    verified: true,
    verifiedSince: 'January 2023',
    rating: 4.8,
    totalReviews: 127,
    completedJobs: 342,
    memberSince: 'January 2020',
    responseTime: '< 30 minutes',
    location: 'Ikeja, Lagos',
    skills: ['Screen Replacement', 'Battery Replacement', 'Water Damage Repair', 'Motherboard Repair', 'Software Issues', 'Data Recovery']
  };

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);

  const getRatingBreakdown = () => {
    return [
      { stars: 5, count: 98, percentage: 77 },
      { stars: 4, count: 23, percentage: 18 },
      { stars: 3, count: 4, percentage: 3 },
      { stars: 2, count: 2, percentage: 2 },
      { stars: 1, count: 0, percentage: 0 }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/dashboardE" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl font-bold text-blue-600">{profileData.name.charAt(0)}</span>
                  </div>
                  {profileData.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                      <p className="text-lg text-blue-600 font-medium mt-1">{profileData.specialization}</p>
                    </div>
                  </div>

                  {profileData.verified && (
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-semibold">Verified Engineer</span>
                      <span className="text-green-700 text-sm">since {profileData.verifiedSince}</span>
                    </div>
                  )}

                  <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {profileData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response: {profileData.responseTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Member since {profileData.memberSince}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
              
              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                <div className="text-center sm:text-left">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{profileData.rating}</div>
                  <div className="flex items-center justify-center sm:justify-start mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-6 h-6 ${i < Math.floor(profileData.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">{profileData.totalReviews} reviews</p>
                </div>

                <div className="flex-1">
                  {getRatingBreakdown().map(item => (
                    <div key={item.stars} className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 w-12">{item.stars} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {displayedReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.customer}</p>
                        <p className="text-sm text-gray-500">{review.date} • {review.device}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>

              {mockReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  {showAllReviews ? 'Show Less' : `Show All ${profileData.totalReviews} Reviews`}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-1">{profileData.completedJobs}</p>
                  <p className="text-sm text-blue-800 font-medium">Completed Jobs</p>
                  <p className="text-xs text-blue-700 mt-1">Since {profileData.memberSince}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold text-yellow-600">{profileData.rating}</span>
                    <svg className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-yellow-800 font-medium">Average Rating</p>
                  <p className="text-xs text-yellow-700 mt-1">From {profileData.totalReviews} reviews</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold text-green-600 mb-1">98%</p>
                  <p className="text-sm text-green-800 font-medium">Success Rate</p>
                  <p className="text-xs text-green-700 mt-1">Last 90 days</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Apple Certified Technician</p>
                    <p className="text-sm text-gray-600">Verified 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Phone Repair Specialist</p>
                    <p className="text-sm text-gray-600">Verified 2022</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3">
                📞 Call Engineer
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                💬 Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
