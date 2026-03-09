'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Eye, LogOut, ArrowLeft } from 'lucide-react';

export default function VerificationsPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/adminLogin');
  };

  const fetchVerifications = async () => {
    setLoading(true);
    
    let query = supabase
      .from('customers_verification')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filter === 'pending') {
      query = query.in('verification_status', ['pending', 'partial', 'unverified']);
    } else {
      query = query.eq('verification_status', filter);
    }
    
    const { data, error } = await query;
    
    console.log('Verifications data:', data);
    console.log('Error:', error);
    
    if (!error) setVerifications(data || []);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const verification = verifications.find(v => v.id === id);
    
    // Update customers_verification table
    const { error: verifyError } = await supabase
      .from('customers_verification')
      .update({ verification_status: 'approved', updated_at: new Date() })
      .eq('id', id);

    if (!verifyError && verification) {
      // Update users table
      await supabase
        .from('users')
        .update({ 
          is_verified: true, 
          verification_status: 'verified',
          updated_at: new Date() 
        })
        .eq('email', verification.email);

      fetchVerifications();
      setSelectedVerification(null);
    }
  };

  const handleReject = async (id) => {
    const verification = verifications.find(v => v.id === id);
    
    // Update customers_verification table
    const { error: verifyError } = await supabase
      .from('customers_verification')
      .update({ verification_status: 'rejected', updated_at: new Date() })
      .eq('id', id);

    if (!verifyError && verification) {
      // Update users table
      await supabase
        .from('users')
        .update({ 
          is_verified: false, 
          verification_status: 'failed',
          updated_at: new Date() 
        })
        .eq('email', verification.email);

      fetchVerifications();
      setSelectedVerification(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboardA')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Verifications</h1>
              <p className="text-gray-600 mt-1">Review and approve customer verification requests</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {['pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Verifications Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : verifications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No verifications found</td>
                  </tr>
                ) : (
                  verifications.map(verification => (
                    <tr key={verification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{verification.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{verification.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{verification.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {verification.identity_card_type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedVerification(verification)}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {filter === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(verification.id)}
                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(verification.id)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {selectedVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Verification Details</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedVerification.full_name}</p>
                  <p className="text-sm text-gray-600">Email: {selectedVerification.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedVerification.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-sm text-gray-600">{selectedVerification.address}</p>
                  <p className="text-sm text-gray-600">{selectedVerification.lga}, {selectedVerification.state}</p>
                  {selectedVerification.landmark && <p className="text-sm text-gray-600">Landmark: {selectedVerification.landmark}</p>}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                  <p className="text-sm text-gray-600">Name: {selectedVerification.emergency_name}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedVerification.emergency_phone}</p>
                  <p className="text-sm text-gray-600">Relationship: {selectedVerification.emergency_relationship}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Identity Card</h4>
                  <p className="text-sm text-gray-600">Type: {selectedVerification.identity_card_type}</p>
                  {selectedVerification.nin_number && <p className="text-sm text-gray-600">NIN: {selectedVerification.nin_number}</p>}
                  {selectedVerification.passport_number && <p className="text-sm text-gray-600">Passport: {selectedVerification.passport_number}</p>}
                  {selectedVerification.driver_license_number && <p className="text-sm text-gray-600">License: {selectedVerification.driver_license_number}</p>}
                </div>

                {selectedVerification.live_photo_url && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Live Photo</h4>
                    <img src={selectedVerification.live_photo_url} alt="Live" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Close
                </button>
                {filter === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedVerification.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedVerification.id)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
