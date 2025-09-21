import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, orderService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  RefreshCcwIcon,
  X,
  User,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
  Loader
} from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { createOrUpdateProfile } = useProfile();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Buy Now Modal States
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    division: 'Dhaka',
    district: '',
    upazila: '',
    address: '',
    paymentMethod: 'cod', // 'cod' or 'online'
    notes: ''
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Share Modal States
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  
  // Bangladesh divisions with delivery charges (like checkout page)
  const divisions = [
    { value: 'Dhaka', label: 'Dhaka', charge: 70 },
    { value: 'Chattogram', label: 'Chattogram (Chittagong)', charge: 120 },
    { value: 'Khulna', label: 'Khulna', charge: 120 },
    { value: 'Rajshahi', label: 'Rajshahi', charge: 120 },
    { value: 'Rangpur', label: 'Rangpur', charge: 120 },
    { value: 'Barishal', label: 'Barishal (Barisal)', charge: 120 },
    { value: 'Sylhet', label: 'Sylhet', charge: 120 },
    { value: 'Mymensingh', label: 'Mymensingh', charge: 120 }
  ];
  
  // Address Data for Bangladesh - Complete Data
  const bangladeshAddressData = {
    'Dhaka': {
      'Dhaka': ['Adabor', 'Badda', 'Biman Bandar', 'Cantonment', 'Chak Bazar', 'Dakhshinkhan', 'Darussalam', 'Demra', 'Dhamrai', 'Dhanmondi', 'Gulshan', 'Jatrabari', 'Kadamtali', 'Kafrul', 'Kalabagan', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Mirpur', 'Mohammadpur', 'Motijheel', 'Nawabganj', 'New Market', 'Pallabi', 'Paltan', 'Ramna', 'Rampura', 'Sabujbaga', 'Shah Ali', 'Shahbag', 'Sher-e-Bangla Nagar', 'Shyampur', 'Sutrapur', 'Tejgaon', 'Tejgaon Industrial Area', 'Turag', 'Uttara', 'Uttara West'],
      'Faridpur': ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
      'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
      'Gopalganj': ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
      'Kishoreganj': ['Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kishoreganj Sadar', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'],
      'Madaripur': ['Kalkini', 'Madaripur Sadar', 'Rajoir', 'Shibchar'],
      'Manikganj': ['Daulatpur', 'Ghior', 'Harirampur', 'Manikganj Sadar', 'Saturia', 'Shivalaya', 'Singair'],
      'Munshiganj': ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
      'Narayanganj': ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
      'Narsingdi': ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
      'Rajbari': ['Baliakandi', 'Goalandaghat', 'Kalukhali', 'Pangsha', 'Rajbari Sadar'],
      'Shariatpur': ['Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Shariatpur Sadar', 'Zajira'],
      'Tangail': ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar']
    },
    'Chattogram': {
      'Bandarban': ['Ali Kadam', 'Bandarban Sadar', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'],
      'Brahmanbaria': ['Akhaura', 'Ashuganj', 'Bancharampur', 'Bijoynagar', 'Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'],
      'Chandpur': ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
      'Chattogram': ['Anowara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
      'Cumilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Lalmai', 'Meghna', 'Monohorgonj', 'Muradnagar', 'Nangalkot', 'Titas'],
      'Cox\'s Bazar': ['Chakaria', 'Cox\'s Bazar Sadar', 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhiya'],
      'Feni': ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Parshuram', 'Sonagazi', 'Fulgazi'],
      'Khagrachhari': ['Dighinala', 'Khagrachhari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'],
      'Lakshmipur': ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
      'Noakhali': ['Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Kabirhat', 'Noakhali Sadar', 'Senbagh', 'Sonaimuri', 'Subarnachar'],
      'Rangamati': ['Bagaichhari', 'Barkal', 'Kawkhali (Betbunia)', 'Belaichhari', 'Juraichhari', 'Kaptai', 'Langadu', 'Naniyachar', 'Rajasthali', 'Rangamati Sadar']
    },
    'Khulna': {
      'Bagerhat': ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'],
      'Chuadanga': ['Alamdanga', 'Chuadanga Sadar', 'Damurhuda', 'Jibannagar'],
      'Jashore': ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargacha', 'Keshabpur', 'Jashore Sadar', 'Manirampur', 'Sharsha'],
      'Jhenaidah': ['Harinakunda', 'Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
      'Khulna': ['Batiaghata', 'Dacope', 'Dakop', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'],
      'Kushtia': ['Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Kushtia Sadar', 'Mirpur'],
      'Magura': ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
      'Meherpur': ['Gangni', 'Meherpur Sadar', 'Mujibnagar'],
      'Narail': ['Kalia', 'Lohagara', 'Narail Sadar'],
      'Satkhira': ['Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Satkhira Sadar', 'Shyamnagar', 'Tala']
    },
    'Rajshahi': {
      'Bogura': ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shahjahanpur', 'Sherpur', 'Shibganj', 'Sonatola'],
      'Chapainawabganj': ['Bholahat', 'Chapainawabganj Sadar', 'Gomastapur', 'Nachole', 'Shibganj'],
      'Joypurhat': ['Akkelpur', 'Joypurhat Sadar', 'Kalai', 'Khetlal', 'Panchbibi'],
      'Naogaon': ['Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Naogaon Sadar', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
      'Natore': ['Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Natore Sadar', 'Singra'],
      'Pabna': ['Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Pabna Sadar', 'Santhia', 'Sujanagar'],
      'Rajshahi': ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Matihar', 'Mohanpur', 'Paba', 'Puthia', 'Rajpara', 'Shah Makhdum', 'Tanore'],
      'Sirajganj': ['Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Sirajganj Sadar', 'Tarash', 'Ullahpara']
    },
    'Rangpur': {
      'Dinajpur': ['Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharo', 'Khansama', 'Dinajpur Sadar', 'Nawabganj', 'Parbatipur'],
      'Gaibandha': ['Phulchhari', 'Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sughatta', 'Sundarganj'],
      'Kurigram': ['Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Kurigram Sadar', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'],
      'Lalmonirhat': ['Aditmari', 'Hatibandha', 'Kaliganj', 'Lalmonirhat Sadar', 'Patgram'],
      'Nilphamari': ['Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Nilphamari Sadar', 'Saidpur'],
      'Panchagarh': ['Atwari', 'Boda', 'Debiganj', 'Panchagarh Sadar', 'Tetulia'],
      'Rangpur': ['Badarganj', 'Gangachara', 'Kaunia', 'Rangpur Sadar', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
      'Thakurgaon': ['Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail', 'Thakurgaon Sadar']
    },
    'Barishal': {
      'Barguna': ['Amtali', 'Bamna', 'Barguna Sadar', 'Betagi', 'Patharghata', 'Taltali'],
      'Barishal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banari Para', 'Barishal Sadar', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
      'Bhola': ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
      'Jhalokati': ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
      'Patuakhali': ['Bauphal', 'Dashmina', 'Dumki', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Patuakhali Sadar', 'Rangabali'],
      'Pirojpur': ['Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Pirojpur Sadar', 'Nesarabad (Swarupkati)', 'Zianagar']
    },
    'Sylhet': {
      'Habiganj': ['Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Habiganj Sadar', 'Lakhai', 'Madhabpur', 'Nabiganj'],
      'Moulvibazar': ['Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Moulvibazar Sadar', 'Rajnagar', 'Sreemangal'],
      'Sunamganj': ['Bishwamvarpur', 'Chhatak', 'Dakshin Sunamganj', 'Derai', 'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Sunamganj Sadar', 'Tahirpur'],
      'Sylhet': ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj']
    },
    'Mymensingh': {
      'Jamalpur': ['Baksiganj', 'Dewanganj', 'Islampur', 'Jamalpur Sadar', 'Madarganj', 'Melandaha', 'Sarishabari'],
      'Mymensingh': ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Mymensingh Sadar', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal', 'Tarakanda'],
      'Netrokona': ['Atpara', 'Barhatta', 'Durgapur', 'Khaliajuri', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Netrokona Sadar', 'Purbadhala'],
      'Sherpur': ['Jhenaigati', 'Nakla', 'Nalitabari', 'Sherpur Sadar', 'Sreebardi']
    }
  };
  
  const getDistricts = () => {
    return Object.keys(bangladeshAddressData[orderForm.division] || {});
  };
  
  const getUpazilas = () => {
    return bangladeshAddressData[orderForm.division]?.[orderForm.district] || [];
  };
  
  // Get delivery charge based on selected division
  const getDeliveryCharge = () => {
    const division = divisions.find(d => d.value === orderForm.division);
    return division ? division.charge : 120;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productResponse, relatedResponse] = await Promise.all([
          productService.getProduct(id),
          productService.getRelatedProducts(id)
        ]);
        
        setProduct(productResponse.data);
        setRelatedProducts(relatedResponse.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity: quantity
      });
      // You can add a toast notification here
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // You can add wishlist functionality here
  };

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
    setOrderError('');
    setOrderSuccess(false);
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dependent fields when parent field changes
    if (name === 'division') {
      setOrderForm({
        ...orderForm,
        [name]: value,
        district: '',
        upazila: ''
      });
    } else if (name === 'district') {
      setOrderForm({
        ...orderForm,
        [name]: value,
        upazila: ''
      });
    } else {
      setOrderForm({
        ...orderForm,
        [name]: value
      });
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!orderForm.name.trim()) {
      setOrderError('Name is required');
      return;
    }
    if (!orderForm.phone.trim()) {
      setOrderError('Phone number is required');
      return;
    }
    if (!orderForm.division) {
      setOrderError('Division is required');
      return;
    }
    if (!orderForm.district.trim()) {
      setOrderError('District is required');
      return;
    }
    if (!orderForm.upazila.trim()) {
      setOrderError('Upazila is required');
      return;
    }
    if (!orderForm.address.trim()) {
      setOrderError('Address is required');
      return;
    }
    
    setOrderLoading(true);
    setOrderError('');

    try {
      // Calculate delivery charge based on division
      const deliveryCharge = getDeliveryCharge();
      const totalAmount = (product.price * quantity) + deliveryCharge;
      
      const orderData = {
        customer: {
          name: orderForm.name,
          phone: orderForm.phone,
          email: orderForm.email,
          address: `${orderForm.address}, ${orderForm.upazila}, ${orderForm.district}, ${orderForm.division}`
        },
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0]?.url
        }],
        totalAmount: totalAmount,
        paymentMethod: orderForm.paymentMethod,
        deliveryCharge: deliveryCharge,
        notes: orderForm.notes
      };

      const response = await orderService.createOrder(orderData);
      
      // Create/update user profile with order data
      const customerData = {
        name: orderForm.name,
        phone: orderForm.phone,
        division: orderForm.division,
        district: orderForm.district,
        upazila: orderForm.upazila,
        address: orderForm.address
      };
      
      const profileOrderData = {
        orderNumber: response.data.order.orderNumber,
        totalAmount: totalAmount,
        estimatedDelivery: response.data.order.estimatedDelivery,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0]?.url
        }],
        paymentMethod: orderForm.paymentMethod
      };
      
      createOrUpdateProfile(customerData, profileOrderData);
      
      setOrderDetails(response.data.order);
      setOrderSuccess(true);
      
      // Reset form
      setOrderForm({
        name: '',
        phone: '',
        email: '',
        division: 'Dhaka',
        district: '',
        upazila: '',
        address: '',
        paymentMethod: 'cod',
        notes: ''
      });
      
    } catch (error) {
      console.error('Order creation error:', error);
      setOrderError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const closeBuyNowModal = () => {
    setShowBuyNowModal(false);
    setOrderSuccess(false);
    setOrderError('');
    setOrderDetails(null);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setShareLinkCopied(false);
  };

  const generateShareLink = () => {
    return `${window.location.origin}/product/${product._id}`;
  };

  const copyShareLink = async () => {
    try {
      const shareLink = generateShareLink();
      await navigator.clipboard.writeText(shareLink);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateShareLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 3000);
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareLinkCopied(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-primary-600">
                Home
              </button>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-500">{product.category}</span>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <img
                src={product.images[selectedImage]?.url || product.images[0]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.0)</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{product.stock} in stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
            </div>
            
            {/* Secondary Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={toggleWishlist}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>Wishlist</span>
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <TruckIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Free delivery all over Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">100% authentic products</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCcwIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">7-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={relatedProduct.images[0]?.url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    />
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: relatedProduct._id,
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          image: relatedProduct.images[0]?.url,
                          quantity: 1
                        });
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    >
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary-600">৳{relatedProduct.price.toLocaleString()}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">৳{relatedProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addToCart({
                          id: relatedProduct._id,
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          image: relatedProduct.images[0]?.url,
                          quantity: 1
                        });
                      }}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Buy Now Modal */}
      {showBuyNowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {orderSuccess ? 'Order Confirmation' : 'Complete Your Order'}
              </h2>
              <button
                onClick={closeBuyNowModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Success State */}
            {orderSuccess && orderDetails ? (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {orderForm.paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Completed!'}
                  </h3>
                  <p className="text-gray-600">
                    {orderForm.paymentMethod === 'cod' 
                      ? 'Your order has been placed successfully. You can pay when the product is delivered.'
                      : 'Thank you for your payment! Your order has been confirmed and will be processed soon.'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Order Number:</span>
                      <p className="font-semibold">{orderDetails.orderNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-semibold">৳{orderDetails.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <p className="font-semibold">{orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Delivery:</span>
                      <p className="font-semibold">{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={closeBuyNowModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleOrderSubmit} className="p-6">
                {/* Product Summary */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">Quantity: {quantity}</p>
                    <p className="text-lg font-bold text-primary-600">৳{(product.price * quantity).toLocaleString()}</p>
                  </div>
                </div>

                {/* Error Message */}
                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{orderError}</p>
                  </div>
                )}

                {/* Customer Information */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Customer Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={orderForm.name}
                        onChange={handleOrderFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={orderForm.phone}
                        onChange={handleOrderFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., +8801712345678"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleOrderFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                  
                  {/* Delivery Address Section */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <span>Delivery Address *</span>
                    </h4>
                    
                    {/* Division */}
                    <div className="mb-4">
                      <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
                        Division *
                      </label>
                      <select
                        id="division"
                        name="division"
                        value={orderForm.division}
                        onChange={handleOrderFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {divisions.map(division => (
                          <option key={division.value} value={division.value}>
                            {division.label} (Delivery Charge: ৳{division.charge})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* District */}
                    <div className="mb-4">
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <select
                        id="district"
                        name="district"
                        value={orderForm.district}
                        onChange={handleOrderFormChange}
                        required
                        disabled={!orderForm.division}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select District</option>
                        {getDistricts().map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      {!orderForm.division && (
                        <p className="text-xs text-gray-500 mt-1">Please select a division first</p>
                      )}
                    </div>
                    
                    {/* Upazila/Police Station */}
                    <div className="mb-4">
                      <label htmlFor="upazila" className="block text-sm font-medium text-gray-700 mb-2">
                        Upazila/Police Station *
                      </label>
                      <select
                        id="upazila"
                        name="upazila"
                        value={orderForm.upazila}
                        onChange={handleOrderFormChange}
                        required
                        disabled={!orderForm.district}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select Upazila/Police Station</option>
                        {getUpazilas().map((upazila) => (
                          <option key={upazila} value={upazila}>{upazila}</option>
                        ))}
                      </select>
                      {!orderForm.district && (
                        <p className="text-xs text-gray-500 mt-1">Please select a district first</p>
                      )}
                    </div>
                    
                    {/* Specific Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        House/Office Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={orderForm.address}
                        onChange={handleOrderFormChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder="Enter your house number, road, area, or office address details..."
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Example: House 123, Road 5, Block A, Zindabazar, or XYZ Building, 2nd Floor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Method</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={orderForm.paymentMethod === 'cod'}
                        onChange={handleOrderFormChange}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3 flex items-center space-x-3">
                        <Banknote className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-sm text-gray-600">Pay when you receive the product</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={orderForm.paymentMethod === 'online'}
                        onChange={handleOrderFormChange}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3 flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Online Payment</p>
                          <p className="text-sm text-gray-600">Pay using bKash, Bank Transfer, or Card</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleOrderFormChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Any special instructions for delivery..."
                  ></textarea>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  
                  {/* Delivery Address Summary */}
                  {(orderForm.division || orderForm.district || orderForm.upazila) && (
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Delivery to:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {[orderForm.upazila, orderForm.district, orderForm.division].filter(Boolean).join(', ')}
                      </p>
                      {orderForm.address && (
                        <p className="text-xs text-gray-600 mt-1">{orderForm.address}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Product Price:</span>
                      <span className="text-gray-900">৳{(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charge:</span>
                      <span className="text-gray-900">৳{getDeliveryCharge()}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-gray-900 font-medium">Total Amount:</span>
                      <span className="text-xl font-bold text-primary-600">৳{((product.price * quantity) + getDeliveryCharge()).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={closeBuyNowModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderLoading}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {orderLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>
                        {orderForm.paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Share Product</h2>
              <button
                onClick={closeShareModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Preview */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600">৳{product.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generateShareLink()}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                  <button
                    onClick={copyShareLink}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      shareLinkCopied
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {shareLinkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {shareLinkCopied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Link copied to clipboard!</span>
                  </p>
                )}
              </div>

              {/* Share Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">How to share:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Copy the link above</li>
                  <li>• Share it via WhatsApp, Facebook, or any messaging app</li>
                  <li>• Anyone who clicks the link will see this product</li>
                  <li>• They can buy directly from the product page</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={closeShareModal}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;