'use client';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, Camera, Upload, Phone, Mail, MapPin, Bike, Users, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 1, title: 'Identity Verification', icon: FileText },
  { id: 2, title: 'Contact Information', icon: Phone },
  { id: 3, title: 'Address Verification', icon: MapPin },
  { id: 4, title: 'Vehicle & Equipment', icon: Bike },
  { id: 5, title: 'Background & Trust', icon: Users },
  { id: 6, title: 'Compliance & Agreement', icon: FileText }
];

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  notStarted: { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' }
};

export default function RiderVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    idUpload: null,
    facePhoto: null,
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    otp: '',
    email: '',
    address: '',
    landmark: '',
    utilityBill: null,
    vehicleType: '',
    vehiclePhotos: [],
    registration: '',
    helmet: false,
    deliveryBag: false,
    nextOfKinName: '',
    nextOfKinPhone: '',
    emergencyContact: '',
    backgroundConsent: false,
    termsAccepted: false
  });
  const [sectionStatus, setSectionStatus] = useState({
    1: 'notStarted',
    2: 'notStarted',
    3: 'notStarted',
    4: 'notStarted',
    5: 'notStarted',
    6: 'notStarted'
  });

  const handleFileUpload = (field, file) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleNext = () => {
    setSectionStatus({ ...sectionStatus, [currentStep]: 'completed' });
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Under Review</h1>
          <p className="text-gray-600 mb-6">
            Your verification documents have been submitted successfully. Our team will review your application within 24-48 hours.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              You'll receive an email and SMS notification once your verification is complete.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/dashboardR"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/support"
              className="block w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentStep / 6) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboardR" className="w-10 h-10 flex items-center justify-center -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Rider Verification</h1>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Step {currentStep} of 6</span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Complete verification to ensure platform safety and start accepting delivery jobs.
          </p>
        </div>
      </div>

      <div className="pt-40 px-4 pb-6 space-y-4">
        
        {/* Step 1: Identity Verification */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Government ID Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('idUpload', e.target.files[0])}
                      className="hidden"
                      id="idUpload"
                    />
                    <label htmlFor="idUpload" className="cursor-pointer">
                      {formData.idUpload ? (
                        <div>
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-900">{formData.idUpload.name}</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-900">Upload ID Card</p>
                          <p className="text-xs text-gray-500 mt-1">NIN, Driver's License, or Passport (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">📌 ID must be clear, unfolded, and show all four corners</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Live Facial Verification</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload('facePhoto', e.target.files[0])}
                      className="hidden"
                      id="facePhoto"
                    />
                    <label htmlFor="facePhoto" className="cursor-pointer">
                      {formData.facePhoto ? (
                        <div>
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-900">Photo Captured</p>
                        </div>
                      ) : (
                        <div>
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-900">Take Selfie</p>
                          <p className="text-xs text-gray-500 mt-1">Face camera directly in good lighting</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name as on ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.idUpload || !formData.facePhoto || !formData.fullName}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Continue to Step 2
            </button>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08012345678"
                    maxLength="11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Verification</label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="text-sm text-blue-600 font-semibold mt-2">Send OTP</button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.phone || !formData.email}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Address Verification */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Address Verification</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Residential Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your full residential address"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nearest Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g., Near Shoprite, Opposite Police Station"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Utility Bill (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('utilityBill', e.target.files[0])}
                      className="hidden"
                      id="utilityBill"
                    />
                    <label htmlFor="utilityBill" className="cursor-pointer">
                      {formData.utilityBill ? (
                        <p className="text-sm font-semibold text-green-600">✓ {formData.utilityBill.name}</p>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">Upload utility bill</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(2)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold">Back</button>
              <button onClick={handleNext} disabled={!formData.address} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-300">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Vehicle & Equipment */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <Bike className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Vehicle & Equipment</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mode of Transport</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select vehicle type</option>
                    <option value="bike">Bicycle</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Registration Number</label>
                  <input
                    type="text"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    placeholder="e.g., LAG-123-XY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Safety Equipment</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.helmet}
                        onChange={(e) => setFormData({ ...formData, helmet: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-semibold text-gray-900">I have a safety helmet</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.deliveryBag}
                        onChange={(e) => setFormData({ ...formData, deliveryBag: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-semibold text-gray-900">I have a delivery bag</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(3)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold">Back</button>
              <button onClick={handleNext} disabled={!formData.vehicleType} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-300">Continue</button>
            </div>
          </div>
        )}

        {/* Step 5: Background & Trust */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Background & Trust</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Next of Kin Name</label>
                  <input
                    type="text"
                    value={formData.nextOfKinName}
                    onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                    placeholder="Enter next of kin full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Next of Kin Phone</label>
                  <input
                    type="tel"
                    value={formData.nextOfKinPhone}
                    onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                    placeholder="08012345678"
                    maxLength="11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="08012345678"
                    maxLength="11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.backgroundConsent}
                      onChange={(e) => setFormData({ ...formData, backgroundConsent: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to a background check for platform safety and trust verification
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(4)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold">Back</button>
              <button onClick={handleNext} disabled={!formData.backgroundConsent} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-300">Continue</button>
            </div>
          </div>
        )}

        {/* Step 6: Compliance & Agreement */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Compliance & Agreement</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-xl p-4 h-64 overflow-y-auto bg-gray-50">
                  <h3 className="font-bold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    By accepting these terms, you agree to:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                    <li>Provide safe and professional delivery services</li>
                    <li>Maintain vehicle and equipment in good condition</li>
                    <li>Follow all traffic laws and safety guidelines</li>
                    <li>Treat customers and engineers with respect</li>
                    <li>Protect customer privacy and device security</li>
                    <li>Accept platform commission structure (15%)</li>
                    <li>Report any incidents or issues immediately</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the Terms & Conditions, Delivery Guidelines, Safety Rules, and Code of Conduct
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-800">
                    🔒 Your data is encrypted and protected. We never share your personal information without consent.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(5)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold">Back</button>
              <button onClick={handleSubmit} disabled={!formData.termsAccepted} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:bg-gray-300">Submit Verification</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
