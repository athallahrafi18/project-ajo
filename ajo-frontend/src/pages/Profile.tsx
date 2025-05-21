import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Star, Package, User, Settings, LogOut, MapPin, Camera, ThumbsUp, ThumbsDown, Calendar, Clock, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { RootState } from '../store';
import { updateUserProfile } from '../store/slices/userSlice';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import StarRating from '../components/StarRating';

interface OrderFilter {
  dateRange: 'all' | 'today' | 'week' | 'month';
  status: string;
  category: string;
}

interface Review {
  id: string;
  productId: string;
  rating: number;
  criteria: {
    quality: number;
    value: number;
    shipping: number;
  };
  comment: string;
  photos: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string;
  edited: boolean;
  verified: boolean;
}

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const orders = user?.orders || [];
  
  // State management
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>({
    dateRange: 'all',
    status: 'all',
    category: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    notifications: true
  });
  const [showMap, setShowMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    rating: 0,
    criteria: {
      quality: 0,
      value: 0,
      shipping: 0
    },
    comment: '',
    photos: []
  });

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewReview(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 5
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
  };

  // Order filtering and sorting
  const filteredOrders = orders.filter(order => {
    if (orderFilter.dateRange !== 'all') {
      const orderDate = parseISO(order.createdAt);
      const now = new Date();
      switch (orderFilter.dateRange) {
        case 'today':
          if (format(orderDate, 'yyyy-MM-dd') !== format(now, 'yyyy-MM-dd')) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          if (orderDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          if (orderDate < monthAgo) return false;
          break;
      }
    }

    if (orderFilter.status !== 'all' && order.status !== orderFilter.status) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return order.id.toLowerCase().includes(searchLower) ||
             order.items.some(item => item.product.name.toLowerCase().includes(searchLower));
    }
    return true;
  });

  // Order status rendering with progress indicator
  const renderOrderStatus = (order: typeof orders[0]) => {
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStep = statusSteps.indexOf(order.status);

    return (
      <div className="w-full">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-primary-600' : 'text-secondary-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-primary-100' : 'bg-secondary-100'
              }`}>
                {index < currentStep ? (
                  '✓'
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 capitalize">{step}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-secondary-100 rounded-full">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Download invoice
  const downloadInvoice = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const invoiceElement = document.getElementById(`invoice-${orderId}`);
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement);
    const pdf = new jsPDF();
    
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${orderId}.pdf`);
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-secondary-900">{formData.name || 'Guest'}</h2>
                <p className="text-sm text-secondary-600">{formData.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'reviews' ? 'bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-4 py-2 rounded-md text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Order History</h2>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => {/* Toggle filter modal */}}
                        className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-md"
                      >
                        <Filter className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-secondary-600">Order #{order.id}</p>
                            <div className="flex items-center gap-2 text-sm text-secondary-600">
                              <Calendar className="w-4 h-4" />
                              <span>{format(parseISO(order.createdAt), 'MMM dd, yyyy')}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{format(parseISO(order.createdAt), 'HH:mm')}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadInvoice(order.id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>

                        {renderOrderStatus(order)}

                        <div className="mt-4 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                              <span>{item.product.name} x {item.quantity}</span>
                              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {order.status === 'shipped' && (
                          <div className="mt-4">
                            <button
                              onClick={() => setShowMap(true)}
                              className="flex items-center text-primary-600 hover:text-primary-700"
                            >
                              <MapPin className="w-4 h-4 mr-1" />
                              Track Package
                            </button>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div>
                            <span className="font-medium">Total</span>
                            <span className="ml-2 font-medium">${order.total.toFixed(2)}</span>
                          </div>
                          {order.status === 'delivered' && (
                            <button
                              onClick={() => setActiveTab('reviews')}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              Write a Review
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Your Reviews</h2>
                  <div className="space-y-6">
                    {/* New Review Form */}
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Overall Rating
                          </label>
                          <StarRating
                            value={newReview.rating || 0}
                            onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                            size={24}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                              Quality
                            </label>
                            <StarRating
                              value={newReview.criteria?.quality || 0}
                              onChange={(rating) => setNewReview(prev => ({
                                ...prev,
                                criteria: { ...prev.criteria, quality: rating }
                              }))}
                              size={20}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                              Value
                            </label>
                            <StarRating
                              value={newReview.criteria?.value || 0}
                              onChange={(rating) => setNewReview(prev => ({
                                ...prev,
                                criteria: { ...prev.criteria, value: rating }
                              }))}
                              size={20}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                              Shipping
                            </label>
                            <StarRating
                              value={newReview.criteria?.shipping || 0}
                              onChange={(rating) => setNewReview(prev => ({
                                ...prev,
                                criteria: { ...prev.criteria, shipping: rating }
                              }))}
                              size={20}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Share your experience..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Add Photos
                          </label>
                          <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                          >
                            <input {...getInputProps()} />
                            <Camera className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                            <p className="text-secondary-600">
                              Drag & drop photos here, or click to select
                            </p>
                            <p className="text-sm text-secondary-500">
                              Maximum 5 photos
                            </p>
                          </div>
                          {newReview.photos && newReview.photos.length > 0 && (
                            <div className="mt-4 flex gap-2">
                              {newReview.photos.map((photo, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={photo}
                                    alt={`Review photo ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => {
                                      setNewReview(prev => ({
                                        ...prev,
                                        photos: prev.photos?.filter((_, i) => i !== index)
                                      }));
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {/* Submit review */}}
                          className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>

                    {/* Past Reviews */}
                    <div className="space-y-4">
                      {user?.reviews?.map((review: Review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <StarRating
                                  value={review.rating}
                                  size={20}
                                />
                                {review.verified && (
                                  <span className="text-green-600 text-sm">Verified Purchase</span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600">
                                {format(parseISO(review.createdAt), 'MMM dd, yyyy')}
                                {review.edited && ' (edited)'}
                              </p>
                            </div>
                            {Date.now() - parseISO(review.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000 && (
                              <button className="text-primary-600 hover:text-primary-700">
                                Edit Review
                              </button>
                            )}
                          </div>

                          <p className="text-secondary-700 mb-4">{review.comment}</p>

                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {review.photos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={`Review photo ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-secondary-600">
                            <button className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.helpful}</span>
                            </button>
                            <button className="flex items-center gap-1">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{review.notHelpful}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-secondary-700">
                        Receive order status notifications
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;