'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statusOptions = ['Pending', 'Picked Up', 'In Repair', 'Completed', 'Ready for Return'];

export default function JobDetailsPage() {
  const router = useRouter();
  const [status, setStatus] = useState('In Repair');
  const [notes, setNotes] = useState('');
  const [proofFiles, setProofFiles] = useState([]);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Mock job data
  const jobData = {
    orderId: 'ORD-2024-001',
    device: 'iPhone 14 Pro',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    problem: 'Screen Replacement',
    condition: '2 years old, good condition',
    color: 'Space Black',
    otherInfo: 'Small crack on top right corner',
    estimatedTime: '2 hours',
    priority: 'High',
    customer: {
      name: 'Chioma Adebayo',
      phone: '+234 803 456 7890',
      email: 'chioma.a@email.com',
      location: 'Ikeja, Lagos',
      address: '15 Allen Avenue, Ikeja'
    },
    pickup: {
      status: 'Completed',
      time: '10:30 AM',
      rider: 'Tunde Bakare',
      riderPhone: '+234 801 234 5678'
    },
    timeline: [
      { status: 'Order Placed', time: '9:45 AM', completed: true },
      { status: 'Picked Up', time: '10:30 AM', completed: true },
      { status: 'In Repair', time: '11:00 AM', completed: true },
      { status: 'Completed', time: '-', completed: false }
    ]
  };

  const handleStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = () => {
    setStatus(pendingStatus);
    setShowStatusConfirm(false);
    setPendingStatus('');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setProofFiles([...proofFiles, ...files]);
  };

  const removeFile = (index) => {
    setProofFiles(proofFiles.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/dashboardE');
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-gray-100 text-gray-700';
      case 'Picked Up': return 'bg-blue-100 text-blue-700';
      case 'In Repair': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Ready for Return': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2">
            ← Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-600 mt-1">{jobData.orderId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(status)} inline-block`}>
              {status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold text-gray-900">{jobData.device}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="font-semibold text-gray-900">{jobData.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold text-gray-900">{jobData.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Problem</p>
                  <p className="font-semibold text-gray-900">{jobData.problem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="font-semibold text-gray-900">{jobData.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Color</p>
                  <p className="font-semibold text-gray-900">{jobData.color}</p>
                </div>
              </div>

              {jobData.otherInfo && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Additional Information</p>
                  <p className="text-sm text-blue-800">{jobData.otherInfo}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">Est. Time: <span className="font-semibold">{jobData.estimatedTime}</span></span>
                </div>
                <span className={`text-sm font-semibold ${
                  jobData.priority === 'High' ? 'text-red-600' : 
                  jobData.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {jobData.priority} Priority
                </span>
              </div>
            </div>

            {/* Pickup Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Status</h2>
              
              <div className="space-y-3">
                {jobData.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {item.completed ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.status}</p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Rider:</span> {jobData.pickup.rider}
                </p>
                <a href={`tel:${jobData.pickup.riderPhone}`} className="text-sm text-blue-600 hover:underline">
                  {jobData.pickup.riderPhone}
                </a>
              </div>
            </div>

            {/* Engineer Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Engineer Notes</h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="5"
                placeholder="Add notes about the repair process, parts used, issues encountered, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Proof Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Proof of Repair (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">Upload photos or documents showing completed repair</p>
              
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-700 font-medium">Click to upload files</p>
                <p className="text-sm text-gray-500 mt-1">Images or PDF files</p>
              </label>

              {proofFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {proofFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{jobData.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href={`tel:${jobData.customer.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {jobData.customer.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${jobData.customer.email}`} className="font-semibold text-blue-600 hover:underline break-all">
                    {jobData.customer.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{jobData.customer.location}</p>
                  <p className="text-sm text-gray-700 mt-1">{jobData.customer.address}</p>
                </div>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                📞 Call Customer
              </button>
            </div>

            {/* Status Control */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
              
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium mb-4"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  📋 View Order History
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  💬 Message Customer
                </button>
                <button className="w-full text-left px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition text-red-700">
                  ⚠️ Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Confirmation Modal */}
        {showStatusConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Status Change</h3>
              <p className="text-gray-700 mb-6">
                Change status from <span className="font-semibold">{status}</span> to <span className="font-semibold">{pendingStatus}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
