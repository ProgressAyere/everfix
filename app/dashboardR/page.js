'use client';
import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, DollarSign, TrendingUp, Navigation, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(null);

  useEffect(() => {
    const online = localStorage.getItem('riderOnlineStatus') === 'true';
    setIsOnline(online);

    // Mock active delivery
    if (online) {
      setActiveDelivery({
        id: 'DEL-2024-001',
        type: 'pickup',
        customerName: 'John Doe',
        address: '15 Admiralty Way, Lekki Phase 1, Lagos',
        phone: '08012345678',
        device: 'iPhone 14 Pro',
        distance: '2.3 km',
        estimatedTime: '8 mins',
        earnings: '₦1,500'
      });
    }
  }, []);

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    localStorage.setItem('riderOnlineStatus', newStatus.toString());
    window.dispatchEvent(new Event('storage'));
    if (!newStatus) setActiveDelivery(null);
  };

  const handleStartNavigation = () => {
    if (activeDelivery) {
      const address = encodeURIComponent(activeDelivery.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
    }
  };

  const stats = {
    todayEarnings: '₦12,500',
    completedToday: 8,
    avgRating: 4.8,
    onTimeRate: '95%'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header with Online Toggle */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-20 pb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Rider Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Manage your deliveries</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <button
              onClick={toggleOnlineStatus}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  isOnline ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <p className={`text-xs font-semibold mt-2 text-center ${
              isOnline ? 'text-green-100' : 'text-gray-200'
            }`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{stats.todayEarnings}</p>
            <p className="text-blue-100 text-xs">Today</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Package className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{stats.completedToday}</p>
            <p className="text-blue-100 text-xs">Trips</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{stats.avgRating}</p>
            <p className="text-blue-100 text-xs">Rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{stats.onTimeRate}</p>
            <p className="text-blue-100 text-xs">On-Time</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">
        
        {/* Active Delivery Card */}
        {isOnline && activeDelivery ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">Active Delivery</span>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {activeDelivery.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}
              </span>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-bold text-gray-900 text-lg">{activeDelivery.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Earnings</p>
                  <p className="font-bold text-green-600 text-lg">{activeDelivery.earnings}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{activeDelivery.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-semibold text-gray-900">{activeDelivery.estimatedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="text-sm font-semibold text-gray-900">{activeDelivery.distance}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{activeDelivery.customerName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">{activeDelivery.customerName}</p>
                  <p className="text-xs text-gray-600">{activeDelivery.device}</p>
                </div>
                <a
                  href={`tel:${activeDelivery.phone}`}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition active:scale-95"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
              </div>

              <button
                onClick={handleStartNavigation}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-6 h-6" />
                Start Navigation
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                  Mark Picked Up
                </button>
                <button className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Complete
                </button>
              </div>
            </div>
          </div>
        ) : isOnline ? (
          // Empty State - Online but no delivery
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You're Online!</h3>
            <p className="text-gray-600 mb-4">
              Waiting for delivery requests. You'll be notified when a new job is available.
            </p>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 Stay in areas with high demand to receive more delivery requests
              </p>
            </div>
          </div>
        ) : (
          // Empty State - Offline
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You're Offline</h3>
            <p className="text-gray-600 mb-4">
              Toggle your status to online to start receiving delivery requests
            </p>
            <button
              onClick={toggleOnlineStatus}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Go Online Now
            </button>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Today's Performance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Deliveries</span>
              <span className="font-semibold text-gray-900">{stats.completedToday} trips</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Earnings</span>
              <span className="font-semibold text-green-600">{stats.todayEarnings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Rating</span>
              <span className="font-semibold text-yellow-600">{stats.avgRating} ⭐</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On-Time Delivery</span>
              <span className="font-semibold text-blue-600">{stats.onTimeRate}</span>
            </div>
          </div>
          <Link
            href="/deliveryHistoryR"
            className="block mt-4 text-center text-sm text-blue-600 font-semibold hover:underline"
          >
            View Full History →
          </Link>
        </div>

        {/* Safety & Support */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm p-4 border border-red-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Safety & Support
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="bg-red-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-red-700 transition active:scale-95"
            >
              Emergency
            </a>
            <Link
              href="/support"
              className="bg-white text-gray-700 py-3 rounded-xl font-semibold text-center hover:bg-gray-50 transition border border-gray-200"
            >
              Support
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
