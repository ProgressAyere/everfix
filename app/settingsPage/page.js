'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    name: 'Chukwudi Okafor',
    email: 'chukwudi.o@email.com',
    phone: '+234 803 456 7890',
    location: 'Ikeja, Lagos'
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [securityErrors, setSecurityErrors] = useState({});

  // Notification State
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMarketing: false,
    pushOrders: true,
    pushMessages: true,
    smsOrders: false
  });

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Password Strength Calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (field, value) => {
    setSecurity({ ...security, [field]: value });
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validatePasswordChange = () => {
    const errors = {};
    if (!security.currentPassword) errors.currentPassword = 'Current password is required';
    if (!security.newPassword) errors.newPassword = 'New password is required';
    if (security.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (security.newPassword !== security.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmation('personal');
      setTimeout(() => setShowConfirmation(null), 3000);
    }, 1000);
  };

  const handleSaveSecurity = async () => {
    if (!validatePasswordChange()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
      setShowConfirmation('security');
      setTimeout(() => setShowConfirmation(null), 3000);
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmation('notifications');
      setTimeout(() => setShowConfirmation(null), 3000);
    }, 1000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2">
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'personal'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notifications
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showConfirmation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">Settings saved successfully!</p>
            </div>
          </div>
        )}

        {/* Personal Details Tab */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="space-y-5">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">{personalDetails.name.charAt(0)}</span>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={personalDetails.name}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">We'll send a verification email if you change this</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={personalDetails.location}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSavePersonal}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
            <p className="text-sm text-gray-600 mb-6">Ensure your account is using a strong password</p>
            
            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    securityErrors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {securityErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{securityErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    securityErrors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {securityErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{securityErrors.newPassword}</p>
                )}
                
                {/* Password Strength Indicator */}
                {security.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Password Strength:</span>
                      <span className={`text-sm font-semibold ${
                        passwordStrength <= 1 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use 8+ characters with uppercase, numbers, and symbols
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    securityErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {securityErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{securityErrors.confirmPassword}</p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    You'll be logged out of all devices after changing your password
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveSecurity}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
            <p className="text-sm text-gray-600 mb-6">Choose how you want to receive updates</p>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-600">Get notified about your repair status</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOrders}
                      onChange={(e) => setNotifications({ ...notifications, emailOrders: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">Marketing & Promotions</p>
                      <p className="text-sm text-gray-600">Receive special offers and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailMarketing}
                      onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Push Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-600">Real-time repair status updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushOrders}
                      onChange={(e) => setNotifications({ ...notifications, pushOrders: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">Messages</p>
                      <p className="text-sm text-gray-600">Engineer and support messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushMessages}
                      onChange={(e) => setNotifications({ ...notifications, pushMessages: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">SMS Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-600">Critical status updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsOrders}
                      onChange={(e) => setNotifications({ ...notifications, smsOrders: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
