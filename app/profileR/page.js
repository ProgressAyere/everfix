'use client';
import { useState } from 'react';
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Edit, CheckCircle, Clock, XCircle, Upload, Star, TrendingUp, DollarSign, Bell, Shield, HelpCircle, LogOut, Trash2, ChevronRight, Bike } from 'lucide-react';
import Link from 'next/link';

const riderData = {
  name: 'Adebayo Okonkwo',
  riderId: 'RDR-2024-0001',
  rating: 4.8,
  verificationStatus: 'verified',
  phone: '+234 704 949 0588',
  email: 'adebayo.o@email.com',
  dob: '1995-03-15',
  address: '23 Lekki Phase 1, Lagos',
  vehicle: {
    type: 'Motorcycle',
    brand: 'Honda',
    model: 'CB150R',
    registration: 'LAG-123-XY',
    helmet: true,
    deliveryBag: true
  },
  verification: {
    identity: { status: 'completed', date: '2024-01-10' },
    facial: { status: 'completed', date: '2024-01-10' },
    govId: { status: 'completed', date: '2024-01-11' },
    address: { status: 'completed', date: '2024-01-12' },
    background: { status: 'completed', date: '2024-01-13' }
  },
  performance: {
    totalDeliveries: 156,
    completionRate: 98,
    cancellationRate: 2,
    avgRating: 4.8,
    distanceCovered: '1,245 km'
  },
  earnings: {
    total: 234500,
    weekly: 18500,
    wallet: 12300
  },
  recentFeedback: [
    { rating: 5, comment: 'Very fast and professional!', date: '2024-01-24' },
    { rating: 5, comment: 'Great service', date: '2024-01-23' }
  ]
};

const statusConfig = {
  verified: { label: 'Verified', color: 'bg-green-100 text-green-700 border-green-300' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  restricted: { label: 'Restricted', color: 'bg-red-100 text-red-700 border-red-300' }
};

const verificationStatusIcon = {
  completed: <CheckCircle className="w-5 h-5 text-green-600" />,
  pending: <Clock className="w-5 h-5 text-yellow-600" />,
  failed: <XCircle className="w-5 h-5 text-red-600" />
};

export default function RiderProfile() {
  const [isOnline, setIsOnline] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-14">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/dashboardR" className="w-10 h-10 flex items-center justify-center -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-14 px-4 space-y-4">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg mt-7">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-blue-600">{riderData.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1">{riderData.name}</h2>
              <p className="text-blue-100 text-sm mb-2">{riderData.riderId}</p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold">{riderData.rating}</span>
                <span className="text-blue-100 text-sm">out of 5</span>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${statusConfig[riderData.verificationStatus].color}`}>
            <CheckCircle className="w-4 h-4" />
            {statusConfig[riderData.verificationStatus].label}
          </span>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <button className="text-blue-600 text-sm font-semibold">Edit</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">{riderData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-semibold text-gray-900">{riderData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="text-sm font-semibold text-gray-900">{riderData.dob}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Residential Address</p>
                <p className="text-sm font-semibold text-gray-900">{riderData.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle and Equipment */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Vehicle & Equipment</h3>
            <button className="text-blue-600 text-sm font-semibold">Edit</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Bike className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Mode of Transport</p>
                <p className="text-sm font-semibold text-gray-900">{riderData.vehicle.type}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900 mb-1">{riderData.vehicle.brand} {riderData.vehicle.model}</p>
              <p className="text-xs text-gray-600">Registration: {riderData.vehicle.registration}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border-2 ${riderData.vehicle.helmet ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <p className="text-xs text-gray-600 mb-1">Helmet</p>
                <p className="text-sm font-bold text-gray-900">{riderData.vehicle.helmet ? '✓ Confirmed' : '⚠ Pending'}</p>
              </div>
              <div className={`p-3 rounded-lg border-2 ${riderData.vehicle.deliveryBag ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <p className="text-xs text-gray-600 mb-1">Delivery Bag</p>
                <p className="text-sm font-bold text-gray-900">{riderData.vehicle.deliveryBag ? '✓ Confirmed' : '⚠ Pending'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification and Documents */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Verification & Documents</h3>
          <div className="space-y-3">
            {Object.entries(riderData.verification).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {verificationStatusIcon[value.status]}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    {value.date && <p className="text-xs text-gray-500">Completed: {value.date}</p>}
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-semibold">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{riderData.performance.totalDeliveries}</p>
              <p className="text-xs text-gray-600 mt-1">Total Deliveries</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{riderData.performance.completionRate}%</p>
              <p className="text-xs text-gray-600 mt-1">Completion Rate</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{riderData.performance.cancellationRate}%</p>
              <p className="text-xs text-gray-600 mt-1">Cancellation Rate</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{riderData.performance.avgRating}</p>
              <p className="text-xs text-gray-600 mt-1">Avg Rating</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-xl font-bold text-purple-600">{riderData.performance.distanceCovered}</p>
            <p className="text-xs text-gray-600 mt-1">Distance Covered</p>
          </div>
        </div>

        {/* Earnings Snapshot */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Earnings Snapshot</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Earnings</span>
              <span className="text-lg font-bold text-gray-900">₦{riderData.earnings.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-lg font-bold text-green-600">₦{riderData.earnings.weekly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wallet Balance</span>
              <span className="text-lg font-bold text-blue-600">₦{riderData.earnings.wallet.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/deliveryHistory" className="block mt-4 text-center text-blue-600 font-semibold text-sm">
            View Full Earnings & Payout History →
          </Link>
        </div>

        {/* Ratings and Feedback */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ratings & Feedback</h3>
          <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-gray-900">Average rating this month: 4.9★</p>
          </div>
          <div className="space-y-3">
            {riderData.recentFeedback.map((feedback, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{feedback.date}</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Availability and Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Availability & Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Online Status</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${isOnline ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
            </div>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Working Hours</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Service Areas</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">Notification Preferences</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Safety and Support */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Safety & Support</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/support" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900 text-center">Help Center</span>
            </Link>
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg">
              <Shield className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-semibold text-gray-900 text-center">Report Issue</span>
            </button>
            <a href="tel:911" className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-lg">
              <Phone className="w-6 h-6 text-red-600" />
              <span className="text-sm font-semibold text-gray-900 text-center">Emergency</span>
            </a>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm font-semibold text-gray-900 text-center">Safety Guide</span>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-100 rounded-xl shadow-sm p-4 border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Change Password</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Device Management</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-semibold text-gray-900">Privacy Settings</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-lg text-red-600 font-semibold mt-4"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-lg text-red-600 font-semibold border-2 border-red-200">
              <Trash2 className="w-5 h-5" />
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <Link
                href="/"
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold text-center"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
