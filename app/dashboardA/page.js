'use client';
import { useState } from 'react';

const mockPendingEngineers = [
  { id: 1, name: 'Adebayo Oluwaseun', email: 'adebayo.o@email.com', phone: '+234 803 456 7890', specialization: 'iPhone Specialist', experience: '5 years', appliedDate: '2024-01-15', documents: 'Verified' },
  { id: 2, name: 'Ngozi Okonkwo', email: 'ngozi.ok@email.com', phone: '+234 805 123 4567', specialization: 'Android & Samsung', experience: '3 years', appliedDate: '2024-01-14', documents: 'Pending Review' },
  { id: 3, name: 'Ibrahim Musa', email: 'ibrahim.m@email.com', phone: '+234 807 890 1234', specialization: 'Laptop Repair', experience: '7 years', appliedDate: '2024-01-13', documents: 'Verified' }
];

const mockActiveOrders = [
  { id: 'ORD-2024-001', customer: 'Chioma A.', device: 'iPhone 14 Pro', engineer: 'Chukwudi Okafor', status: 'In Repair', priority: 'High', time: '2 hours ago' },
  { id: 'ORD-2024-002', customer: 'Emeka O.', device: 'Samsung Galaxy S23', engineer: 'Tunde Bakare', status: 'Picked Up', priority: 'Medium', time: '4 hours ago' },
  { id: 'ORD-2024-003', customer: 'Fatima M.', device: 'MacBook Pro M2', engineer: 'Ada Nwosu', status: 'Pending', priority: 'Low', time: '6 hours ago' },
  { id: 'ORD-2024-004', customer: 'Tunde B.', device: 'iPhone 13', engineer: 'Chukwudi Okafor', status: 'Completed', priority: 'High', time: '8 hours ago' }
];

export default function AdminDashboard() {
  const [pendingEngineers, setPendingEngineers] = useState(mockPendingEngineers);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleApprove = (engineerId) => {
    setConfirmAction({ type: 'approve', engineerId });
  };

  const handleReject = (engineerId) => {
    setConfirmAction({ type: 'reject', engineerId });
  };

  const confirmApproval = () => {
    if (confirmAction) {
      setPendingEngineers(pendingEngineers.filter(e => e.id !== confirmAction.engineerId));
      setConfirmAction(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-gray-100 text-gray-700';
      case 'Picked Up': return 'bg-blue-100 text-blue-700';
      case 'In Repair': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform oversight and management</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1,247</p>
            <p className="text-sm text-green-600">↑ 12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Active Engineers</p>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">87</p>
            <p className="text-sm text-gray-600">{pendingEngineers.length} pending approval</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Revenue (MTD)</p>
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">₦2.4M</p>
            <p className="text-sm text-green-600">↑ 8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">4.2h</p>
            <p className="text-sm text-red-600">↓ 15min from last month</p>
          </div>
        </div>

        {/* Engineer Approval Table */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pending Engineer Approvals</h2>
                <p className="text-sm text-gray-600 mt-1">{pendingEngineers.length} applications awaiting review</p>
              </div>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                {pendingEngineers.length} Pending
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingEngineers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No pending approvals
                    </td>
                  </tr>
                ) : (
                  pendingEngineers.map(engineer => (
                    <tr key={engineer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{engineer.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{engineer.email}</p>
                        <p className="text-sm text-gray-600">{engineer.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {engineer.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{engineer.experience}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          engineer.documents === 'Verified' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {engineer.documents}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{engineer.appliedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(engineer.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(engineer.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Orders Overview */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
                <p className="text-sm text-gray-600 mt-1">Real-time order tracking</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                View All Orders
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Engineer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockActiveOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.device}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.engineer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm {confirmAction.type === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to {confirmAction.type} this engineer application?
                {confirmAction.type === 'approve' && ' They will be granted access to the platform.'}
                {confirmAction.type === 'reject' && ' This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    confirmAction.type === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
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
