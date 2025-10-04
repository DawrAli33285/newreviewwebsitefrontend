import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../baseurl';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    feedback: '',
    email: '',
    phone: '',
    business:''
  });
  const [businessData, setBusinessData] = useState({
    name: '',
    logo: 'P',
    logoColor: 'from-blue-500 to-purple-600'
  });
  const { restaurantName } = useParams();
const location=useLocation();
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
        if(formData.feedback.length==0){
            toast.error("Please enter feedback",{containerId:"complaintPage"})
       return;
        }
        if(formData.business.length==0){
            toast.error("Business id not found",{containerId:"complaintPage"})
            return;
        }
      console.log('Complaint submitted:', formData);
      let data = {
        ...formData,
        business: businessData._id
      };
      let response = await axios.post(`${BASE_URL}/createComplaint`, data);
      setFormData({
        feedback: '',
        email: '',
        phone: ''
      });
      toast.success('Thank you for your feedback. We will address your concerns.', { containerId: "complaintPage" });
    } catch (e) {
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "complaintPage" });
      } else {
        toast.error("Network error please try again", { containerId: "complaintPage" });
      }
    }
  };

  const getBusinessData = async () => {
    try {
      let params=new URLSearchParams(location.search)
let business=params.get('businessName')
      let response = await axios.get(`${BASE_URL}/getSpecificBusiness/${business}`);
      console.log(response.data);
      console.log(`get SPECIFIC BUSINESS`);
      setBusinessData({
        name: response?.data?.business?.businessName,
        logo:response.data.business.photo,
        logoColor: 'from-blue-500 to-purple-600',
        _id: response.data.business._id
      });
    } catch (e) {
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "complaintPage" });
      } else {
        toast.error("Network error", { containerId: "complaintPage" });
      }
    }
  };

  useEffect(() => {
    getBusinessData()
    getBusienssId();
  }, []);
  const getBusienssId=()=>{
    
    try{
let params=new URLSearchParams(location.search)
let business=params.get('business')
    setFormData({
        ...formData,
        business:business
    })
    }catch(e){

    }
  }

  return (
    <>
      <ToastContainer containerId={"complaintPage"} />

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

            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <MessageSquare className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">
                Share Your Feedback
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                Your feedback is confidential and will not be published publicly. We value your input to improve our service.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows="5"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Please share your concerns or feedback..."
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400 text-xs">(Optional)</span>
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
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Submit Feedback
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

export default ComplaintPage;