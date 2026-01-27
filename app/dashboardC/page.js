'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const deviceData = {
  phone: {
    brands: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Tecno', 'Infinix', 'Nokia', 'Google', 'OnePlus'],
    models: {
      Apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'],
      Samsung: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Galaxy A54', 'Galaxy A34', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5'],
      Huawei: ['P60 Pro', 'P50 Pro', 'Mate 50', 'Nova 11', 'Y9'],
      Xiaomi: ['13 Pro', '13', '12 Pro', 'Redmi Note 13', 'Redmi Note 12', 'Poco X5'],
      Oppo: ['Find X6 Pro', 'Reno 10', 'A78', 'A58'],
      Vivo: ['X90 Pro', 'V29', 'Y36', 'Y27'],
      Tecno: ['Phantom X2', 'Camon 20', 'Spark 10', 'Pova 5'],
      Infinix: ['Note 30', 'Hot 30', 'Zero 30', 'Smart 7'],
      Nokia: ['G60', 'G42', 'C32', 'C12'],
      Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7'],
      OnePlus: ['11', '11R', 'Nord 3', 'Nord CE 3']
    },
    problems: ['Battery Replacement', 'Screen Replacement', 'Charging Port Issue', 'Water Damage', 'Camera Issue', 'Speaker/Microphone Issue', 'Software Issue', 'Others']
  },
  laptop: {
    brands: ['Apple', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'MSI', 'Razer'],
    models: {
      Apple: ['MacBook Pro 16" M3', 'MacBook Pro 14" M3', 'MacBook Air M2', 'MacBook Air M1'],
      HP: ['Pavilion 15', 'Envy 13', 'Spectre x360', 'EliteBook 840', 'Omen 16'],
      Dell: ['XPS 15', 'XPS 13', 'Inspiron 15', 'Latitude 7420', 'Alienware m15'],
      Lenovo: ['ThinkPad X1 Carbon', 'IdeaPad 5', 'Legion 5', 'Yoga 9i'],
      Asus: ['ZenBook 14', 'VivoBook 15', 'ROG Zephyrus G14', 'TUF Gaming A15'],
      Acer: ['Swift 3', 'Aspire 5', 'Predator Helios 300', 'Nitro 5'],
      Microsoft: ['Surface Laptop 5', 'Surface Pro 9', 'Surface Book 3'],
      MSI: ['GF63 Thin', 'Prestige 14', 'Stealth 15M'],
      Razer: ['Blade 15', 'Blade 14', 'Book 13']
    },
    problems: ['Screen Replacement', 'Keyboard Issue', 'Battery Replacement', 'Overheating', 'Hard Drive Issue', 'RAM Upgrade', 'Hinge Repair', 'Software Issue', 'Others']
  }
};

const mockActiveRepairs = [
  { id: 'ORD-2024-001', device: 'iPhone 14 Pro', problem: 'Screen Replacement', status: 'In Progress', date: '2024-01-20', color: 'blue' },
  { id: 'ORD-2024-002', device: 'MacBook Pro M2', problem: 'Battery Replacement', status: 'Ready for Pickup', date: '2024-01-18', color: 'green' }
];

const mockOrderHistory = [
  { id: 'ORD-2023-089', device: 'Samsung Galaxy S23', problem: 'Charging Port Issue', status: 'Completed', date: '2023-12-15' },
  { id: 'ORD-2023-078', device: 'HP Pavilion 15', problem: 'Keyboard Issue', status: 'Completed', date: '2023-11-20' }
];

export default function CustomerDashboard() {
  const [verificationStatus, setVerificationStatus] = useState('unverified');

  useEffect(() => {
    const status = localStorage.getItem('customerVerificationStatus') || 'unverified';
    setVerificationStatus(status);
  }, []);

  const getVerificationBadge = () => {
    switch(verificationStatus) {
      case 'verified':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Verified</span>;
      case 'partial':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">⚠ Partially Verified</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">⚠ Unverified</span>;
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
            {verificationStatus !== 'verified' && (
              <Link
                href="/verificationC"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Click to Verify Customer Account
              </Link>
            )}
            <Link
              href="/pickup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Request Fix
            </Link>
          </div>
        </div>

        {/* Active Repair Requests */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Repairs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockActiveRepairs.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Device</p>
                    <p className="font-medium">{order.device}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Problem</p>
                    <p className="font-medium">{order.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Completion</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
                  Track Order
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Order History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Problem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockOrderHistory.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.device}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.problem}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
