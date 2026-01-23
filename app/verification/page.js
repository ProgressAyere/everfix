'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    facePhoto: null,
    facePhotoPreview: null,
    nin: '',
    phone: '',
    otp: '',
    address: '',
    state: '',
    lga: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    yearsExperience: '',
    specialization: [],
    certifications: []
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Face Verification', icon: '👤' },
    { id: 2, title: 'NIN Verification', icon: '🆔' },
    { id: 3, title: 'Phone Verification', icon: '📱' },
    { id: 4, title: 'Address Verification', icon: '📍' },
    { id: 5, title: 'Next of Kin', icon: '👥' },
    { id: 6, title: 'Professional Details', icon: '🔧' }
  ];

  const nigerianStates = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Kaduna'];
  const specializations = ['Screen Repair', 'Battery Replacement', 'Water Damage', 'Software Issues', 'Charging Port', 'Camera Repair'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5000000) {
      setErrors({ ...errors, facePhoto: 'File size must be less than 5MB' });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, facePhoto: file, facePhotoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
    setErrors({ ...errors, facePhoto: '' });
  };

  const validateNIN = (nin) => {
    if (!/^\d{11}$/.test(nin)) {
      setErrors({ ...errors, nin: 'NIN must be exactly 11 digits' });
      return false;
    }
    setErrors({ ...errors, nin: '' });
    return true;
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

  const handleNext = () => {
    if (currentStep === 1 && !formData.facePhoto) {
      setErrors({ ...errors, facePhoto: 'Please upload your photo' });
      return;
    }
    if (currentStep === 2 && !validateNIN(formData.nin)) return;
    if (currentStep === 3 && (!otpSent || !formData.otp)) {
      setErrors({ ...errors, otp: 'Please verify your phone number' });
      return;
    }
    if (currentStep === 4 && (!formData.address || !formData.state)) {
      setErrors({ ...errors, address: 'Please complete address details' });
      return;
    }
    if (currentStep === 5 && (!formData.nextOfKinName || !formData.nextOfKinPhone)) {
      setErrors({ ...errors, nextOfKin: 'Please provide next of kin details' });
      return;
    }
    
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('engineerVerificationStatus', 'pending');
      router.push('/dashboardE');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Engineer Verification</h1>
          <p className="text-gray-600">Complete all steps to start accepting repair jobs</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
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
                  <span className="text-xs text-center hidden md:block">{step.title}</span>
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
          
          {/* Step 1: Face Verification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👤</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Face Verification</h2>
                <p className="text-gray-600">Upload a clear photo of yourself for identity verification</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">🔒 Your photo is encrypted and used only for verification purposes</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="facePhoto"
                />
                <label htmlFor="facePhoto" className="cursor-pointer">
                  {formData.facePhotoPreview ? (
                    <div>
                      <img src={formData.facePhotoPreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">{formData.facePhoto.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Click to change photo</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-400 text-4xl mb-2">📷</div>
                      <p className="text-gray-700 font-medium">Click to upload photo</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.facePhoto && <p className="text-red-500 text-sm">{errors.facePhoto}</p>}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">💡 Tips: Use good lighting, face the camera directly, remove sunglasses</p>
              </div>
            </div>
          )}

          {/* Step 2: NIN Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🆔</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">NIN Verification</h2>
                <p className="text-gray-600">Enter your National Identification Number</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">🔒 Your NIN is verified securely and never shared publicly</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National Identification Number (NIN)</label>
                <input
                  type="text"
                  maxLength="11"
                  value={formData.nin}
                  onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, '') })}
                  placeholder="12345678901"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.nin ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.nin && <p className="text-red-500 text-sm mt-1">{errors.nin}</p>}
                <p className="text-sm text-gray-500 mt-2">Enter your 11-digit NIN</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">ℹ️ Don't have your NIN? Visit <a href="https://nimc.gov.ng" target="_blank" className="text-blue-600 hover:underline">nimc.gov.ng</a> to retrieve it</p>
              </div>
            </div>
          )}

          {/* Step 3: Phone Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📱</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Verification</h2>
                <p className="text-gray-600">Verify your phone number to receive job notifications</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
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
                  {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </button>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">OTP sent to {formData.phone}</p>
                    <button onClick={handleSendOTP} className="text-sm text-blue-600 hover:underline">Resend</button>
                  </div>
                </div>
              )}
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">⏱️ OTP may take 1-2 minutes to arrive due to network delays</p>
              </div>
            </div>
          )}

          {/* Step 4: Address Verification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Verification</h2>
                <p className="text-gray-600">Provide your business or residential address</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  placeholder="Enter your full home/business address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
                  <input
                    type="text"
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    placeholder="Local Government Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📍 Map Preview</p>
              </div>
            </div>
          )}

          {/* Step 5: Next of Kin */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👥</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Next of Kin</h2>
                <p className="text-gray-600">Emergency contact for accountability and safety</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">🔒 This information is kept confidential and used only in emergencies</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.nextOfKinName}
                  onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                  placeholder="Enter next of kin name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  maxLength="11"
                  value={formData.nextOfKinPhone}
                  onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value.replace(/\D/g, '') })}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={formData.nextOfKinRelationship}
                  onChange={(e) => setFormData({ ...formData, nextOfKinRelationship: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.nextOfKin && <p className="text-red-500 text-sm">{errors.nextOfKin}</p>}
            </div>
          )}

          {/* Step 6: Professional Details */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Details</h2>
                <p className="text-gray-600">Tell us about your repair expertise</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <select
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Specializations (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {specializations.map(spec => (
                    <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, specialization: [...formData.specialization, spec] });
                          } else {
                            setFormData({ ...formData, specialization: formData.specialization.filter(s => s !== spec) });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setFormData({ ...formData, certifications: Array.from(e.target.files) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Upload certificates, training documents (PDF, JPG, PNG)</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">🎉 Almost done! Review and submit your verification</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : currentStep === 6 ? 'Submit Verification' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
