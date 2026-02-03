'use client';
import { useState, useEffect } from 'react';
import { Navigation, Phone, MessageSquare, ChevronUp, ChevronDown, AlertCircle, Volume2, HelpCircle, MapPin, Package, Clock, X, Shield, FileText, Info } from 'lucide-react';

const deliveryStages = {
  assigned: { label: 'Assigned', color: 'bg-blue-600', action: 'Start Navigation' },
  onTheWay: { label: 'On the Way', color: 'bg-yellow-600', action: 'Arrived at Pickup' },
  pickedUp: { label: 'Picked Up', color: 'bg-purple-600', action: 'Start Delivery' },
  delivering: { label: 'Delivering', color: 'bg-orange-600', action: 'Arrived at Delivery' },
  delivered: { label: 'Delivered', color: 'bg-green-600', action: 'Complete' }
};

export default function NavigationPage() {
  const [stage, setStage] = useState('assigned');
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [gpsLost, setGpsLost] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const deliveryData = {
    customer: 'John Doe',
    engineer: 'Chukwudi Okafor',
    device: 'iPhone 14 Pro',
    repairType: 'Screen Replacement',
    pickupAddress: '15 Allen Avenue, Ikeja, Lagos',
    dropoffAddress: '23 Victoria Island, Lagos',
    instructions: 'Call on arrival. Gate code: 1234',
    eta: '8 mins',
    distance: '2.3 km'
  };

  const handlePrimaryAction = () => {
    if (stage === 'assigned') {
      setStage('onTheWay');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deliveryData.pickupAddress)}`, '_blank');
    } else if (stage === 'onTheWay') {
      setShowConfirm('pickup');
    } else if (stage === 'pickedUp') {
      setStage('delivering');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deliveryData.dropoffAddress)}`, '_blank');
    } else if (stage === 'delivering') {
      setShowConfirm('delivery');
    }
  };

  const confirmAction = () => {
    if (showConfirm === 'pickup') {
      setStage('pickedUp');
    } else if (showConfirm === 'delivery') {
      setStage('delivered');
    }
    setShowConfirm(false);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100 mt-[75]">
      
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 font-semibold">Google Maps Integration</p>
            <p className="text-sm text-gray-500">Live location tracking active</p>
          </div>
        </div>

        {/* Route Visualization */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 100 400 Q 200 300 300 200" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="10,5" />
        </svg>

        {/* Pickup Marker */}
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Dropoff Marker */}
        <div className="absolute top-1/4 right-1/3 transform translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Current Location */}
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-4 h-4 bg-blue-600 rounded-full shadow-lg border-2 border-white animate-pulse"></div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${deliveryStages[stage].color}`}>
            {deliveryStages[stage].label}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-900">{deliveryData.eta}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-900">{deliveryData.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Instruction */}
      {stage !== 'assigned' && (
        <div className="absolute top-16 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Next Turn</p>
              <p className="text-base font-bold text-gray-900">Turn right on Main Street in 200m</p>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${voiceEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <Volume2 className={`w-5 h-5 ${voiceEnabled ? 'text-white' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      )}

      {/* GPS Lost Warning */}
      {gpsLost && (
        <div className="absolute top-16 left-4 right-4 bg-red-600 text-white rounded-xl shadow-lg p-4 z-30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold mb-1">GPS Signal Lost</p>
              <p className="text-sm mb-3">Unable to determine your location</p>
              <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold">
                Manual Location Confirmation
              </button>
            </div>
            <button onClick={() => setGpsLost(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Communication FAB */}
      <div className="absolute top-32 right-4 flex flex-col gap-3 z-30">
        <a
          href={`tel:${deliveryData.customer}`}
          className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          <Phone className="w-6 h-6 text-white" />
        </a>
        <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition">
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setShowSupport(true)}
          className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Collapsible Delivery Details Panel */}
      <div className={`absolute left-0 right-0 bottom-20 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 z-20 ${panelExpanded ? 'max-h-96' : 'max-h-20'}`}>
        <button
          onClick={() => setPanelExpanded(!panelExpanded)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-600">Current Stage</p>
            <p className="text-base font-bold text-gray-900">{deliveryStages[stage].label}</p>
          </div>
          {panelExpanded ? <ChevronDown className="w-6 h-6 text-gray-400" /> : <ChevronUp className="w-6 h-6 text-gray-400" />}
        </button>

        {panelExpanded && (
          <div className="px-4 pb-4 space-y-3 overflow-y-auto max-h-72">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="text-sm font-semibold text-gray-900">{deliveryData.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Engineer</p>
                <p className="text-sm font-semibold text-gray-900">{deliveryData.engineer}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Device & Repair</p>
              <p className="text-sm font-bold text-gray-900">{deliveryData.device}</p>
              <p className="text-xs text-gray-700">{deliveryData.repairType}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
              <p className="text-sm font-semibold text-gray-900">{deliveryData.pickupAddress}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Drop-off Location</p>
              <p className="text-sm font-semibold text-gray-900">{deliveryData.dropoffAddress}</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-gray-600">Instructions</p>
              </div>
              <p className="text-sm text-gray-900">{deliveryData.instructions}</p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 shadow-2xl z-30">
        <button
          onClick={handlePrimaryAction}
          className={`w-full ${deliveryStages[stage].color} text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition flex items-center justify-center gap-2`}
        >
          <Navigation className="w-6 h-6" />
          {deliveryStages[stage].action}
        </button>
      </div>

      {/* Support Overlay */}
      {showSupport && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Support & Safety</h3>
              <button onClick={() => setShowSupport(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Support
            </button>
            <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Report Issue
            </button>
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Emergency Assistance
            </button>
            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              View Delivery Instructions
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirm {showConfirm === 'pickup' ? 'Pickup' : 'Delivery'}
            </h3>
            <p className="text-gray-600 mb-4">
              {showConfirm === 'pickup' ? deliveryData.pickupAddress : deliveryData.dropoffAddress}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600">Device: {deliveryData.device}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
