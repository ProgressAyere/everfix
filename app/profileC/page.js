'use client';
import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Edit2, CheckCircle, AlertCircle, Clock, Smartphone, History, Wallet, CreditCard, DollarSign, Star, Shield, Lock, Bell, Settings, HelpCircle, FileText, LogOut, Trash2, EyeOff, ChevronDown, ChevronUp, Plus, X, Eye, EyeOff as EyeOffIcon, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfileC() {
  const [expandedSections, setExpandedSections] = useState({});
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showEngineersModal, setShowEngineersModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newDevice, setNewDevice] = useState({ brand: '', model: '', imei: '' });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [secondaryAddress, setSecondaryAddress] = useState({ address: '', state: '', lga: '', landmark: '' });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', type: '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [activeSessions, setActiveSessions] = useState([]);
  const [notifications, setNotifications] = useState({ orders: true, promotions: false });
  
  // User data from verification
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    lga: '',
    landmark: '',
    verificationStatus: 'unverified',
    profileImageUrl: null
  });

  const nigerianStates = {
    'Abia': ['Aba North', 'Aba South', 'Arochukwu'],
    'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Surulere'],
    'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council']
  };

  useEffect(() => {
    loadUserData();
    loadPaymentMethods();
    loadTransactions();
    loadActiveSessions();
    loadNotifications();
    loadDevices();
    loadOrders();
  }, []);

  const loadUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const verificationStatus = localStorage.getItem('customerVerificationStatus');
      
      if (user.id) {
        const { data, error } = await supabase
          .from('customers_verification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setUserData({
            fullName: data.full_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            state: data.state || '',
            lga: data.lga || '',
            landmark: data.landmark || '',
            verificationStatus: data.verification_status || 'unverified',
            profileImageUrl: data.profile_image_url || null
          });
          setProfileImage(data.profile_image_url);
          if (data.secondary_address) {
            setSecondaryAddress(JSON.parse(data.secondary_address));
          }
        } else {
          setUserData(prev => ({ ...prev, email: user.email || '', verificationStatus: verificationStatus || 'unverified' }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);
        if (data) setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (data) setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
        if (data) setActiveSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('user_preferences')
          .select('notifications')
          .eq('user_id', user.id)
          .single();
        if (data?.notifications) setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadDevices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('user_devices')
          .select('*')
          .eq('user_id', user.id);
        if (data) setDevices(data);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_profile_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('customers_verification')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfileImage(publicUrl);
      setUserData(prev => ({ ...prev, profileImageUrl: publicUrl }));
      setShowImageUpload(false);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getVerificationBadge = () => {
    if (userData.verificationStatus === 'verified') {
      return (
        <div className="mt-2 inline-flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          <CheckCircle size={12} />
          <span>Verified Customer</span>
        </div>
      );
    } else if (userData.verificationStatus === 'pending') {
      return (
        <div className="mt-2 inline-flex items-center gap-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          <Clock size={12} />
          <span>Verification Pending</span>
        </div>
      );
    } else {
      return (
        <div className="mt-2 inline-flex items-center gap-1 bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
          <AlertCircle size={12} />
          <span>Not Verified</span>
        </div>
      );
    }
  };

  const handleSaveSecondaryAddress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { error } = await supabase
        .from('customers_verification')
        .update({ secondary_address: JSON.stringify(secondaryAddress) })
        .eq('user_id', user.id);
      if (!error) setShowAddressModal(false);
    } catch (error) {
      console.error('Error saving secondary address:', error);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          card_last4: newCard.number.slice(-4),
          card_type: newCard.type,
          expiry: newCard.expiry,
          is_default: paymentMethods.length === 0
        })
        .select();
      if (!error && data) {
        setPaymentMethods([...paymentMethods, data[0]]);
        setNewCard({ number: '', expiry: '', cvv: '', type: '' });
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new });
      if (!error) {
        setPasswordData({ current: '', new: '', confirm: '' });
        setShowPasswordModal(false);
        alert('Password changed successfully');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await supabase.from('user_sessions').update({ is_active: false }).eq('id', sessionId);
      loadActiveSessions();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await supabase.from('user_preferences').upsert({ user_id: user.id, notifications });
      setShowNotificationModal(false);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 30);
      
      await supabase.from('users').update({ 
        is_deactivated: true, 
        deactivation_date: new Date().toISOString(),
        scheduled_deletion_date: deletionDate.toISOString()
      }).eq('id', user.id);
      
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleAddDevice = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { data, error } = await supabase
        .from('user_devices')
        .insert({
          user_id: user.id,
          brand: newDevice.brand,
          model: newDevice.model,
          imei: newDevice.imei,
          status: 'active'
        })
        .select();
      if (!error && data) {
        setDevices([...devices, data[0]]);
        setNewDevice({ brand: '', model: '', imei: '' });
        setShowDeviceModal(false);
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg mt-[65]">
        <div className="flex items-start gap-4">
          <div className="relative">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {getInitials(userData.fullName)}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
              id="profileImageInput"
            />
            <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600">
              <Camera size={14} />
            </label>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{userData.fullName || 'User'}</h1>
              {userData.verificationStatus === 'verified' && <CheckCircle size={18} className="text-green-400" />}
            </div>
            {/* <p className="text-blue-100 text-sm">ID: CUST-2024-1234</p> */} {/* Mock data - commented */}
            {getVerificationBadge()}
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
                  <p className="text-sm font-medium">{userData.phone || 'Not provided'}</p>
                  {/* <p className="text-sm font-medium">+234 801 234 5678</p> */} {/* Mock data */}
                  {userData.phone && <CheckCircle size={14} className="text-green-500" />}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{userData.email || 'Not provided'}</p>
                  {/* <p className="text-sm font-medium">john.doe@email.com</p> */} {/* Mock data */}
                  {userData.email && <CheckCircle size={14} className="text-green-500" />}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={18} className="text-gray-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Primary Address</p>
                  {userData.address && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>}
                </div>
                <p className="text-sm font-medium">
                  {userData.address ? 
                    `${userData.address}${userData.landmark ? ', ' + userData.landmark : ''}${userData.lga ? ', ' + userData.lga : ''}${userData.state ? ', ' + userData.state : ''}` 
                    : 'Not provided'}
                </p>
                {/* <p className="text-sm font-medium">15 Admiralty Way, Lekki Phase 1, Lagos</p> */} {/* Mock data */}
              </div>
            </div>

            {secondaryAddress.address && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin size={18} className="text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Secondary Address</p>
                  </div>
                  <p className="text-sm font-medium">
                    {`${secondaryAddress.address}${secondaryAddress.landmark ? ', ' + secondaryAddress.landmark : ''}${secondaryAddress.lga ? ', ' + secondaryAddress.lga : ''}${secondaryAddress.state ? ', ' + secondaryAddress.state : ''}`}
                  </p>
                </div>
              </div>
            )}

            <button onClick={() => setShowAddressModal(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 text-sm font-medium py-2 border border-blue-200 rounded-lg">
              <Plus size={16} />
              {secondaryAddress.address ? 'Edit Secondary Address' : 'Add Secondary Address'}
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
            <button onClick={() => setShowDeviceModal(true)} className="text-blue-600 text-sm font-medium">Add Device</button>
          </div>

          <div className="space-y-3">
            {devices.length > 0 ? devices.map((device) => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{device.brand} {device.model}</p>
                    <p className="text-xs text-gray-500">IMEI: {device.imei}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    device.status === 'in_repair' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>{device.status === 'in_repair' ? 'In Repair' : 'Active'}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                  <span>{device.repair_count || 0} repairs</span>
                  {device.last_repair_date && (
                    <>
                      <span>â€¢</span>
                      <span>Last: {new Date(device.last_repair_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No devices added yet</p>
            )}
          </div>
        </div>

        {/* Order and Repair History */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Order & Repair History</h2>
            </div>
            <button onClick={() => setShowOrderHistoryModal(true)} className="text-blue-600 text-sm font-medium">View All</button>
          </div>

          <div className="space-y-3">
            {orders.length > 0 ? orders.slice(0, 2).map((order) => (
              <div key={order.id} className={`border-l-4 rounded-r-lg p-3 ${
                order.status === 'ongoing' ? 'border-purple-500 bg-purple-50' :
                order.status === 'completed' ? 'border-green-500 bg-green-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{order.service_type}</p>
                    <p className="text-xs text-gray-500">Order #{order.order_number}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'ongoing' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status === 'ongoing' ? 'Ongoing' : order.status === 'completed' ? 'Completed' : order.status}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{order.device_info}{order.engineer_name ? ` â€¢ Engineer: ${order.engineer_name}` : ''}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                  <button className="text-blue-600 font-medium">{order.status === 'ongoing' ? 'Track' : 'View Details'}</button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
            )}
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

          {/* <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 mb-3">
            <p className="text-xs text-blue-100 mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold">â‚¦12,500.00</p>
            <button className="mt-3 bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg">
              Top Up
            </button>
          </div> */} {/* Mock data */}

          <div className="space-y-2 mb-3">
            {paymentMethods.map((method, index) => (
              <div key={method.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{method.card_type} â€¢â€¢â€¢â€¢ {method.card_last4}</p>
                    <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                {method.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>}
              </div>
            ))}

            <button onClick={() => setShowPaymentModal(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 text-sm font-medium py-2 bg-white border border-blue-200 rounded-lg">
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
                {transactions.length > 0 ? transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-medium ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                      {txn.type === 'debit' ? '-' : '+'}â‚¦{txn.amount.toLocaleString()}
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-2">No transactions yet</p>
                )}
              </div>
            )}
          </div>

          {/* <p className="text-xs text-gray-500 mt-3">Last updated: Jan 20, 2024 at 3:45 PM</p> */} {/* Mock data */}
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold">Ratings & Reviews</h2>
            </div>
          </div>

          {/* <div className="grid grid-cols-3 gap-3 mb-4">
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
          </div> */} {/* Mock data */}

          <p className="text-sm text-gray-500 text-center py-4">Complete orders to leave reviews</p>

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

            <button onClick={() => toggleSection('sessions')} className="w-full flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              {expandedSections.sessions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedSections.sessions && (
              <div className="bg-white rounded-lg p-3 space-y-2">
                {activeSessions.length > 0 ? activeSessions.map((session) => (
                  <div key={session.id} className="flex items-start justify-between text-sm">
                    <div>
                      <p className="font-medium">{session.device_name} â€¢ {session.browser}</p>
                      <p className="text-xs text-gray-500">{session.location}{session.is_current ? ' â€¢ Current' : ''}</p>
                      <p className="text-xs text-gray-400">Last active: {new Date(session.last_active).toLocaleString()}</p>
                    </div>
                    {!session.is_current && (
                      <button onClick={() => handleEndSession(session.id)} className="text-red-600 text-xs font-medium">End</button>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-2">No active sessions</p>
                )}
              </div>
            )}
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
            <button onClick={() => setShowNotificationModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Notification Settings</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button onClick={() => setShowEngineersModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Preferred Engineers</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button onClick={() => setShowDeliveryModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Customer Support</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button onClick={() => setShowDisputeModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Report a Dispute</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button onClick={() => setShowWarrantyModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Warranties & Claims</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button onClick={() => setShowEmergencyModal(true)} className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
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

            <button onClick={() => setShowDeleteAccountModal(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg font-medium border border-red-200">
              <Trash2 size={18} />
              <span>Delete Account</span>
            </button>
          </div>

          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">Deleting your account will deactivate it for 30 days. You can reactivate by logging in within this period. After 30 days, all data will be permanently deleted.</p>
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
              <button onClick={handleLogout} className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-medium">Log Out</button>
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
            <p className="text-sm text-gray-600 mb-4">Your account will be deactivated for 30 days. You can reactivate by logging in within this period. After 30 days, all data will be permanently deleted.</p>
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
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Secondary Address</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address</label>
                <textarea
                  value={secondaryAddress.address}
                  onChange={(e) => setSecondaryAddress({...secondaryAddress, address: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                  <select
                    value={secondaryAddress.state}
                    onChange={(e) => setSecondaryAddress({...secondaryAddress, state: e.target.value, lga: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select</option>
                    {Object.keys(nigerianStates).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">LGA</label>
                  <select
                    value={secondaryAddress.lga}
                    onChange={(e) => setSecondaryAddress({...secondaryAddress, lga: e.target.value})}
                    disabled={!secondaryAddress.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                  >
                    <option value="">Select</option>
                    {secondaryAddress.state && nigerianStates[secondaryAddress.state]?.map(lga => (
                      <option key={lga} value={lga}>{lga}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Landmark</label>
                <input
                  type="text"
                  value={secondaryAddress.landmark}
                  onChange={(e) => setSecondaryAddress({...secondaryAddress, landmark: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAddressModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleSaveSecondaryAddress} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add Payment Method</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Card Type</label>
                <select
                  value={newCard.type}
                  onChange={(e) => setNewCard({...newCard, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select card type</option>
                  <option value="VERVE">VERVE</option>
                  <option value="VISA">VISA</option>
                  <option value="MASTERCARD">MASTERCARD</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
                <input
                  type="text"
                  maxLength="16"
                  value={newCard.number}
                  onChange={(e) => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1234567890123456"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength="5"
                    value={newCard.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                      setNewCard({...newCard, expiry: val});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                  <input
                    type="text"
                    maxLength="3"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowPaymentModal(false); setNewCard({ number: '', expiry: '', cvv: '', type: '' }); }} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleAddPaymentMethod} disabled={!newCard.type || !newCard.number || !newCard.expiry || !newCard.cvv} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">Add Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowPasswordModal(false); setPasswordData({ current: '', new: '', confirm: '' }); }} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleChangePassword} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium">Change Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Order Updates</span>
                <button onClick={() => setNotifications({...notifications, orders: !notifications.orders})} className={`w-12 h-6 rounded-full flex items-center px-1 ${notifications.orders ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.orders ? 'ml-auto' : ''}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Promotions</span>
                <button onClick={() => setNotifications({...notifications, promotions: !notifications.promotions})} className={`w-12 h-6 rounded-full flex items-center px-1 ${notifications.promotions ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.promotions ? 'ml-auto' : ''}`}></div>
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNotificationModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleUpdateNotifications} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Preferred Engineers Modal */}
      {showEngineersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Preferred Engineers</h3>
            <p className="text-sm text-gray-600 mb-4">Manage your list of preferred engineers for future repairs.</p>
            <p className="text-sm text-gray-500 text-center py-8">No preferred engineers yet</p>
            <button onClick={() => setShowEngineersModal(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}

      {/* Delivery Windows Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delivery Windows</h3>
            <p className="text-sm text-gray-600 mb-4">Set your preferred delivery time windows.</p>
            <p className="text-sm text-gray-500 text-center py-8">Feature coming soon</p>
            <button onClick={() => setShowDeliveryModal(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}

      {/* Customer Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Customer Support</h3>
            <div className="space-y-3">
              <a href="tel:+2348012345678" className="block p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Call Support</p>
                <p className="text-xs text-gray-500">+234 801 234 5678</p>
              </a>
              <a href="mailto:support@phonefix.com" className="block p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Email Support</p>
                <p className="text-xs text-gray-500">support@phonefix.com</p>
              </a>
            </div>
            <button onClick={() => setShowSupportModal(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Report Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Report a Dispute</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Order ID</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="ORD-2024-XXXX" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Issue Description</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Describe the issue..."></textarea>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDisputeModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Warranties Modal */}
      {showWarrantyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Warranties & Claims</h3>
            <p className="text-sm text-gray-600 mb-4">View and manage your repair warranties.</p>
            <p className="text-sm text-gray-500 text-center py-8">No active warranties</p>
            <button onClick={() => setShowWarrantyModal(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}

      {/* Emergency Assistance Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-red-600" />
              <h3 className="text-lg font-bold text-red-600">Emergency Assistance</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">For urgent issues, contact our emergency hotline:</p>
            <a href="tel:+2347049490588" className="block p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-lg font-bold text-red-600">+234 704 949 0588</p>
              <p className="text-xs text-gray-500 mt-1">24/7 Emergency Line</p>
            </a>
            <button onClick={() => setShowEmergencyModal(false)} className="w-full py-2 bg-gray-600 text-white rounded-lg font-medium mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add Device</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Device Brand</label>
                <input
                  type="text"
                  value={newDevice.brand}
                  onChange={(e) => setNewDevice({...newDevice, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Apple, Samsung"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Device Model</label>
                <input
                  type="text"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., iPhone 14, Galaxy S23"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">IMEI Number (Optional)</label>
                <input
                  type="text"
                  value={newDevice.imei}
                  onChange={(e) => setNewDevice({...newDevice, imei: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="15-digit IMEI"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowDeviceModal(false); setNewDevice({ brand: '', model: '', imei: '' }); }} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleAddDevice} disabled={!newDevice.brand || !newDevice.model} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">Add Device</button>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Order History</h3>
              <button onClick={() => setShowOrderHistoryModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className={`border-l-4 rounded-r-lg p-3 ${
                  order.status === 'ongoing' ? 'border-purple-500 bg-purple-50' :
                  order.status === 'completed' ? 'border-green-500 bg-green-50' :
                  'border-gray-500 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{order.service_type}</p>
                      <p className="text-xs text-gray-500">Order #{order.order_number}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'ongoing' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{order.status === 'ongoing' ? 'Ongoing' : order.status === 'completed' ? 'Completed' : order.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{order.device_info}{order.engineer_name ? ` â€¢ Engineer: ${order.engineer_name}` : ''}</p>
                  {order.amount && <p className="text-xs text-gray-600 mb-2">Amount: â‚¦{order.amount.toLocaleString()}</p>}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    <button className="text-blue-600 font-medium">{order.status === 'ongoing' ? 'Track' : 'View Details'}</button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



