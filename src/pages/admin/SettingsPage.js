import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../baseurl';
import { toast, ToastContainer } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {useNavigate} from 'react-router-dom'

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: false,
    reviews: false,
    weekly: false,
    marketing: false
  });

  const [loading,setLoading]=useState(true)

  const [user, setUser] = useState({});
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
    userName:''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [reviews, setReview] = useState([]);

const navigate=useNavigate();

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      let token = localStorage.getItem('token');
      let response = await axios.get(`${BASE_URL}/getAllData`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReview(response.data.reviews);
      setUser(response.data.user);
      setPasswords({
        current:response.data.user.password,
        userName:response.data.user.userName
      })
      setLoading(false)
      console.log(response.data);
    } catch (e) {
      toast.error('Failed to load user data',{containerId:"settingsPage"});
    }
  };

  const updatePassword = async () => {
    try {
      // Validation
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        toast.error('Please fill in all password fields',{containerId:"settingsPage"});
        return;
      }

      if (passwords.new !== passwords.confirm) {
        toast.error('New passwords do not match',{containerId:"settingsPage"});
        return;
      }

      if (passwords.new.length < 6) {
        toast.error('New password must be at least 6 characters',{containerId:"settingsPage"});
        return;
      }

      let token = localStorage.getItem('token');
      let response = await axios.patch(`${BASE_URL}/updatePassword`, passwords, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Password updated successfully',{containerId:"settingsPage"});
      setPasswords({ current: '', new: '', confirm: '' });
      getUserData();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Failed to update password',{containerId:"settingsPage"});
    }
  };

  const exportDataToPDF = () => {
    try {
      console.log('Starting PDF export...');
      console.log('User data:', user);
      console.log('Reviews data:', reviews);
  
      // Check if jsPDF is available
      if (typeof jsPDF === 'undefined') {
        toast.error('PDF library not loaded. Please refresh the page.',{containerId:"settingsPage"});
        return;
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('Account Data Export', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
      let yPosition = 50;
  
      // User Information Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Account Information', 14, yPosition);
      yPosition += 10;
  
      // Use autoTable as a function passing doc as first parameter
      autoTable(doc, {
        startY: yPosition,
        head: [['Field', 'Value']],
        body: [
          ['Username', user.userName || 'N/A'],
          ['Business Name', user.business?.businessName || 'N/A'],
          ['Business Address', user.business?.businessAddress || 'N/A'],
          ['Business Email', user.business?.businessEmail || 'N/A'],
          ['Phone Number', user.business?.phoneNumber || 'N/A'],
          ['Website', user.business?.website || 'N/A'],
          ['Total Reviews', user.reviewsUser || '0'],
          ['Account Created', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'],
          ['Last Updated', user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A']
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          fontSize: 11,
          fontStyle: 'bold',
          textColor: [255, 255, 255]
        },
        bodyStyles: {
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });
  
      yPosition = doc.lastAutoTable.finalY + 15;
  
      // Reviews Section
      if (reviews && reviews.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
  
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Customer Reviews', 14, yPosition);
        yPosition += 10;
  
        const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Reviews: ${reviews.length} | Average Rating: ${avgRating}/5`, 14, yPosition);
        yPosition += 5;
  
        const reviewsData = reviews.map((review, index) => [
          index + 1,
          `${review.rating}/5`, // Simple numeric rating instead of stars
          review.description || 'No comment',
          review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'
        ]);
  
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Rating', 'Feedback', 'Date']],
          body: reviewsData,
          theme: 'striped',
          headStyles: {
            fillColor: [59, 130, 246],
            fontSize: 10,
            fontStyle: 'bold',
            textColor: [255, 255, 255]
          },
          bodyStyles: {
            fontSize: 9
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 25 }, // Reduced width since we're just showing numbers
            2: { cellWidth: 105 }, // Increased width for feedback
            3: { cellWidth: 35 }
          },
          margin: { left: 14, right: 14 }
        });
      }
  
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
  
      const fileName = `${user.userName || 'account'}_data_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('PDF exported successfully');
      toast.success('Data exported successfully!',{containerId:"settingsPage"});
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data: ' + error.message,{containerId:"settingsPage"});
    }
  };


const deleteUser=async()=>{
  try{
    let token=localStorage.getItem('token')
let response=await axios.delete(`${BASE_URL}/deleteUser/${user._id}`,{
  headers:{
    Authorization:`Bearer ${token}`
  }
})
toast.success("User deleted sucessfully",{containerId:"settingPage"})

setTimeout(()=>{
window.location.href="/"
},1500)
  }catch(e){
    if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"settingsPage"})
    }else{
toast.error("Error occured while deleting user",{containerId:"settingsPage"})
    }
  }
}


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
      <ToastContainer containerId={"settingsPage"} />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your account preferences, security settings, and data.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={updatePassword} className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h3>
                <p className="text-sm text-gray-600 mb-4">Download a copy of all your business data, reviews, and analytics.</p>
                <button 
                  onClick={exportDataToPDF}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Data
                </button>
              </div>

              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Delete Account</h3>
                <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={deleteUser} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;