'use client';
import { useState } from 'react';
import { ArrowLeft, Filter, Search, MapPin, Clock, DollarSign, Star, Download, Share2, X, ChevronDown, ChevronUp, Package } from 'lucide-react';
import Link from 'next/link';

const mockDeliveries = [
  {
    id: 'DEL-001',
    date: '2024-01-25',
    time: '14:30',
    customerName: 'John Doe',
    engineerName: 'Chukwudi Okafor',
    pickupAddress: '15 Allen Avenue, Ikeja, Lagos',
    dropoffAddress: '23 Victoria Island, Lagos',
    device: 'iPhone 14 Pro',
    repairType: 'Screen Replacement',
    fee: 2000,
    bonus: 200,
    commission: 300,
    payout: 1900,
    status: 'completed',
    distance: '3.2 km',
    duration: '18 mins',
    rating: 5,
    feedback: 'Very professional and fast delivery!',
    timeline: [
      { stage: 'Job Accepted', time: '14:30' },
      { stage: 'Pickup Confirmed', time: '14:45' },
      { stage: 'Drop-off Confirmed', time: '15:03' }
    ]
  },
  {
    id: 'DEL-002',
    date: '2024-01-24',
    time: '10:15',
    customerName: 'Ada Nwosu',
    engineerName: 'Tunde Bakare',
    pickupAddress: '45 Lekki Phase 1, Lagos',
    dropoffAddress: '12 Surulere, Lagos',
    device: 'Samsung Galaxy S23',
    repairType: 'Battery Replacement',
    fee: 2500,
    bonus: 0,
    commission: 375,
    payout: 2125,
    status: 'completed',
    distance: '5.8 km',
    duration: '25 mins',
    rating: 4,
    feedback: 'Good service',
    timeline: [
      { stage: 'Job Accepted', time: '10:15' },
      { stage: 'Pickup Confirmed', time: '10:30' },
      { stage: 'Drop-off Confirmed', time: '10:55' }
    ]
  },
  {
    id: 'DEL-003',
    date: '2024-01-23',
    time: '16:00',
    customerName: 'Emeka Obi',
    engineerName: 'Ngozi Eze',
    pickupAddress: '8 Yaba, Lagos',
    dropoffAddress: '30 Ikoyi, Lagos',
    device: 'iPhone 13',
    repairType: 'Charging Port',
    fee: 1800,
    bonus: 0,
    commission: 270,
    payout: 1530,
    status: 'cancelled',
    distance: '4.1 km',
    duration: 'N/A',
    rating: null,
    feedback: null,
    cancelReason: 'Customer unavailable',
    timeline: [
      { stage: 'Job Accepted', time: '16:00' },
      { stage: 'Cancelled', time: '16:20' }
    ]
  }
];

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200' },
  disputed: { label: 'Disputed', color: 'bg-orange-100 text-orange-700 border-orange-200' }
};

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [filteredDeliveries, setFilteredDeliveries] = useState(mockDeliveries);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });

  const applyFilters = () => {
    let filtered = [...deliveries];

    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.engineerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(d => filters.status.includes(d.status));
    }

    if (filters.minAmount) {
      filtered = filtered.filter(d => d.payout >= parseInt(filters.minAmount));
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(d => d.payout <= parseInt(filters.maxAmount));
    }

    if (filters.startDate) {
      filtered = filtered.filter(d => d.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter(d => d.date <= filters.endDate);
    }

    setFilteredDeliveries(filtered);
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
    setSearchQuery('');
    setFilteredDeliveries(deliveries);
  };

  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleDownloadReceipt = (delivery) => {
    alert(`Downloading receipt for ${delivery.id}`);
  };

  const handleShareReceipt = (delivery) => {
    alert(`Sharing receipt for ${delivery.id}`);
  };

  if (selectedDelivery) {
    const delivery = deliveries.find(d => d.id === selectedDelivery);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSelectedDelivery(null)}
              className="w-10 h-10 flex items-center justify-center -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Delivery Details</h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleShareReceipt(delivery)}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => handleDownloadReceipt(delivery)}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed View */}
        <div className="pt-14 px-4 pb-6 space-y-4">
          
          {/* Status & ID */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-gray-900">{delivery.id}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusConfig[delivery.status].color}`}>
                {statusConfig[delivery.status].label}
              </span>
            </div>
            <p className="text-sm text-gray-600">{delivery.date} at {delivery.time}</p>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Earnings Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-gray-900">₦{delivery.fee.toLocaleString()}</span>
              </div>
              {delivery.bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus</span>
                  <span className="font-semibold text-green-600">+₦{delivery.bonus.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Commission (15%)</span>
                <span className="font-semibold text-red-600">-₦{delivery.commission.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total Payout</span>
                <span className="font-bold text-green-600 text-xl">₦{delivery.payout.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Route Information
            </h3>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Pickup</p>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{delivery.pickupAddress}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-gray-300 h-6 ml-4"></div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Drop-off</p>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{delivery.dropoffAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Distance</p>
                <p className="text-sm font-bold text-gray-900">{delivery.distance}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-bold text-gray-900">{delivery.duration}</p>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Device & Repair</p>
            <p className="text-base font-bold text-gray-900">{delivery.device}</p>
            <p className="text-sm text-gray-700">{delivery.repairType}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <p className="text-base font-bold text-gray-900">{delivery.customerName}</p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Engineer</p>
              <p className="text-base font-bold text-gray-900">{delivery.engineerName}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Delivery Timeline
            </h3>
            <div className="space-y-3">
              {delivery.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{event.stage}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating & Feedback */}
          {delivery.status === 'completed' && delivery.rating && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Customer Rating
              </h3>
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < delivery.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-lg font-bold text-gray-900 ml-2">{delivery.rating}.0</span>
              </div>
              {delivery.feedback && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 italic">"{delivery.feedback}"</p>
                </div>
              )}
            </div>
          )}

          {/* Cancel Reason */}
          {delivery.status === 'cancelled' && delivery.cancelReason && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <h3 className="font-bold text-gray-900 mb-2">Cancellation Reason</h3>
              <p className="text-sm text-gray-700">{delivery.cancelReason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/dashboardR" className="w-10 h-10 flex items-center justify-center -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Delivery History</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg ${showFilters ? 'bg-blue-100' : ''}`}
            >
              <Filter className={`w-5 h-5 ${showFilters ? 'text-blue-600' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                applyFilters();
              }}
              placeholder="Search by customer, engineer, or ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-200 space-y-4 pt-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(statusConfig).map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      toggleStatusFilter(status);
                      applyFilters();
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${
                      filters.status.includes(status)
                        ? statusConfig[status].color
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => {
                    setFilters({ ...filters, startDate: e.target.value });
                    applyFilters();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => {
                    setFilters({ ...filters, endDate: e.target.value });
                    applyFilters();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Min Amount (₦)</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => {
                    setFilters({ ...filters, minAmount: e.target.value });
                    applyFilters();
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Max Amount (₦)</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => {
                    setFilters({ ...filters, maxAmount: e.target.value });
                    applyFilters();
                  }}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Delivery List */}
      <div className={`pt-${showFilters ? '80' : '32'} px-4 pb-6 space-y-3`} style={{ paddingTop: showFilters ? '420px' : '140px' }}>
        {filteredDeliveries.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-14 h-14 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">No Delivery History</h2>
            <p className="text-gray-600 text-center mb-6">
              You haven't completed any deliveries yet. Go online to start receiving jobs.
            </p>
            <Link
              href="/dashboardR"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              onClick={() => setSelectedDelivery(delivery.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 active:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[delivery.status].color}`}>
                      {statusConfig[delivery.status].label}
                    </span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{delivery.id}</p>
                  <p className="text-sm text-gray-600">{delivery.date} at {delivery.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">₦{delivery.payout.toLocaleString()}</p>
                  {delivery.rating && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{delivery.rating}.0</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-snug">{delivery.pickupAddress}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-snug">{delivery.dropoffAddress}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">{delivery.device} • {delivery.repairType}</p>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
