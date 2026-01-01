'use client';
import { useState } from 'react';

const mockJobs = [
  { id: 'ORD-2024-001', device: 'iPhone 14 Pro', problem: 'Screen Replacement', customer: 'Chioma A.', location: 'Ikeja, Lagos', status: 'Picked Up', priority: 'High', estimatedTime: '2 hours', pickupTime: '10:30 AM' },
  { id: 'ORD-2024-002', device: 'Samsung Galaxy S23', problem: 'Battery Replacement', customer: 'Emeka O.', location: 'Lekki, Lagos', status: 'In Repair', priority: 'Medium', estimatedTime: '3 hours', pickupTime: '9:00 AM' },
  { id: 'ORD-2024-003', device: 'MacBook Pro M2', problem: 'Keyboard Issue', customer: 'Fatima M.', location: 'Victoria Island, Lagos', status: 'Pending', priority: 'Low', estimatedTime: '4 hours', pickupTime: '2:00 PM' },
  { id: 'ORD-2024-004', device: 'iPhone 13', problem: 'Charging Port Issue', customer: 'Tunde B.', location: 'Surulere, Lagos', status: 'In Repair', priority: 'High', estimatedTime: '1.5 hours', pickupTime: '11:00 AM' },
  { id: 'ORD-2024-005', device: 'HP Pavilion 15', problem: 'Screen Replacement', customer: 'Ada N.', location: 'Yaba, Lagos', status: 'Completed', priority: 'Medium', estimatedTime: '3 hours', pickupTime: '8:00 AM' }
];

const statusOptions = ['Pending', 'Picked Up', 'In Repair', 'Completed', 'Ready for Return'];
const filterOptions = ['All', 'Pending', 'Picked Up', 'In Repair', 'Completed'];

export default function EngineerDashboard() {
  const [jobs, setJobs] = useState(mockJobs);
  const [filter, setFilter] = useState('All');
  const [confirmingStatus, setConfirmingStatus] = useState(null);

  const handleStatusUpdate = (jobId, newStatus) => {
    setConfirmingStatus({ jobId, newStatus });
  };

  const confirmStatusUpdate = () => {
    if (confirmingStatus) {
      setJobs(jobs.map(job => 
        job.id === confirmingStatus.jobId 
          ? { ...job, status: confirmingStatus.newStatus }
          : job
      ));
      setConfirmingStatus(null);
    }
  };

  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Engineer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your assigned repair jobs</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{jobs.filter(j => j.status === 'In Repair').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'Completed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-600">{jobs.filter(j => j.status === 'Pending').length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === option 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">No jobs found for this filter</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Job Info */}
                  <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">{job.id}</p>
                      <span className={`inline-block mt-1 text-xs font-semibold ${getPriorityColor(job.priority)}`}>
                        {job.priority} Priority
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Device & Problem</p>
                      <p className="font-semibold text-gray-900">{job.device}</p>
                      <p className="text-sm text-gray-700">{job.problem}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">{job.customer}</p>
                      <p className="text-sm text-gray-700">{job.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-semibold text-gray-900">{job.pickupTime}</p>
                      <p className="text-sm text-gray-700">Est: {job.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    
                    <div className="relative">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmingStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Status Update</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to update the status to <span className="font-semibold">{confirmingStatus.newStatus}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingStatus(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
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
