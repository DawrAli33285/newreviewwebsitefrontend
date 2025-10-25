import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from './baseurl';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [oneStarStep, setOneStarStep] = useState(1); // Track steps for low-rating flow (≤3 stars)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [businessData, setbusinessData] = useState({
    name: '',
    logo: 'P',
    logoColor: 'from-blue-500 to-purple-600'
  });
  
  const { restaurantName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleStarClick = async (star) => {
    setRating(star);
    
    // If rating is ≤ 3 stars, show step-by-step form
    if (star <= 3) {
      setShowForm(true);
      setOneStarStep(1); // Start with comment step
      return;
    }
    
    // If rating is 4 or 5, redirect immediately to Google Maps
    if (star >= 4) {
      try {
        let data = {
          ...formData,
          rating: star,
          business: businessData._id,
        };
        await axios.post(`${BASE_URL}/createfiveStarReview`, data);
        toast.success('Thank you for your review!', { containerId: "reviewPage" });
          
        const getPlaceId = async () => {
          const query = businessData.businessAddress 
            ? `${businessData.name} ${businessData.businessAddress}`
            : businessData.name;
          
          const response = await axios.post(`${BASE_URL}/getplaceId`, { query });
          
          if (response.data.success && response.data.place_id) {
            return response.data.place_id;
          }
          return null;
        };

        const placeId = await getPlaceId();

        setTimeout(async () => {
          try {
            if (placeId) {
              window.location.href = `https://search.google.com/local/writereview?placeid=${placeId}`;
            } else {
              const searchQuery = businessData.businessAddress 
                ? encodeURIComponent(`${businessData.name} ${businessData.businessAddress}`)
                : encodeURIComponent(businessData.name);
              
              window.location.href = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
              console.warn('Could not find Place ID, opened search instead');
            }
          } catch (error) {
            const searchQuery = businessData.businessAddress 
              ? encodeURIComponent(`${businessData.name} ${businessData.businessAddress}`)
              : encodeURIComponent(businessData.name);
            
            window.location.href = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
            console.error('Error fetching Place ID:', error);
          }
        }, 1500);
        
      } catch (e) {
        if (e?.response?.data?.error) {
          toast.error(e?.response?.data?.error, { containerId: "reviewPage" });
        } else {
          toast.error("Network error please try again", { containerId: "reviewPage" });
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (oneStarStep === 1 && !formData.description.trim()) {
      toast.error('Please share your feedback before continuing', { containerId: "reviewPage" });
      return;
    }
    setOneStarStep(prev => prev + 1);
  };

  const handleSkipStep = () => {
    setOneStarStep(prev => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For ratings ≤ 3, validate comment
    if (rating <= 3 && !formData.description.trim()) {
      toast.error('Please share your feedback', { containerId: "reviewPage" });
      return;
    }

    try {
      const search = new URLSearchParams(location.search);
      let source = search.get('source') || 'qrcode';
      
      let data = {
        ...formData,
        rating,
        business: businessData._id,
        source
      };
      
      if (formData.name.length === 0) {
        data = {
          ...data,
          name: 'anonymous'
        };
      }
      if (formData.email.length === 0) {
        data = {
          ...data,
          email: 'anonymous@gmail.com'
        };
      }
    
      await axios.post(`${BASE_URL}/createReview`, data);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
      });
      setRating(0);
      
      toast.success('Thank you for your feedback!', { containerId: "reviewPage" });
      
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (e) {
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "reviewPage" });
      } else {
        toast.error("Network error please try again", { containerId: "reviewPage" });
      }
    }
  };

  const getBusinessData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getSpecificBusiness/${restaurantName}`);
      
      setbusinessData({
        name: response?.data?.business?.businessName,
        logo: response?.data?.business?.photo || 'P',
        logoColor: 'from-blue-500 to-purple-600',
        _id: response.data.business._id,
        businessAddress: response.data.business.businessAddress,
        businessName: response?.data?.business?.businessName,
      });

      if (localStorage.getItem("user")) {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const loggedInId = currentUser?._id?.toString();
        const businessOwnerId = response?.data?.business?.user?.toString();

        if (loggedInId !== businessOwnerId) {
          await axios.patch(`${BASE_URL}/updateVisitor/${response.data.business._id}`);
        }
      } else {
        await axios.patch(`${BASE_URL}/updateVisitor/${response.data.business._id}`);
      }
    } catch (e) {
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "reviewPage" });
      } else {
        toast.error("Network error", { containerId: "reviewPage" });
      }
    }
  };

  useEffect(() => {
    getBusinessData();
  }, [restaurantName]);

  return (
    <>
      <ToastContainer containerId={"reviewPage"} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl max-w-md w-full p-8">
          {!showForm ? (
            // Rating Selection View
            <div className="text-center space-y-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${businessData.logoColor} flex items-center justify-center mx-auto shadow-lg`}>
                {businessData?.logo && businessData.logo !== 'P' ? (
                  <img 
                    src={businessData.logo} 
                    alt={businessData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {businessData?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {businessData.name}
                </h1>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  How was your experience?
                </h2>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <svg
                        className={`w-12 h-12 ${
                          star <= (hoveredStar || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  © 2025 {businessData.name}. All rights reserved.
                </p>
              </div>
            </div>
          ) : rating <= 3 ? (
            // Step-by-Step Form for ratings ≤ 3
            <div className="text-center space-y-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${businessData.logoColor} flex items-center justify-center mx-auto shadow-lg`}>
                {businessData?.logo && businessData.logo !== 'P' ? (
                  <img 
                    src={businessData.logo} 
                    alt={businessData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {businessData?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {businessData.name}
                </h1>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Step 1: Comment */}
              {oneStarStep === 1 && (
                <div className="space-y-4 text-left">
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    We're sorry to hear that
                  </h2>
                  <p className="text-sm text-gray-600 text-center">
                    Your feedback helps us improve. Please tell us what went wrong.
                  </p>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="comment"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                      placeholder="Please share what could have been better..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Email */}
              {oneStarStep === 2 && (
                <div className="space-y-4 text-left">
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    Can we follow up with you?
                  </h2>
                  <p className="text-sm text-gray-600 text-center">
                    We'd love to make things right. Share your email so we can reach out (optional).
                  </p>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSkipStep}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Phone */}
              {oneStarStep === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    One last thing...
                  </h2>
                  <p className="text-sm text-gray-600 text-center">
                    Would you like us to call you? Share your phone number (optional).
                  </p>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Skip & Submit
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  © 2025 {businessData.name}. All rights reserved.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ReviewPage;