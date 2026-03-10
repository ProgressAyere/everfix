'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCircle, Smartphone, MapPin, Users, Lock, Camera, Shield, PartyPopper, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CustomerVerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    livePhoto: null,
    livePhotoPreview: null,
    identityCardType: '',
    ninFront: null,
    ninFrontPreview: null,
    ninBack: null,
    ninBackPreview: null,
    nin: '',
    pvcFront: null,
    pvcFrontPreview: null,
    pvcBack: null,
    pvcBackPreview: null,
    passportFront: null,
    passportFrontPreview: null,
    passportBack: null,
    passportBackPreview: null,
    passportNumber: '',
    driverLicenseFront: null,
    driverLicenseFrontPreview: null,
    driverLicenseBack: null,
    driverLicenseBackPreview: null,
    driverLicenseNumber: '',
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
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const accessToken = localStorage.getItem('accessToken');
        
        // Set email from user data
        if (userData.email) {
          setFormData(prev => ({ ...prev, email: userData.email }));
        } else if (accessToken) {
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            setFormData(prev => ({ ...prev, email: userEmail }));
          }
        }

        // Check verification status
        if (userData.id) {
          const { data, error } = await supabase
            .from('customers_verification')
            .select('verification_status')
            .eq('user_id', userData.id)
            .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no record exists
          
          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking verification:', error);
          } else if (data) {
            setVerificationStatus(data.verification_status);
          }
        }
      } catch (error) {
        console.error('Error initializing component:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        // Add proper headers for Supabase API calls
        const { data, error } = await supabase
          .from('customers_verification')
          .select('verification_status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking verification:', error);
          // If there's an authentication error, the user might need to log in again
          if (error.code === '401' || error.message?.includes('JWT')) {
            console.warn('Authentication issue detected, user may need to re-login');
          }
        } else if (data) {
          setVerificationStatus(data.verification_status);
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (verificationStatus === 'approved' || verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">KYC Verified</h1>
          <p className="text-gray-600 mb-6">Your account has been successfully verified</p>
          <Link
            href="/dashboardC"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }



  const steps = [
    { id: 1, title: 'Basic Identity', icon: UserCircle, required: true },
    { id: 2, title: 'Phone Verification', icon: Smartphone, required: true },
    { id: 3, title: 'Pickup Address', icon: MapPin, required: true },
    { id: 4, title: 'Device Info', icon: Smartphone, required: false },
    { id: 5, title: 'Emergency Contact', icon: Users, required: false },
    { id: 6, title: 'Security & Consent', icon: Lock, required: true }
  ];

  const nigerianStates = {
    'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
    'Adamawa': ['Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Larmurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
    'Akwa Ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
    'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
    'Bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
    'Bayelsa': ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
    'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Oturkpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
    'Borno': ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
    'Cross River': ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
    'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
    'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
    'Edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Orhionmwon', 'Oredo', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
    'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
    'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'],
    'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
    'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
    'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West', 'Unuimo'],
    'Jigawa': ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Kaugama', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
    'Kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
    'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
    'Katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dandume', 'Danja', 'Dan Musa', 'Daura', 'Dutsi', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
    'Kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
    'Kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
    'Kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
    'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
    'Nasarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'],
    'Niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
    'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu'],
    'Ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-West', 'Akoko South-East', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
    'Osun': ['Atakunmosa East', 'Atakunmosa West', 'Aiyedaade', 'Aiyedire', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Egbedore', 'Ejigbo', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
    'Oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
    'Plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
    'Rivers': ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
    'Sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
    'Taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kumi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
    'Yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
    'Zamfara': ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Chafe', 'Zurmi']
  };

  const handleFileChange = (e, fieldName, previewName) => {
    const file = e.target.files[0];
    if (file && file.size > 1048576) {
      setErrors({ ...errors, [fieldName]: 'File size must be less than 1MB' });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [fieldName]: file, [previewName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
    setErrors({ ...errors, [fieldName]: '' });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      setShowCamera(true);
      setTimeout(() => {
        const video = document.getElementById('cameraVideo');
        if (video) video.srcObject = mediaStream;
      }, 100);
    } catch (error) {
      setErrors({ ...errors, livePhoto: 'Camera access denied' });
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('cameraVideo');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'live-photo.jpg', { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, livePhoto: file, livePhotoPreview: reader.result });
        stopCamera();
      };
      reader.readAsDataURL(file);
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
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
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email) {
        setErrors({ ...errors, identity: 'Please complete all required fields' });
        return;
      }
      if (!formData.livePhoto) {
        setErrors({ ...errors, livePhoto: 'Live photo is required' });
        return;
      }
      if (!formData.identityCardType) {
        setErrors({ ...errors, identity: 'Please select an identity card type' });
        return;
      }
    }
    if (currentStep === 2 && !formData.phone) {
      setErrors({ ...errors, phone: 'Please enter your phone number' });
      return;
    }
    if (currentStep === 3 && (!formData.address || !formData.state)) {
      setErrors({ ...errors, address: 'Please complete address details' });
      return;
    }
    if (currentStep === 5 && (!formData.emergencyName || !formData.emergencyPhone || !formData.emergencyRelationship)) {
      setErrors({ ...errors, emergency: 'Please complete all emergency contact fields' });
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

  const handleSaveForLater = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Upload any existing images
      const uploadImage = async (file, path) => {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userData.id || 'user'}_${path}_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('verification-documents')
          .upload(fileName, file);
        if (error) return null;
        return supabase.storage.from('verification-documents').getPublicUrl(fileName).data.publicUrl;
      };

      const livePhotoUrl = await uploadImage(formData.livePhoto, 'live_photo');
      const ninFrontUrl = await uploadImage(formData.ninFront, 'nin_front');
      const ninBackUrl = await uploadImage(formData.ninBack, 'nin_back');

      // Upsert partial data to Supabase
      await supabase
        .from('customers_verification')
        .upsert({
          user_id: userData.id,
          full_name: formData.fullName || null,
          email: formData.email || null,
          live_photo_url: livePhotoUrl,
          identity_card_type: formData.identityCardType || null,
          nin_front_url: ninFrontUrl,
          nin_back_url: ninBackUrl,
          nin_number: formData.nin || null,
          phone: formData.phone || null,
          address: formData.address || null,
          state: formData.state || null,
          lga: formData.lga || null,
          landmark: formData.landmark || null,
          device_brand: formData.deviceBrand || null,
          device_model: formData.deviceModel || null,
          emergency_name: formData.emergencyName || null,
          emergency_phone: formData.emergencyPhone || null,
          emergency_relationship: formData.emergencyRelationship || null,
          verification_status: 'partial'
        }, { onConflict: 'user_id' });

      localStorage.setItem('customerVerificationData', JSON.stringify(formData));
      localStorage.setItem('customerVerificationStatus', 'partial');
      router.push('/dashboardC');
    } catch (error) {
      console.error('Error saving verification:', error);
      // Fallback to localStorage only
      localStorage.setItem('customerVerificationData', JSON.stringify(formData));
      localStorage.setItem('customerVerificationStatus', 'partial');
      router.push('/dashboardC');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Upload images to Supabase Storage
      const uploadImage = async (file, path) => {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userData.id || 'user'}_${path}_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('verification-documents')
          .upload(fileName, file);
        if (error) throw error;
        return supabase.storage.from('verification-documents').getPublicUrl(fileName).data.publicUrl;
      };

      const livePhotoUrl = await uploadImage(formData.livePhoto, 'live_photo');
      const ninFrontUrl = await uploadImage(formData.ninFront, 'nin_front');
      const ninBackUrl = await uploadImage(formData.ninBack, 'nin_back');
      const pvcFrontUrl = await uploadImage(formData.pvcFront, 'pvc_front');
      const pvcBackUrl = await uploadImage(formData.pvcBack, 'pvc_back');
      const passportFrontUrl = await uploadImage(formData.passportFront, 'passport_front');
      const passportBackUrl = await uploadImage(formData.passportBack, 'passport_back');
      const driverLicenseFrontUrl = await uploadImage(formData.driverLicenseFront, 'driver_license_front');
      const driverLicenseBackUrl = await uploadImage(formData.driverLicenseBack, 'driver_license_back');

      // Insert verification data
      const { error } = await supabase
        .from('customers_verification')
        .insert({
          user_id: userData.id,
          full_name: formData.fullName,
          email: formData.email,
          live_photo_url: livePhotoUrl,
          identity_card_type: formData.identityCardType,
          nin_front_url: ninFrontUrl,
          nin_back_url: ninBackUrl,
          nin_number: formData.nin,
          pvc_front_url: pvcFrontUrl,
          pvc_back_url: pvcBackUrl,
          passport_front_url: passportFrontUrl,
          passport_back_url: passportBackUrl,
          passport_number: formData.passportNumber,
          driver_license_front_url: driverLicenseFrontUrl,
          driver_license_back_url: driverLicenseBackUrl,
          driver_license_number: formData.driverLicenseNumber,
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          lga: formData.lga,
          landmark: formData.landmark,
          device_brand: formData.deviceBrand,
          device_model: formData.deviceModel,
          emergency_name: formData.emergencyName,
          emergency_phone: formData.emergencyPhone,
          emergency_relationship: formData.emergencyRelationship,
          verification_status: 'pending'
        });

      if (error) throw error;

      localStorage.setItem('customerVerificationStatus', 'pending');
      router.push('/dashboardC');
    } catch (error) {
      console.error('Verification submission error:', error);
      setErrors({ ...errors, submit: 'Failed to submit verification. Please try again.' });
      setIsSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (verificationStatus === 'pending' || verificationStatus === 'partial') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-yellow-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">KYC Awaiting Approval</h1>
          <p className="text-gray-600 mb-6">
            Your verification documents are under review. This process typically takes 2-3 business days.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              You'll receive an email notification once your verification is complete.
            </p>
          </div>
          <Link
            href="/dashboardC"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Verification Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been verified. You can now enjoy full access to all our services.
          </p>
          <Link
            href="/dashboardC"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">Quick verification to ensure safe pickups and accurate deliveries</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Your information is encrypted and never shared without consent
            </p>
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
                <UserCircle className="w-16 h-16 mx-auto mb-3 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Identity Information</h2>
                <p className="text-gray-600">Help us know who we're serving so we can provide personalized support</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                  style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                />
                <p className="text-sm text-gray-500 mt-1">Email from your account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Photo Verification *</label>
                {!showCamera ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    {formData.livePhotoPreview ? (
                      <div>
                        <img src={formData.livePhotoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
                        <button
                          type="button"
                          onClick={startCamera}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Retake Photo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="w-full"
                      >
                        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-700">Take Live Photo</p>
                        <p className="text-xs text-gray-500 mt-1">Camera will open to capture your photo</p>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <video
                      id="cameraVideo"
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover bg-black"
                    />
                    <div className="flex gap-2 p-4 bg-gray-50">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Capture Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {errors.livePhoto && <p className="text-red-500 text-sm mt-1">{errors.livePhoto}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Identity Card (Optional)</label>
                <select
                  value={formData.identityCardType}
                  onChange={(e) => setFormData({ ...formData, identityCardType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                  <option value="">Select Identity Card Type</option>
                  <option value="NIN">NIN (National Identity Number)</option>
                  <option value="PVC">PVC (Voter's Card)</option>
                  <option value="PASSPORT">International Passport</option>
                  <option value="DRIVER_LICENSE">Driver's License</option>
                </select>

                {formData.identityCardType === 'NIN' && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">NIN Front</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'ninFront', 'ninFrontPreview')}
                            className="hidden"
                            id="ninFront"
                          />
                          <label htmlFor="ninFront" className="cursor-pointer">
                            {formData.ninFrontPreview ? (
                              <img src={formData.ninFrontPreview} alt="NIN Front" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Front (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.ninFront && <p className="text-red-500 text-xs mt-1">{errors.ninFront}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">NIN Back</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'ninBack', 'ninBackPreview')}
                            className="hidden"
                            id="ninBack"
                          />
                          <label htmlFor="ninBack" className="cursor-pointer">
                            {formData.ninBackPreview ? (
                              <img src={formData.ninBackPreview} alt="NIN Back" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Back (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.ninBack && <p className="text-red-500 text-xs mt-1">{errors.ninBack}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIN Number</label>
                      <input
                        type="text"
                        maxLength="11"
                        value={formData.nin}
                        onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, '') })}
                        placeholder="12345678901"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {formData.identityCardType === 'PVC' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">PVC Front</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'pvcFront', 'pvcFrontPreview')}
                          className="hidden"
                          id="pvcFront"
                        />
                        <label htmlFor="pvcFront" className="cursor-pointer">
                          {formData.pvcFrontPreview ? (
                            <img src={formData.pvcFrontPreview} alt="PVC Front" className="w-full h-32 object-cover rounded mb-2" />
                          ) : (
                            <div>
                              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                              <p className="text-xs text-gray-600">Upload Front (Max 1MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.pvcFront && <p className="text-red-500 text-xs mt-1">{errors.pvcFront}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">PVC Back</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'pvcBack', 'pvcBackPreview')}
                          className="hidden"
                          id="pvcBack"
                        />
                        <label htmlFor="pvcBack" className="cursor-pointer">
                          {formData.pvcBackPreview ? (
                            <img src={formData.pvcBackPreview} alt="PVC Back" className="w-full h-32 object-cover rounded mb-2" />
                          ) : (
                            <div>
                              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                              <p className="text-xs text-gray-600">Upload Back (Max 1MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.pvcBack && <p className="text-red-500 text-xs mt-1">{errors.pvcBack}</p>}
                    </div>
                  </div>
                )}

                {formData.identityCardType === 'PASSPORT' && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Passport Photo Page</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'passportFront', 'passportFrontPreview')}
                            className="hidden"
                            id="passportFront"
                          />
                          <label htmlFor="passportFront" className="cursor-pointer">
                            {formData.passportFrontPreview ? (
                              <img src={formData.passportFrontPreview} alt="Passport Front" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Photo Page (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.passportFront && <p className="text-red-500 text-xs mt-1">{errors.passportFront}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Passport Back Page</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'passportBack', 'passportBackPreview')}
                            className="hidden"
                            id="passportBack"
                          />
                          <label htmlFor="passportBack" className="cursor-pointer">
                            {formData.passportBackPreview ? (
                              <img src={formData.passportBackPreview} alt="Passport Back" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Back Page (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.passportBack && <p className="text-red-500 text-xs mt-1">{errors.passportBack}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                      <input
                        type="text"
                        value={formData.passportNumber}
                        onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                        placeholder="A12345678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {formData.identityCardType === 'DRIVER_LICENSE' && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Driver's License Front</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'driverLicenseFront', 'driverLicenseFrontPreview')}
                            className="hidden"
                            id="driverLicenseFront"
                          />
                          <label htmlFor="driverLicenseFront" className="cursor-pointer">
                            {formData.driverLicenseFrontPreview ? (
                              <img src={formData.driverLicenseFrontPreview} alt="License Front" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Front (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.driverLicenseFront && <p className="text-red-500 text-xs mt-1">{errors.driverLicenseFront}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Driver's License Back</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'driverLicenseBack', 'driverLicenseBackPreview')}
                            className="hidden"
                            id="driverLicenseBack"
                          />
                          <label htmlFor="driverLicenseBack" className="cursor-pointer">
                            {formData.driverLicenseBackPreview ? (
                              <img src={formData.driverLicenseBackPreview} alt="License Back" className="w-full h-32 object-cover rounded mb-2" />
                            ) : (
                              <div>
                                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600">Upload Back (Max 1MB)</p>
                              </div>
                            )}
                          </label>
                        </div>
                        {errors.driverLicenseBack && <p className="text-red-500 text-xs mt-1">{errors.driverLicenseBack}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License Number</label>
                      <input
                        type="text"
                        value={formData.driverLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, driverLicenseNumber: e.target.value.toUpperCase() })}
                        placeholder="ABC123456789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              {errors.identity && <p className="text-red-500 text-sm">{errors.identity}</p>}
            </div>
          )}

          {/* Step 2: Phone Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Smartphone className="w-16 h-16 mx-auto mb-3 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Number</h2>
                <p className="text-gray-600">Provide your phone number so engineers can contact you for pickup coordination</p>
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
                <p className="text-sm text-gray-500 mt-1">Enter your Nigerian phone number</p>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-16 h-16 mx-auto mb-3 text-blue-600" />
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
                    onChange={(e) => setFormData({ ...formData, state: e.target.value, lga: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state</option>
                    {Object.keys(nigerianStates).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LGA *</label>
                  <select
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    disabled={!formData.state}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select LGA</option>
                    {formData.state && nigerianStates[formData.state]?.map(lga => (
                      <option key={lga} value={lga}>{lga}</option>
                    ))}
                  </select>
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
                <Smartphone className="w-16 h-16 mx-auto mb-3 text-blue-600" />
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
                <Users className="w-16 h-16 mx-auto mb-3 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency/Alternate Contact</h2>
                <p className="text-gray-600">Optional: Someone we can reach if we can't contact you during pickup</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="Enter contact name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
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
              {errors.emergency && <p className="text-red-500 text-sm">{errors.emergency}</p>}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">ℹ️ This contact is only used if we can't reach you</p>
              </div>
            </div>
          )}

          {/* Step 6: Security & Consent */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Lock className="w-16 h-16 mx-auto mb-3 text-blue-600" />
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
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4" />
                  You're all set! Complete verification to start requesting pickups
                </p>
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
