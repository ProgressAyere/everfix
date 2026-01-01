'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [engineerAssigned, setEngineerAssigned] = useState(true); // Toggle for pending state

  // Mock data - would come from previous form/API
  const pickupDetails = {
    device: 'iPhone 14 Pro',
    brand: 'Apple',
    problem: 'Screen Replacement',
    model: 'iPhone 14 Pro',
    condition: '2 years old, good condition',
    color: 'Space Black',
    location: 'Ikeja, Lagos',
    requestDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };

  const assignedEngineer = {
    name: 'Chukwudi Okafor',
    rating: 4.8,
    completedJobs: 127,
    specialization: 'iPhone Specialist',
    estimatedArrival: '30-45 minutes',
    distance: '2.3 km away'
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      router.push('/dashboardC');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Request</h1>
          <p className="text-gray-600">Review your pickup details before confirming</p>
        </div>

        {/* Pickup Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Device</span>
              <span className="font-semibold text-gray-900">{pickupDetails.device}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Brand</span>
              <span className="font-semibold text-gray-900">{pickupDetails.brand}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Model</span>
              <span className="font-semibold text-gray-900">{pickupDetails.model}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Problem</span>
              <span className="font-semibold text-gray-900">{pickupDetails.problem}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Condition</span>
              <span className="font-semibold text-gray-900">{pickupDetails.condition}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Color</span>
              <span className="font-semibold text-gray-900">{pickupDetails.color}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Pickup Location</span>
              <span className="font-semibold text-gray-900">{pickupDetails.location}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Request Date</span>
              <span className="font-semibold text-gray-900">{pickupDetails.requestDate}</span>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 text-sm font-medium hover:underline"
          >
            ← Edit Details
          </button>
        </div>

        {/* Engineer Assignment */}
        {engineerAssigned ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Engineer</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">{assignedEngineer.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{assignedEngineer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{assignedEngineer.specialization}</p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="font-semibold">{assignedEngineer.rating}</span>
                  </div>
                  <span className="text-gray-600">{assignedEngineer.completedJobs} jobs completed</span>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">ETA: <span className="font-semibold">{assignedEngineer.estimatedArrival}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-gray-700">{assignedEngineer.distance}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> Engineer assignment is final. To change, you must cancel and create a new request.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Engineer Assignment</h2>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium mb-2">Finding the best engineer for you...</p>
              <p className="text-sm text-gray-500">This usually takes less than a minute</p>
            </div>
          </div>
        )}

        {/* Confirmation Button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={handleConfirm}
            disabled={!engineerAssigned || isConfirming}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
              </span>
            ) : (
              'Confirm Pickup Request'
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            By confirming, you agree to our terms and conditions
          </p>
        </div>

        {/* Cancel Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboardC')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
}
