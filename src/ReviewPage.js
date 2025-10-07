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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    
    // If rating is 4 or 5, redirect immediately to Google Maps
    if (star >= 4) {
      try {
        toast.success('Thank you for your review!', { containerId: "reviewPage" });
        
        // Function to get Place ID from Google Places API
        const getPlaceId = async () => {
          const query = businessData.businessAddress 
            ? `${businessData.name} ${businessData.businessAddress}`
            : businessData.name;
          
          console.log('Searching for:', query);
          
          const response = await axios.post(`${BASE_URL}/getplaceId`, { query });
          
          if (response.data.success && response.data.place_id) {
            return response.data.place_id;
          }
          return null;
        };

        
        const placeId = await getPlaceId();
        console.log(placeId)

    
        // Fetch Place ID and redirect
        setTimeout(async () => {
          try {
         
            if (placeId) {
              // Redirect to Google Maps with review dialog opened
              // Using the write a review action
              window.location.href = `https://search.google.com/local/writereview?placeid=${placeId}`;
            } else {
              // Fallback: Open Google Maps search without review popup
              const searchQuery = businessData.businessAddress 
                ? encodeURIComponent(`${businessData.name} ${businessData.businessAddress}`)
                : encodeURIComponent(businessData.name);
              
              window.location.href = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
              console.warn('Could not find Place ID, opened search instead');
            }
          } catch (error) {
            // Fallback on error
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
    }else {
      // If rating is less than 4, show the form
      setShowForm(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const search = new URLSearchParams(location.search);
      let source = search.get('source') || 'qrcode';
      
      let data = {
        ...formData,
        rating,
        business: businessData._id,
        source
      };
      
      if(formData.name.length==0){
data={
  ...data,
  name:'anonymous'
}
      }
      if(formData.email.length==0){
        data={
          ...data,
          email:'anonymous@gmail.com'
        }
      }
    
      await axios.post(`${BASE_URL}/createReview`, data);
      
      setFormData({
        name: '',
        email: '',
        description: '',
      });
      setRating(0);
      
      toast.success('Thank you for your feedback!', { containerId: "reviewPage" });
      
      setTimeout(()=>{
window.close();
      },1500)

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
      console.log(e.message);
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
          ) : (
            // Form View (for ratings < 4)
            <form onSubmit={handleSubmit} className="text-center space-y-6">
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
                  Tell us more about your experience
                </h2>
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
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
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

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us what went wrong..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Submit Review
              </button>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  © 2025 {businessData.name}. All rights reserved.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewPage;