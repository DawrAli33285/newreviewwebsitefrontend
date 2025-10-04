import React, { useEffect, useState } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from './baseurl';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [businessData,setbusinessData]=useState({
    name: '',
    logo: 'P',
    logoColor: 'from-blue-500 to-purple-600'
  })
const {restaurantName}=useParams();

const location=useLocation();

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate=useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
   try{
    if (rating === 0) {
      toast.error("Please select rating",{containerId:"reviewPage"})
      return;
    }
    let search=new URLSearchParams(location.search)
    let source=search.get('source')
    console.log('Review submitted:', { rating, ...formData });
    let data={
      ...formData,
      rating,
      business:businessData._id,
      source
    }
let response=await axios.post(`${BASE_URL}/createReview`,data)
setFormData({
  name: '',
  email: '',
  description: '',
})
if(rating>=4){
  if (rating >= 4 && businessData.businessAddress) {
    setRating(0)
   toast.success('Thank you for your review!',{containerId:"reviewPage"});
    setTimeout(() => {
      const searchQuery = encodeURIComponent(`${businessData.name} ${businessData.businessAddress}`);
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    }, 1000);

   
  }
}else{
  console.log("BUSINESSDATA")
  console.log(businessData)
 
  navigate(`/complaint?business=${businessData._id}&businessName=${businessData.businessName}`)
}

   }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"reviewPage"})
}else{
  toast.error("Network error please try again",{containerId:"reviewPage"})
}
   }
  };


const getBusinessData=async()=>{
  try{
let response=await axios.get(`${BASE_URL}/getSpecificBusiness/${restaurantName}`)
console.log(response.data) 
console.log(`get SPECIFIC BUSINESS`)
setbusinessData({
  name:response?.data?.business?.businessName,
  logo:response?.data?.business?.photo?response?.data?.business?.photo:'P',
   logoColor: 'from-blue-500 to-purple-600',
   _id:response.data.business._id,
   businessAddress:response.data.business.businessAddress,
   businessName:response?.data?.business?.businessName,
   photo:response?.data?.photo?response?.data?.photo:'P',
})

if (localStorage.getItem("user")) {
  let currentUser = JSON.parse(localStorage.getItem("user"));

  const loggedInId = currentUser?._id?.toString();
  const businessOwnerId = response?.data?.business?.user?.toString();

  if (loggedInId !== businessOwnerId) {
    await axios.patch(`${BASE_URL}/updateVisitor/${response.data.business._id}`);
  }
} else {
  await axios.patch(`${BASE_URL}/updateVisitor/${response.data.business._id}`);
}

}catch(e){
  console.log(e.message)
    if(e?.response?.data?.error){
      toast.error(e?.response?.data?.error,{containerId:"reviewPage"})
    }else{
      toast.error("Network error",{containerId:"reviewPage"})
    }
  }
}

useEffect(()=>{
getBusinessData();
},[])



  return (
  <>
  <ToastContainer containerId={"reviewPage"}/>
  
  <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl max-w-md w-full p-8">
        <form onSubmit={handleSubmit} className="text-center space-y-6">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${businessData.logoColor} flex items-center justify-center mx-auto shadow-lg`}>
  {businessData?.logo ? (
    <img 
      src={businessData.logo} 
      alt={businessData.name}
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    <span className="text-white text-4xl font-bold">
      {businessData?.name?.charAt(0).toUpperCase()}
    </span>
  )}
</div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {businessData.name}
            </h1>
            <p className="text-gray-600 text-sm">
              {businessData.tagline}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Rate us
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
                required
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
                required
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
                placeholder="Tell us about your experience..."
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
      </div>
    </div>
  </>
  );
};

export default ReviewPage;