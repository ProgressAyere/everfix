'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockEngineers = [
  { id: 1, name: 'Chukwudi Okafor', rating: 4.8, completedJobs: 127, specialization: 'iPhone Specialist', estimatedArrival: '30-45 minutes', distance: '2.3 km away' },
  { id: 2, name: 'Tunde Bakare', rating: 4.6, completedJobs: 98, specialization: 'Android & Samsung Expert', estimatedArrival: '40-50 minutes', distance: '3.1 km away' },
  { id: 3, name: 'Ada Nwosu', rating: 4.9, completedJobs: 156, specialization: 'All Brands Specialist', estimatedArrival: '25-35 minutes', distance: '1.8 km away' },
  { id: 4, name: 'Ibrahim Musa', rating: 4.7, completedJobs: 112, specialization: 'Screen Repair Expert', estimatedArrival: '35-45 minutes', distance: '2.7 km away' }
];

export default function ConfirmationPage() {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [showEngineerList, setShowEngineerList] = useState(true);

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
    if (!selectedEngineer) return;
    
    setIsConfirming(true);
    
    // Vibrate phone on confirmation
    if ('vibrate' in navigator) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      router.push('/dashboardC');
    }, 2000);
  };

  const handleSelectEngineer = (engineer) => {
    setSelectedEngineer(engineer);
    setShowEngineerList(false);
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

        {/* Engineer Selection */}
        {showEngineerList ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Engineer</h2>
            <p className="text-gray-600 mb-6">Choose from available engineers in your area</p>
            
            <div className="space-y-4">
              {mockEngineers.map(engineer => (
                <div
                  key={engineer.id}
                  onClick={() => handleSelectEngineer(engineer)}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">{engineer.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{engineer.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{engineer.specialization}</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                          <span className="font-semibold">{engineer.rating}</span>
                        </div>
                        <span className="text-gray-600">{engineer.completedJobs} jobs</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <span>⏱️ {engineer.estimatedArrival}</span>
                        <span>📍 {engineer.distance}</span>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Selected Engineer</h2>
              <button
                onClick={() => setShowEngineerList(true)}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Change Engineer
              </button>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">{selectedEngineer?.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{selectedEngineer?.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedEngineer?.specialization}</p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="font-semibold">{selectedEngineer?.rating}</span>
                  </div>
                  <span className="text-gray-600">{selectedEngineer?.completedJobs} jobs completed</span>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">ETA: <span className="font-semibold">{selectedEngineer?.estimatedArrival}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-gray-700">{selectedEngineer?.distance}</span>
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
        )}

        {/* Confirmation Button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedEngineer || isConfirming}
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
            onClick={() => router.push('/pickup')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
}
