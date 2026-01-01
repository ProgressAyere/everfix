'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const stages = [
  { id: 1, name: 'Pending', description: 'Order placed, awaiting pickup' },
  { id: 2, name: 'Picked Up', description: 'Device collected, en route to engineer' },
  { id: 3, name: 'In Repair', description: 'Engineer is working on your device' },
  { id: 4, name: 'Returned', description: 'Device repaired and delivered' }
];

export default function TrackingPage() {
  const [currentStage, setCurrentStage] = useState(2); // Current stage: Picked Up
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const orderDetails = {
    orderId: 'ORD-2024-001',
    device: 'iPhone 14 Pro',
    problem: 'Screen Replacement',
    engineer: 'Chukwudi Okafor',
    estimatedCompletion: 'Today, 6:00 PM',
    currentLocation: 'En route to repair center',
    locationDetails: 'Ikeja, Lagos'
  };

  const supportContacts = {
    1: { title: 'Pickup Delayed?', action: 'Contact Rider', phone: '+234 818 363 4915' },
    2: { title: 'Track Rider', action: 'Call Rider', phone: '+234 806 062 4622' },
    3: { title: 'Repair Question?', action: 'Contact Engineer', phone: '+234 708 463 8704' },
    4: { title: 'Delivery Issue?', action: 'Contact Support', phone: '+234 704 949 0588' }
  };

  const currentSupport = supportContacts[currentStage];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboardC" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 mt-1">Order ID: {orderDetails.orderId}</p>
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
                          <p className="text-sm text-blue-800 font-medium">
                            {stage.id === 2 && '🚗 Your device is on the way to the repair center'}
                            {stage.id === 3 && '🔧 Engineer is currently working on your device'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Estimated Completion:</span> {orderDetails.estimatedCompletion}
                </p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Location</h2>
              
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Live Map Preview</p>
                  <p className="text-sm text-gray-500 mt-1">Google Maps integration</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">{orderDetails.currentLocation}</p>
                  <p className="text-sm text-blue-700 mt-1">{orderDetails.locationDetails}</p>
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
                  <p className="font-semibold text-gray-900">{orderDetails.device}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Problem</p>
                  <p className="font-semibold text-gray-900">{orderDetails.problem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engineer</p>
                  <p className="font-semibold text-gray-900">{orderDetails.engineer}</p>
                </div>
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
                href={`tel:${currentSupport.phone}`}
                className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition mb-3"
              >
                📞 Call Now
              </a>

              <Link 
                href="/support"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-semibold hover:bg-gray-200 transition"
              >
                💬 Chat Support
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-900 font-medium">📋 View Receipt</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-900 font-medium">⭐ Rate Service</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition">
                  <span className="text-red-700 font-medium">❌ Cancel Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
