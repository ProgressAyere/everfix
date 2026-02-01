'use client';
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Edit2, CheckCircle, AlertCircle, Clock, Smartphone, History, Wallet, CreditCard, DollarSign, Star, Shield, Lock, Bell, Settings, HelpCircle, FileText, LogOut, Trash2, EyeOff, ChevronDown, ChevronUp, Plus, X, Eye, EyeOff as EyeOffIcon } from 'lucide-react';

export default function ProfileC() {
  const [expandedSections, setExpandedSections] = useState({});
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg mt-[65]">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              JD
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Edit2 size={14} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">John Doe</h1>
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <p className="text-blue-100 text-sm">ID: CUST-2024-1234</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle size={12} />
              <span>Verified Customer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Personal Information</h2>
            </div>
            <button className="text-blue-600 text-sm font-medium">Edit</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">+234 801 234 5678</p>
                  <CheckCircle size={14} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">john.doe@email.com</p>
                  <CheckCircle size={14} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={18} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Primary Address</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                </div>
                <p className="text-sm font-medium">15 Admiralty Way, Lekki Phase 1, Lagos</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-blue-600 text-sm font-medium py-2 border border-blue-200 rounded-lg">
              <Plus size={16} />
              Add Another Address
            </button>
          </div>
        </div>

        {/* Device Management */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Device Management</h2>
            </div>
            <button className="text-blue-600 text-sm font-medium">Add Device</button>
          </div>

          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">iPhone 13 Pro</p>
                  <p className="text-xs text-gray-500">IMEI: XXXXX1234</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">In Repair</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                <span>2 repairs</span>
                <span>•</span>
                <span>Last: Jan 15, 2024</span>
              </div>
              <button className="text-blue-600 text-xs font-medium mt-2">View History</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">Samsung Galaxy S22</p>
                  <p className="text-xs text-gray-500">IMEI: XXXXX5678</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                <span>1 repair</span>
                <span>•</span>
                <span>Last: Dec 10, 2023</span>
              </div>
              <button className="text-blue-600 text-xs font-medium mt-2">View History</button>
            </div>
          </div>
        </div>

        {/* Order and Repair History */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Order & Repair History</h2>
            </div>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>

          <div className="space-y-3">
            <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">Screen Replacement</p>
                  <p className="text-xs text-gray-500">Order #ORD-2024-0156</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Ongoing</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">iPhone 13 Pro • Engineer: Mike O.</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Jan 20, 2024</span>
                <button className="text-blue-600 font-medium">Track</button>
              </div>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">Battery Replacement</p>
                  <p className="text-xs text-gray-500">Order #ORD-2023-0892</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Samsung Galaxy S22 • Engineer: Sarah K.</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Dec 10, 2023</span>
                <button className="text-blue-600 font-medium">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Payments and Billing */}
        <div className="bg-blue-50 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Payments & Billing</h2>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 mb-3">
            <p className="text-xs text-blue-100 mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold">₦12,500.00</p>
            <button className="mt-3 bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg">
              Top Up
            </button>
          </div>

          <div className="space-y-2 mb-3">
            <div className="bg-white rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">•••• 4532</p>
                  <p className="text-xs text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-blue-600 text-sm font-medium py-2 bg-white border border-blue-200 rounded-lg">
              <Plus size={16} />
              Add Payment Method
            </button>
          </div>

          <div className="space-y-2">
            <button onClick={() => toggleSection('transactions')} className="w-full flex items-center justify-between text-sm font-medium py-2 px-3 bg-white rounded-lg">
              <span>Transaction History</span>
              {expandedSections.transactions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {expandedSections.transactions && (
              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">Screen Repair Payment</p>
                    <p className="text-xs text-gray-500">Jan 20, 2024</p>
                  </div>
                  <p className="font-medium text-red-600">-₦15,000</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">Wallet Top-up</p>
                    <p className="text-xs text-gray-500">Jan 18, 2024</p>
                  </div>
                  <p className="font-medium text-green-600">+₦20,000</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3">Last updated: Jan 20, 2024 at 3:45 PM</p>
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Ratings & Reviews</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-600">Total Ratings</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">4.8</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">2</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>

          <button className="w-full text-blue-600 text-sm font-medium py-2 border border-blue-200 rounded-lg">
            View All Reviews
          </button>
        </div>

        {/* Security and Privacy */}
        <div className="bg-orange-50 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-orange-600" />
              <h2 className="text-lg font-bold">Security & Privacy</h2>
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Change Password</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-green-600">Enabled</p>
                </div>
              </div>
              <button onClick={() => setShow2FAModal(true)} className="text-blue-600 text-sm font-medium">Manage</button>
            </div>

            <button onClick={() => toggleSection('sessions')} className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              {expandedSections.sessions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedSections.sessions && (
              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between text-sm">
                  <div>
                    <p className="font-medium">iPhone 13 Pro • Safari</p>
                    <p className="text-xs text-gray-500">Lagos, Nigeria • Current</p>
                    <p className="text-xs text-gray-400">Last active: Just now</p>
                  </div>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <div>
                    <p className="font-medium">Windows PC • Chrome</p>
                    <p className="text-xs text-gray-500">Lagos, Nigeria</p>
                    <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                  </div>
                  <button className="text-red-600 text-xs font-medium">End</button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Data Sharing</span>
              </div>
              <button className="text-blue-600 text-sm font-medium">Settings</button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">Last updated: Jan 15, 2024 at 10:30 AM</p>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold">Preferences</h2>
          </div>

          <div className="space-y-2">
            <button onClick={() => toggleSection('notifications')} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Notification Settings</span>
              </div>
              {expandedSections.notifications ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedSections.notifications && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Order Updates</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Promotions</span>
                  <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Preferred Engineers</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Delivery Windows</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* Support and Safety */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold">Support & Safety</h2>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Customer Support</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Report a Dispute</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Warranties & Claims</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-red-600" />
                <span className="text-sm font-medium text-red-600">Emergency Assistance</span>
              </div>
              <ChevronDown size={16} className="text-red-400 rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-2 border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Account Actions</h2>
          
          <div className="space-y-2">
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>

            <button onClick={() => setShowDeactivateModal(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-orange-50 text-orange-600 rounded-lg font-medium border border-orange-200">
              <EyeOff size={18} />
              <span>Deactivate Account</span>
            </button>

            <button onClick={() => setShowDeleteAccountModal(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg font-medium border border-red-200">
              <Trash2 size={18} />
              <span>Delete Account</span>
            </button>
          </div>

          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">Deactivating or deleting your account is permanent and cannot be undone. All data will be lost.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Log Out</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-medium">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-orange-600" />
              <h3 className="text-lg font-bold">Deactivate Account</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your account will be temporarily disabled. You can reactivate it anytime by logging in.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeactivateModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium">Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-red-600" />
              <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">This action is permanent and cannot be undone. All your data, orders, and payment information will be permanently deleted.</p>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type "DELETE" to confirm:</label>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowDeleteAccountModal(false); setDeleteConfirmText(''); }} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button 
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
