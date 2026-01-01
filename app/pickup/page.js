'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const nigerianStates = {
  'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South'],
  'Adamawa': ['Demsa', 'Fufure', 'Ganye', 'Gombi', 'Hong', 'Jada', 'Yola North', 'Yola South'],
  'Akwa Ibom': ['Abak', 'Eket', 'Essien Udim', 'Etinan', 'Ikot Ekpene', 'Uyo'],
  'Anambra': ['Aguata', 'Awka North', 'Awka South', 'Ihiala', 'Onitsha North', 'Onitsha South'],
  'Bauchi': ['Bauchi', 'Darazo', 'Gamawa', 'Katagum', 'Misau', 'Ningi'],
  'Bayelsa': ['Brass', 'Ekeremor', 'Nembe', 'Ogbia', 'Sagbama', 'Yenagoa'],
  'Benue': ['Ado', 'Gboko', 'Makurdi', 'Oturkpo', 'Vandeikya'],
  'Borno': ['Bama', 'Biu', 'Gwoza', 'Jere', 'Maiduguri'],
  'Cross River': ['Abi', 'Calabar Municipal', 'Calabar South', 'Ikom', 'Ogoja'],
  'Delta': ['Aniocha North', 'Bomadi', 'Ethiope East', 'Sapele', 'Warri North', 'Warri South'],
  'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ikwo', 'Onicha'],
  'Edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Ikpoba Okha', 'Oredo', 'Ovia North-East'],
  'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ikere', 'Oye'],
  'Enugu': ['Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Nsukka', 'Udi'],
  'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  'Gombe': ['Akko', 'Balanga', 'Billiri', 'Gombe', 'Kaltungo'],
  'Imo': ['Aboh Mbaise', 'Ideato North', 'Ihitte/Uboma', 'Mbaitoli', 'Okigwe', 'Orlu', 'Owerri Municipal'],
  'Jigawa': ['Dutse', 'Gumel', 'Hadejia', 'Kazaure', 'Ringim'],
  'Kaduna': ['Chikun', 'Giwa', 'Igabi', 'Kaduna North', 'Kaduna South', 'Zaria'],
  'Kano': ['Dala', 'Fagge', 'Gwale', 'Kano Municipal', 'Tarauni', 'Ungogo'],
  'Katsina': ['Daura', 'Dutsin Ma', 'Funtua', 'Katsina', 'Malumfashi'],
  'Kebbi': ['Argungu', 'Birnin Kebbi', 'Jega', 'Yauri', 'Zuru'],
  'Kogi': ['Adavi', 'Ankpa', 'Dekina', 'Idah', 'Lokoja', 'Okene'],
  'Kwara': ['Asa', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Offa'],
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  'Nasarawa': ['Akwanga', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa'],
  'Niger': ['Bida', 'Chanchaga', 'Kontagora', 'Lapai', 'Suleja'],
  'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ifo', 'Ijebu Ode', 'Shagamu'],
  'Ondo': ['Akure North', 'Akure South', 'Idanre', 'Okitipupa', 'Ondo East', 'Owo'],
  'Osun': ['Ede North', 'Ede South', 'Ife Central', 'Ilesa East', 'Iwo', 'Osogbo'],
  'Oyo': ['Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan South-East', 'Ogbomosho North', 'Oyo East'],
  'Plateau': ['Barkin Ladi', 'Jos East', 'Jos North', 'Jos South', 'Pankshin'],
  'Rivers': ['Ahoada East', 'Bonny', 'Degema', 'Eleme', 'Ikwerre', 'Obio/Akpor', 'Port Harcourt'],
  'Sokoto': ['Binji', 'Bodinga', 'Sokoto North', 'Sokoto South', 'Wamako'],
  'Taraba': ['Bali', 'Jalingo', 'Takum', 'Wukari', 'Zing'],
  'Yobe': ['Damaturu', 'Fika', 'Geidam', 'Nguru', 'Potiskum'],
  'Zamfara': ['Anka', 'Gusau', 'Kaura Namoda', 'Maru', 'Zurmi']
};

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

const validColors = [
  'Black', 'White', 'Silver', 'Gray', 'Grey', 'Space Gray', 'Space Grey',
  'Gold', 'Rose Gold', 'Pink', 'Red', 'Blue', 'Navy', 'Sky Blue', 'Midnight Blue',
  'Green', 'Midnight Green', 'Alpine Green', 'Purple', 'Violet', 'Yellow',
  'Orange', 'Bronze', 'Copper', 'Titanium', 'Graphite', 'Starlight',
  'Midnight', 'Phantom Black', 'Phantom Silver', 'Phantom White',
  'Mystic Bronze', 'Mystic Black', 'Cloud Navy', 'Awesome Black',
  'Awesome White', 'Awesome Blue', 'Pearl White', 'Ceramic White',
  'Matte Black', 'Glossy Black', 'Jet Black', 'Deep Purple', 'Sierra Blue',
  'Pacific Blue', 'Coral', 'Lavender', 'Mint', 'Cream', 'Beige', 'Brown'
];

export default function PickupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deviceType: 'phone',
    brand: '',
    model: '',
    problem: '',
    condition: '',
    color: '',
    description: '',
    otherInfo: ''
  });
  const [location, setLocation] = useState({ state: '', lga: '' });
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isLgaDropdownOpen, setIsLgaDropdownOpen] = useState(false);
  const [stateError, setStateError] = useState('');
  const [colorError, setColorError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stateDropdownRef = useRef(null);
  const lgaDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
      if (lgaDropdownRef.current && !lgaDropdownRef.current.contains(event.target)) {
        setIsLgaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedRequest = localStorage.getItem('pickupRequest');
    if (savedRequest) {
      const { formData: savedFormData, location: savedLocation } = JSON.parse(savedRequest);
      setFormData(savedFormData);
      setLocation(savedLocation);
      setStep(2);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' && { model: '' }),
      ...(name === 'deviceType' && { brand: '', model: '', problem: '' })
    }));
    if (name === 'color') setColorError('');
  };

  const validateColor = () => {
    if (formData.color && !validColors.some(c => c.toLowerCase() === formData.color.trim().toLowerCase())) {
      setColorError('The color code is incorrect, please choose a specific color');
      return false;
    }
    return true;
  };

  const handleStateSearch = (value) => {
    setLocation(prev => ({ ...prev, state: value, lga: '' }));
    setStateError('');
    setIsStateDropdownOpen(true);
  };

  const handleStateSelect = (state) => {
    setLocation(prev => ({ ...prev, state, lga: '' }));
    setIsStateDropdownOpen(false);
    setStateError('');
  };

  const handleLgaSelect = (lga) => {
    setLocation(prev => ({ ...prev, lga }));
    setIsLgaDropdownOpen(false);
  };

  const validateState = () => {
    if (location.state && !Object.keys(nigerianStates).includes(location.state)) {
      setStateError('Please select a valid Nigerian state');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateState() || !location.lga) {
      if (!location.lga) setStateError('Please select a local government area');
      return;
    }
    
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (!isLoggedIn) {
      localStorage.setItem('pickupRequest', JSON.stringify({ formData, location }));
      localStorage.setItem('redirectAfterLogin', '/pickup');
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('pickupRequest', JSON.stringify({ formData, location }));
      router.push('/confirmation');
    }, 1500);
  };

  const filteredStates = location.state.trim()
    ? Object.keys(nigerianStates).filter(state => state.toLowerCase().includes(location.state.toLowerCase()))
    : Object.keys(nigerianStates);
  
  const availableLgas = location.state && nigerianStates[location.state] ? nigerianStates[location.state] : [];
  const currentDevice = deviceData[formData.deviceType];
  const availableModels = formData.brand ? currentDevice.models[formData.brand] || [] : [];
  const isLocationValid = location.state && location.lga && Object.keys(nigerianStates).includes(location.state);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Request Pickup</h1>
          <p className="text-gray-600 mt-1">Fill in your device details and location</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>1</div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>2</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Device Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'deviceType', value: 'phone' } })}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.deviceType === 'phone' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Phone</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'deviceType', value: 'laptop' } })}
                    className={`p-4 border-2 rounded-lg transition ${
                      formData.deviceType === 'laptop' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Laptop</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select brand</option>
                  {currentDevice.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Type</label>
                <select
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select problem</option>
                  {currentDevice.problems.map(problem => (
                    <option key={problem} value={problem}>{problem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  disabled={!formData.brand}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select model</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition/Age</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2 years old, good condition"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Black, Silver, Blue"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    colorError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {colorError && <p className="text-red-500 text-sm mt-1">{colorError}</p>}
              </div>

              {formData.problem === 'Others' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Please describe the issue in detail"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Information (Optional)</label>
                <textarea
                  name="otherInfo"
                  value={formData.otherInfo}
                  onChange={handleChange}
                  rows="2"
                  placeholder="none if no necessary information needed"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (validateColor()) setStep(2);
                }}
                disabled={!formData.brand || !formData.model || !formData.problem || !formData.condition || !formData.color || (formData.problem === 'Others' && !formData.description)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Location
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Location</h2>

              <div className="relative" ref={stateDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) => handleStateSearch(e.target.value)}
                  onFocus={() => setIsStateDropdownOpen(true)}
                  placeholder="Search Nigerian states..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    stateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {stateError && <p className="text-red-500 text-sm mt-1">{stateError}</p>}
                {isStateDropdownOpen && filteredStates.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10 shadow-lg">
                    {filteredStates.map(state => (
                      <div
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {location.state && nigerianStates[location.state] && (
                <div className="relative" ref={lgaDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local Government Area</label>
                  <input
                    type="text"
                    value={location.lga}
                    onFocus={() => setIsLgaDropdownOpen(true)}
                    readOnly
                    placeholder="Select LGA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  {isLgaDropdownOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10 shadow-lg">
                      {availableLgas.map(lga => (
                        <div
                          key={lga}
                          onClick={() => handleLgaSelect(lga)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {lga}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {location.state && location.lga && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ Location selected: {location.lga}, {location.state}</p>
                </div>
              )}

              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 text-sm">Map preview</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isLocationValid || isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
