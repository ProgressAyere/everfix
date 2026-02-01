'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Shield, Bell, Clock, DollarSign, Lock, Smartphone, FileText, LogOut, AlertTriangle, Trash2, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';

export default function RiderSettings() {
  const [expandedSections, setExpandedSections] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [deleteText, setDeleteText] = useState('');
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    twoFactor: true,
    pushNotif: true,
    smsNotif: false,
    emailNotif: true,
    deliveryRequests: true,
    earningsUpdates: true,
    verificationUpdates: true,
    announcements: false,
    autoAccept: false,
    shareData: true,
    profileVisibility: 'Full Profile',
    theme: 'System Default'
  });

  useEffect(() => {
    const timer = setTimeout(() => setDeleteEnabled(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/profileR" className="w-10 h-10 flex items-center justify-center -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Account Settings</h1>
          <div className="w-10"></div>
        </div>
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-600">Changes here affect your account access and delivery experience. Review carefully before saving.</p>
        </div>
      </div>

      {/* Saved Indicator */}
      {saved && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span className="text-sm font-semibold">Saved</span>
        </div>
      )}

      <div className="px-4 pt-4 space-y-3">
        
        {/* Security & Access */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('security')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">Security & Access</span>
            </div>
            {expandedSections.security ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.security && (
            <div className="px-4 pb-4 space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-600">Update your password regularly for security</p>
                  </div>
                </div>
              </button>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-green-600">Enabled via Authenticator App</p>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactor')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactor ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <button className="text-xs text-blue-600 font-semibold">Manage Methods</button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Active Sessions & Devices</p>
                    <p className="text-xs text-gray-600">3 devices</p>
                  </div>
                  <button className="text-sm text-blue-600 font-semibold">View & Logout</button>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">Log Out Other Devices</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('notifications')} className="w-full p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">Notification Preferences</span>
            </div>
            {expandedSections.notifications ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.notifications && (
            <div className="px-4 pb-4 space-y-3">
              {[{ key: 'pushNotif', label: 'Push Notifications', desc: 'Receive alerts on your phone' },
                { key: 'smsNotif', label: 'SMS Alerts', desc: 'Receive text messages' },
                { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive email updates' }].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                  <button onClick={() => handleToggle(item.key)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <p className="text-sm font-semibold text-gray-900 mb-2">Notification Types</p>
                {[{ key: 'deliveryRequests', label: 'Delivery Requests' },
                  { key: 'earningsUpdates', label: 'Earnings Updates' },
                  { key: 'verificationUpdates', label: 'Verification Status Changes' },
                  { key: 'announcements', label: 'Platform Announcements' }].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-2 cursor-pointer">
                    <input type="checkbox" checked={settings[item.key]} onChange={() => handleToggle(item.key)} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="text-sm text-gray-900">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-800">You'll always receive critical security alerts regardless of these settings.</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-red-200">
          <div className="p-4 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-900">Account Actions</span>
            </div>
            <p className="text-xs text-red-700">These actions cannot be easily reversed. Proceed with caution.</p>
          </div>
          <div className="p-4 space-y-3">
            <button onClick={() => setShowConfirm('logout')} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
            <button onClick={() => setShowConfirm('deactivate')} className="w-full flex items-center justify-center gap-2 py-3 bg-orange-100 text-orange-700 rounded-xl font-semibold border-2 border-orange-300">
              <EyeOff className="w-5 h-5" />
              Temporarily Deactivate Account
            </button>
            <button onClick={() => setShowConfirm('delete')} disabled={!deleteEnabled} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed">
              <Trash2 className="w-5 h-5" />
              Permanently Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            {showConfirm === 'logout' && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to sign in again.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                  <Link href="/" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-center">Logout</Link>
                </div>
              </>
            )}
            {showConfirm === 'deactivate' && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Deactivate Account</h3>
                <p className="text-gray-600 mb-6">Your account will be hidden for 30 days. You can reactivate anytime by logging in. Continue?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                  <button className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold">Deactivate</button>
                </div>
              </>
            )}
            {showConfirm === 'delete' && (
              <>
                <h3 className="text-xl font-bold text-red-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-4">Are you sure? This cannot be undone. All your data will be deleted.</p>
                <p className="text-sm font-semibold text-gray-900 mb-2">Type DELETE to confirm:</p>
                <input type="text" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="DELETE" className="w-full px-4 py-3 border-2 border-red-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-500" />
                <div className="flex gap-3">
                  <button onClick={() => { setShowConfirm(null); setDeleteText(''); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                  <button disabled={deleteText !== 'DELETE'} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300">Delete Forever</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
