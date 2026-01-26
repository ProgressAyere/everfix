'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerVerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    profilePhoto: null,
    profilePhotoPreview: null,
    email: '',
    emailVerified: false,
    phone: '',
    otp: '',
    phoneVerified: false,
    address: '',
    state: '',
    lga: '',
    landmark: '',
    deviceBrand: '',
    deviceModel: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    consentData: false,
    consentTerms: false
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Identity', icon: '👤', required: true },
    { id: 2, title: 'Phone Verification', icon: '📱', required: true },
    { id: 3, title: 'Pickup Address', icon: '📍', required: true },
    { id: 4, title: 'Device Info', icon: '📱', required: false },
    { id: 5, title: 'Emergency Contact', icon: '👥', required: false },
    { id: 6, title: 'Security & Consent', icon: '🔒', required: true }
  ];

  const nigerianStates = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Ogun', 'Anambra'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 3000000) {
      setErrors({ ...errors, profilePhoto: 'File size must be less than 3MB' });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: file, profilePhotoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
    setErrors({ ...errors, profilePhoto: '' });
  };

  const validatePhone = (phone) => {
    if (!/^0[789]\d{9}$/.test(phone)) {
      setErrors({ ...errors, phone: 'Enter valid Nigerian phone number (e.g., 08012345678)' });
      return false;
    }
    setErrors({ ...errors, phone: '' });
    return true;
  };

  const handleSendOTP = () => {
    if (validatePhone(formData.phone)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setOtpSent(true);
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleVerifyOTP = () => {
    if (formData.otp.length === 6) {
      setFormData({ ...formData, phoneVerified: true });
      setErrors({ ...errors, otp: '' });
    } else {
      setErrors({ ...errors, otp: 'Enter valid 6-digit OTP' });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.fullName || !formData.email)) {
      setErrors({ ...errors, identity: 'Please complete all required fields' });
      return;
    }
    if (currentStep === 2 && !formData.phoneVerified) {
      setErrors({ ...errors, phone: 'Please verify your phone number' });
      return;
    }
    if (currentStep === 3 && (!formData.address || !formData.state)) {
      setErrors({ ...errors, address: 'Please complete address details' });
      return;
    }
    if (currentStep === 6 && (!formData.consentData || !formData.consentTerms)) {
      setErrors({ ...errors, consent: 'Please accept all required consents' });
      return;
    }
    
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSaveForLater = () => {
    localStorage.setItem('customerVerificationData', JSON.stringify(formData));
    localStorage.setItem('customerVerificationStatus', 'partial');
    router.push('/dashboardC');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('customerVerificationStatus', 'verified');
      router.push('/dashboardC');
    }, 2000);
  };

  const getCompletionStatus = () => {
    const completed = [
      formData.fullName && formData.email,
      formData.phoneVerified,
      formData.address && formData.state,
      true,
      true,
      formData.consentData && formData.consentTerms
    ].filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">Quick verification to ensure safe pickups and accurate deliveries</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-blue-800">🔒 Your information is encrypted and never shared without consent</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Completion Progress</span>
            <span className="text-sm font-medium text-blue-600">{getCompletionStatus()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${getCompletionStatus()}%` }}></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max md:min-w-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                  {step.required && <span className="text-xs text-red-500">*Required</span>}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          
          {/* Step 1: Basic Identity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👤</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Identity Information</h2>
                <p className="text-gray-600">Help us know who we're serving so we can provide personalized support</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">We'll send order updates and receipts here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label htmlFor="profilePhoto" className="cursor-pointer">
                    {formData.profilePhotoPreview ? (
                      <div>
                        <img src={formData.profilePhotoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to change photo</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-400 text-3xl mb-2">📷</div>
                        <p className="text-sm text-gray-700">Click to upload photo</p>
                        <p className="text-xs text-gray-500 mt-1">Helps engineers identify you during pickup</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              {errors.identity && <p className="text-red-500 text-sm">{errors.identity}</p>}
            </div>
          )}

          {/* Step 2: Phone Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📱</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Verification</h2>
                <p className="text-gray-600">Verify your number so engineers can contact you for pickup coordination</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  maxLength="11"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="08012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              ) : !formData.phoneVerified ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  <button
                    onClick={handleVerifyOTP}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Verify Code
                  </button>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">Code sent to {formData.phone}</p>
                    <button onClick={handleSendOTP} className="text-sm text-blue-600 hover:underline">Resend</button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">✓ Phone number verified successfully!</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">⏱️ Code may take 1-2 minutes. Check your messages</p>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Address Verification</h2>
                <p className="text-gray-600">Where should we pick up your device? This ensures accurate and timely service</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  placeholder="Enter your full address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LGA *</label>
                  <input
                    type="text"
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    placeholder="Local Government Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g., Near Shoprite, Opposite Police Station"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Helps engineers find you easily</p>
              </div>
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          )}

          {/* Step 4: Device Info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📱</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Device Ownership Confirmation</h2>
                <p className="text-gray-600">Optional: Pre-fill device details to speed up future repair requests</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Device Brand</label>
                <input
                  type="text"
                  value={formData.deviceBrand}
                  onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                  placeholder="e.g., Apple, Samsung, Tecno"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Model</label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  placeholder="e.g., iPhone 14, Galaxy S23"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">💡 This is optional but helps us match you with the right specialist</p>
              </div>
            </div>
          )}

          {/* Step 5: Emergency Contact */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👥</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency/Alternate Contact</h2>
                <p className="text-gray-600">Optional: Someone we can reach if we can't contact you during pickup</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="Enter contact name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  maxLength="11"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value.replace(/\D/g, '') })}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={formData.emergencyRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select relationship</option>
                  <option value="Family">Family Member</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">ℹ️ This contact is only used if we can't reach you</p>
              </div>
            </div>
          )}

          {/* Step 6: Security & Consent */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Consent</h2>
                <p className="text-gray-600">Review and accept our terms to complete verification</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentData}
                    onChange={(e) => setFormData({ ...formData, consentData: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to Phone Fix collecting and processing my personal information for service delivery, communication, and account management. My data will be protected according to Nigerian data protection regulations. *
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentTerms}
                    onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. I understand that verified engineers will handle my device with care and accountability. *
                  </span>
                </label>
              </div>
              {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">🎉 You're all set! Complete verification to start requesting pickups</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleSaveForLater}
              className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Save & Complete Later
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : currentStep === 6 ? 'Complete Verification' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
