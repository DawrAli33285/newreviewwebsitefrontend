import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../baseurl';
import { toast, ToastContainer } from 'react-toastify';

const BusinessInfo = () => {
  const [formData, setFormData] = useState({
    businessName: 'Mc Donald',
    businessEmail: '',
    phoneNumber: '',
    businessId:'',
    website: '',
    businessAddress: 'Goethestraße 74, 80336 München'
  });


  const [businessImage, setBusinessImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
const [loading,setLoading]=useState(true)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const [originalBusiness,setOriginalBusiness]=useState({
  businessName: 'Mc Donald',
  businessEmail: '',
  phoneNumber: '',
  website: '',
  businessAddress: 'Goethestraße 74, 80336 München'
})
const [originalImagePreview,setOriginalImagePreview]=useState("")
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError('');

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError('File is too large. Maximum size is 5MB.');
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Please upload an image (PNG, JPG, JPEG, GIF).');
      } else {
        setUploadError('Error uploading file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
  
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        
        if (img.width < 200 || img.height < 200) {
          setUploadError('Image is too small. Minimum recommended size is 400×400px.');
          URL.revokeObjectURL(objectUrl);
          return;
        }
        
        if (img.width > 2000 || img.height > 2000) {
          setUploadError('Image is too large. Maximum recommended size is 2000×2000px.');
          URL.revokeObjectURL(objectUrl);
          return;
        }

       
        setBusinessImage(file);
        setImagePreview(objectUrl);
        setUploadError('');
      };
      
      img.onerror = () => {
        setUploadError('Failed to load image. Please try another file.');
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });


  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setBusinessImage(null);
    setImagePreview(null);
    setUploadError('');
  };

  const handleSave = async () => {
    try {
    
      const newFormData = new FormData();
  
      // append all properties from your state `formData`
      Object.keys(formData).forEach(key => {
        newFormData.append(key, formData[key]);
      });
  
      // append image separately
      if (businessImage) {
        newFormData.append("photo", businessImage);
      }
     
  
      let token = localStorage.getItem("token");
  
      let response = await axios.patch(
        `${BASE_URL}/updateBusiness`,
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success("Changes saved successfully!",{containerId:"businessInfo"});
     
  
    } catch (e) {
  
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "businessInfo" });
      } else {
        toast.error("Network error", { containerId: "businessInfo" });
      }
    }
  };
  

  const handleCancel = () => {
   
    setFormData(originalBusiness);
setImagePreview(originalImagePreview)
  };

  const getBusinessInfo=async()=>{
    try{
      let token=localStorage.getItem('token')
let response=await axios.get(`${BASE_URL}/getBusiness`,{
  headers:{
    Authorization:`Bearer ${token}`
  }
})

setFormData({
  businessAddress:response.data.business.businessAddress,
  businessName:response.data.business.businessName,
  photo:response.data.business.photo,
  phoneNumber:response.data.business.phoneNumber,
  businessEmail:response.data.business.businessEmail,
  businessId:response.data.business._id,
  website:response.data.business.website
})

setOriginalBusiness({
  businessAddress:response.data.business.businessAddress,
  businessName:response.data.business.businessName,
  photo:response.data.business.photo,
  phoneNumber:response.data.business.phoneNumber,
  businessEmail:response.data.business.businessEmail
})
setImagePreview(response.data.business.photo)
setOriginalImagePreview(response.data.business.photo)
setLoading(false)
    }catch(e){

    }
  }
  useEffect(()=>{
getBusinessInfo()
  },[])



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }
  return (
 <>
<ToastContainer containerId={"businessInfo"}/>


<div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
          <p className="text-gray-600 text-sm mt-1">
            Update your business details that appear on your landing page and business card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Photo</h3>
            <div className="flex flex-col items-center">
              {imagePreview ? (
       
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Business preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
          
                <div
                  {...getRootProps()}
                  className={`w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : uploadError
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <Upload
                      className={`mx-auto mb-2 ${
                        isDragActive ? 'text-blue-500' : uploadError ? 'text-red-500' : 'text-gray-400'
                      }`}
                      size={32}
                    />
                    <span className="text-sm text-gray-600">
                      {isDragActive ? 'Drop here' : 'Upload Photo'}
                    </span>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Recommended: 400×400px, max 5MB
              </p>
              
              {uploadError && (
                <p className="text-xs text-red-500 mt-2 text-center max-w-[200px]">
                  {uploadError}
                </p>
              )}
              
              {imagePreview && (
                <button
                  onClick={removeImage}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Change Image
                </button>
              )}
            </div>
          </div>

        
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mc Donald"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@yourbusiness.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Business Address
            </label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Goethestraße 74, 80336 München"
            />
          </div>
        </div>


        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
 </>
  );
};

export default BusinessInfo;