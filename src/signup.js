import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { BASE_URL, FRONTEND_URL } from './baseurl';
import axios from 'axios'
import { Copy, Check } from 'lucide-react';
import {ToastContainer,toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user,setUser]=useState({
    userName:'',
    password:''
  })
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
  });
  const [errors, setErrors] = useState({});
const navigate=useNavigate()
  const   handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Please enter your business name';
    }
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Please enter your business address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async() => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
     let response=await registerBusiness();
   
     if(response==false){
      return
     }
      setCurrentStep(3);
    }
  };

const registerBusiness=async()=>{
  try{
let response=await axios.post(`${BASE_URL}/createBusiness`,formData)
localStorage.setItem("token",response.data.token)
localStorage.setItem("user",JSON.stringify(response.data.user))
setUser({
  userName:response.data.user.userName,
  password:response.data.user.password
})
console.log("RESPONSE")
console.log(response.data)
toast.dismiss();
toast.success(response.data.message,{containerId:"signUp"})
return true
  }catch(e){
    toast.dismiss();
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"signUp"})
}else{
  toast.error("Error occured while creating account, please try again",{containerId:"signUp"})
}
return false
  }
}

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, label: 'Business Info' },
    { number: 2, label: 'Preview' },
    { number: 3, label: 'Complete' }
  ];
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    window.navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };


  return (
   <>
   
   
   <ToastContainer containerId={"signUp"}/>


   <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
      
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                      : currentStep === step.number
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform scale-110'
                      : 'bg-white text-gray-400 shadow-sm border-2 border-gray-200'
                  }`}>
                    {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-2 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center space-x-8 text-sm">
            {steps.map(step => (
              <span key={step.number} className={`transition-colors duration-300 ${
                currentStep === step.number ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>

     
        <div className="max-w-2xl mx-auto">
         
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-lg">?</span>
                    </div>
                    <span className="text-blue-900 font-semibold">Need help?</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <span>Watch</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Business Account</h2>
                  <p className="text-gray-600 text-lg mb-2">Just two details to get your landing page live and start collecting reviews</p>
                  <p className="text-gray-500 text-sm">You can add more details like email, phone, and photos from your dashboard</p>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., Mario's Pizza, Elite Barbershop"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.businessName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g., 123 Main Street, New York, NY 10001"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.businessAddress ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.businessAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-lg">?</span>
                    </div>
                    <span className="text-blue-900 font-semibold">Need help?</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <span>Watch</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Landing Page Preview</h2>
                <p className="text-gray-600 mb-8">This is how your customers will see your review page. You can customize it from your dashboard.</p>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 mb-8 max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold">
                      {formData.businessName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{formData.businessName}</h3>
                    <p className="text-gray-600 text-sm mb-4">{formData.businessAddress}</p>
                    <div className="text-center mb-4">
                      <p className="text-gray-700 font-medium mb-2">Rate us</p>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400 text-2xl">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">© 2025 {formData.businessName}. All rights reserved.</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Your landing page URL:</p>
                  <p className="text-blue-600 text-sm font-mono">{FRONTEND_URL}/restaurant/{formData.businessName.toLowerCase().replace(/\s+/g, '-')}</p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
                  <span className="text-yellow-600 text-xl">💡</span>
                  <p className="text-sm text-gray-700">Create business cards with QR codes from your dashboard to share with customers!</p>
                </div>
              </div>
            </div>
          )}

      
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Congratulations!</h2>
                <p className="text-xl text-gray-600 mb-8">Your business account has been created successfully!</p>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h3>
                  <div className="text-left space-y-3">
      {/* Credentials Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-3 text-lg">Your Login Credentials</h3>
        
        <div className="space-y-3">
          {/* Username */}
          <div className="bg-white rounded-md p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Username</p>
              <p className="text-gray-900 font-mono font-semibold">{user.userName}</p>
            </div>
            <button
              onClick={() => copyToClipboard(user.userName, 'username')}
              className="ml-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy username"
            >
              {copiedField === 'username' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Password */}
          <div className="bg-white rounded-md p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Password</p>
              <p className="text-gray-900 font-mono font-semibold">{user.password}</p>
            </div>
            <button
              onClick={() => copyToClipboard(user.password, 'password')}
              className="ml-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy password"
            >
              {copiedField === 'password' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="flex items-start space-x-3">
        <span className="text-green-600 text-lg">✓</span>
        <p className="text-gray-700">Access your personalized dashboard</p>
      </div>
      <div className="flex items-start space-x-3">
        <span className="text-green-600 text-lg">✓</span>
        <p className="text-gray-700">Customize your landing page design</p>
      </div>
      <div className="flex items-start space-x-3">
        <span className="text-green-600 text-lg">✓</span>
        <p className="text-gray-700">Generate QR codes for business cards</p>
      </div>
      <div className="flex items-start space-x-3">
        <span className="text-green-600 text-lg">✓</span>
        <p className="text-gray-700">Start collecting customer reviews</p>
      </div>
    </div>
                </div>

                <button onClick={()=>{
                  navigate('/admin')
                }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

    
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-8 py-3 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white font-medium text-gray-700 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                className="px-8 py-3 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>{currentStep === 1 ? 'Preview Landing Page' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
   </>
  );
}