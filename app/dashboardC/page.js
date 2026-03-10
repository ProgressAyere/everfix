'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CustomerDashboard() {
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  const [activeRepairs, setActiveRepairs] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    loadVerificationStatus();
    loadActiveRepairs();
    loadOrderHistory();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data, error } = await supabase
          .from('customers_verification')
          .select('verification_status')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading verification status:', error);
        }
        
        if (data) setVerificationStatus(data.verification_status || 'unverified');
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const loadActiveRepairs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['ongoing', 'pending'])
          .order('created_at', { ascending: false });
        if (data) setActiveRepairs(data);
      }
    } catch (error) {
      console.error('Error loading active repairs:', error);
    }
  };

  const loadOrderHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10);
        if (data) setOrderHistory(data);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const getVerificationBadge = () => {
    switch(verificationStatus) {
      case 'verified':
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={16} /> Verified</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1"><AlertTriangle size={16} className="text-yellow-600" /> Verification Pending</span>;
      case 'partial':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1"><AlertTriangle size={16} className="text-yellow-600" /> Partially Verified</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex items-center gap-1"><AlertTriangle size={16} className="text-red-600" /> Unverified</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your repair requests</p>
          </div>
          <div className="flex items-center gap-3">
            {getVerificationBadge()}
            <Link
              href="/pickup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Wrench size={24} />
              Request Fix
            </Link>
          </div>
        </div>

        {/* Verification Alert Banner */}
        {verificationStatus !== 'verified' && verificationStatus !== 'approved' && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
            <Link href="/verificationC" className="block">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="text-blue-600 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap text-blue-700 font-medium">
                    Verify Identity to secure account now • Verify Identity to secure account now • Verify Identity to secure account now • Verify Identity to secure account now
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Active Repair Requests */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Repairs</h2>
          {activeRepairs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {activeRepairs.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900">{order.order_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'ongoing' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Device</p>
                      <p className="font-medium">{order.device_info}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium">{order.service_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
                    Track Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No active repairs</p>
            </div>
          )}
        </section>

        {/* Order History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
          {orderHistory.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Device</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderHistory.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{order.device_info}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{order.service_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No order history</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
