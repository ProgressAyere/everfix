'use client';
import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, MessageSquare, Navigation, AlertCircle, ChevronDown, ChevronUp, Package } from 'lucide-react';
import Link from 'next/link';

const mockDeliveries = [
  {
    id: 'DEL-001',
    customerName: 'John Doe',
    engineerName: 'Chukwudi Okafor',
    pickupAddress: '15 Allen Avenue, Ikeja, Lagos',
    dropoffAddress: '23 Victoria Island, Lagos',
    device: 'iPhone 14 Pro',
    repairType: 'Screen Replacement',
    distance: '3.2 km',
    estimatedTime: '12 mins',
    fee: '₦2,000',
    status: 'assigned',
    customerPhone: '08012345678',
    engineerPhone: '08087654321',
    priority: 1
  },
  {
    id: 'DEL-002',
    customerName: 'Ada Nwosu',
    engineerName: 'Tunde Bakare',
    pickupAddress: '45 Lekki Phase 1, Lagos',
    dropoffAddress: '12 Surulere, Lagos',
    device: 'Samsung Galaxy S23',
    repairType: 'Battery Replacement',
    distance: '5.8 km',
    estimatedTime: '18 mins',
    fee: '₦2,500',
    status: 'on_the_way',
    customerPhone: '08098765432',
    engineerPhone: '08076543210',
    priority: 2
  }
];

const statusConfig = {
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', icon: Package },
  on_the_way: { label: 'On the Way', color: 'bg-yellow-100 text-yellow-700', icon: Navigation },
  picked_up: { label: 'Picked Up', color: 'bg-purple-100 text-purple-700', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: Package }
};

export default function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [expandedCard, setExpandedCard] = useState(null);
  const [focusedDelivery, setFocusedDelivery] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const handleNavigate = (address) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
  };

  const handleStatusUpdate = (deliveryId, newStatus) => {
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? { ...d, status: newStatus } : d
    ));
  };

  const getActionButton = (delivery) => {
    switch (delivery.status) {
      case 'assigned':
        return {
          label: 'Accept Delivery',
          action: () => handleStatusUpdate(delivery.id, 'on_the_way'),
          color: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'on_the_way':
        return {
          label: 'Confirm Pickup',
          action: () => handleStatusUpdate(delivery.id, 'picked_up'),
          color: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'picked_up':
        return {
          label: 'Confirm Delivery',
          action: () => handleStatusUpdate(delivery.id, 'delivered'),
          color: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return null;
    }
  };

  if (focusedDelivery) {
    const delivery = deliveries.find(d => d.id === focusedDelivery);
    const actionBtn = getActionButton(delivery);
    const StatusIcon = statusConfig[delivery.status].icon;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-14">
          <div className="flex items-center justify-between px-4 h-full">
            <button
              onClick={() => setFocusedDelivery(null)}
              className="w-10 h-10 flex items-center justify-center -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Delivery Details</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-semibold text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Focused Content */}
        <div className="pt-14 px-4 pb-6 space-y-4">
          
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 py-4">
            <StatusIcon className="w-6 h-6" />
            <span className={`px-4 py-2 rounded-full text-base font-bold ${statusConfig[delivery.status].color}`}>
              {statusConfig[delivery.status].label}
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-blue-600">
                {delivery.status === 'assigned' ? '25%' : delivery.status === 'on_the_way' ? '50%' : delivery.status === 'picked_up' ? '75%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: delivery.status === 'assigned' ? '25%' : delivery.status === 'on_the_way' ? '50%' : delivery.status === 'picked_up' ? '75%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-xl font-bold text-gray-900">{delivery.id}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Distance</p>
                <p className="text-lg font-bold text-gray-900">{delivery.distance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">ETA</p>
                <p className="text-lg font-bold text-gray-900">{delivery.estimatedTime}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Fee</p>
              <p className="text-2xl font-bold text-green-600">{delivery.fee}</p>
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500 mb-1">Pickup Location</p>
                <p className="text-base font-semibold text-gray-900 leading-snug">{delivery.pickupAddress}</p>
                <button
                  onClick={() => handleNavigate(delivery.pickupAddress)}
                  className="text-sm text-blue-600 font-semibold mt-2"
                >
                  Open in Maps →
                </button>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-gray-300 h-6 ml-5"></div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500 mb-1">Drop-off Location</p>
                <p className="text-base font-semibold text-gray-900 leading-snug">{delivery.dropoffAddress}</p>
                <button
                  onClick={() => handleNavigate(delivery.dropoffAddress)}
                  className="text-sm text-blue-600 font-semibold mt-2"
                >
                  Open in Maps →
                </button>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Device & Repair</p>
            <p className="text-lg font-bold text-gray-900">{delivery.device}</p>
            <p className="text-sm text-gray-700">{delivery.repairType}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-base font-bold text-gray-900">{delivery.customerName}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${delivery.customerPhone}`}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 active:scale-95 transition"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 active:scale-95 transition">
                  <MessageSquare className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Engineer</p>
                <p className="text-base font-bold text-gray-900">{delivery.engineerName}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${delivery.engineerPhone}`}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 active:scale-95 transition"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 active:scale-95 transition">
                  <MessageSquare className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action */}
          {actionBtn && (
            <button
              onClick={actionBtn.action}
              className={`w-full ${actionBtn.color} text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2`}
            >
              <Navigation className="w-6 h-6" />
              {actionBtn.label}
            </button>
          )}

          {/* Support */}
          <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 active:scale-98 transition flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Report Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-14">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-3">
            <Link href="/dashboardR" className="w-10 h-10 flex items-center justify-center -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Active Deliveries</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-semibold text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Queue View */}
      <div className="pt-14 px-4 pb-6 space-y-4">
        {deliveries.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-14 h-14 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">No Active Deliveries</h2>
            <p className="text-gray-600 text-center mb-6">
              Stay online to receive delivery requests. You'll be notified when new jobs are available.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 w-full">
              <p className="text-sm text-blue-800 text-center">
                💡 Keep your location services enabled for better job matching
              </p>
            </div>
          </div>
        ) : (
          deliveries.map((delivery) => {
            const isExpanded = expandedCard === delivery.id;
            const actionBtn = getActionButton(delivery);
            const StatusIcon = statusConfig[delivery.status].icon;

            return (
              <div
                key={delivery.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  onClick={() => setExpandedCard(isExpanded ? null : delivery.id)}
                  className="p-4 cursor-pointer active:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[delivery.status].color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[delivery.status].label}
                        </span>
                        {delivery.priority === 1 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-gray-900">{delivery.id}</p>
                      <p className="text-sm text-gray-600">{delivery.device} • {delivery.repairType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{delivery.fee}</p>
                      <p className="text-xs text-gray-500">{delivery.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{delivery.estimatedTime}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Pickup</p>
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{delivery.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Drop-off</p>
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{delivery.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-sm font-bold text-gray-900">{delivery.customerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${delivery.customerPhone}`}
                          className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center active:scale-95 transition"
                        >
                          <Phone className="w-4 h-4 text-white" />
                        </a>
                        <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center active:scale-95 transition">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFocusedDelivery(delivery.id)}
                        className="bg-gray-700 text-white py-3 rounded-xl font-semibold text-sm active:scale-98 transition"
                      >
                        View Details
                      </button>
                      {actionBtn && (
                        <button
                          onClick={actionBtn.action}
                          className={`${actionBtn.color} text-white py-3 rounded-xl font-semibold text-sm active:scale-98 transition`}
                        >
                          {actionBtn.label.split(' ')[1]}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
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
