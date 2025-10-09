import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Link2, Copy, QrCode, CreditCard, X, Download } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import QRCode from 'qrcode';
import { BASE_URL, FRONTEND_URL } from './baseurl';

const Overview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const qrCanvasRef = useRef(null);
  const [overviewData, setOverviewdata] = useState({
    reviews: 0,
    user: '',
    thisMonthReviews: 0
  });
  const [reviewLink, setReviewLink] = useState("https://only-good-reviews.com/restaurant/mc-donald");
  const [businessName, setBusinessName] = useState("Mc Donald");

  const generateQRCode = async () => {
    if (!qrCanvasRef.current) return;
    
    try {
      // Generate real QR code using qrcode library
      await QRCode.toCanvas(qrCanvasRef.current, reviewLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code', { containerId: "overview" });
    }
  };

  const downloadQRCode = () => {
    if (!qrCanvasRef.current) return;
    
    const canvas = qrCanvasRef.current;
    const link = document.createElement('a');
    link.download = `${businessName.replace(/\s+/g, '-')}-QR-Code.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const openQRModal = () => {
    setShowQRModal(true);
    // Small delay to ensure modal is rendered before generating QR code
    setTimeout(() => generateQRCode(), 100);
  };

  const copyToClipboard = () => {
    let directLink=reviewLink+'?source=directlink'
    navigator.clipboard.writeText(directLink).then(() => {
      toast.dismiss();
      toast.success('URL copied to clipboard!', { containerId: "overview" });
    }).catch(() => {
      toast.dismiss();
      toast.error('Failed to copy URL', { containerId: "overview" });
    });
  };

  const getOverview = async () => {
    try {
      let token = localStorage.getItem('token');
      let response = await axios.get(`${BASE_URL}/getOverview`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

     
      setOverviewdata({
        user: response.data.user,
        reviews: response.data.reviews,
        thisMonthReviews: response.data.thisMonthReviews
      });
      
      // Set business name from response if available
      if (response.data.user?.business?.businessName) {
        setBusinessName(response.data.user.business.businessName);
      }
      
      setReviewLink(`${FRONTEND_URL}/restaurant/${response.data.user.business.businessName}`);
      setLoading(false);
    } catch (e) {
      if (e?.response?.data?.error) {
        toast.error(e?.response?.data?.error, { containerId: "overview" });
      } else {
        toast.error("Error occurred while fetching data", { containerId: "overview" });
      }
    }
  };

  useEffect(() => {
    getOverview();
  }, []);

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
      <ToastContainer containerId={"overview"} />

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600 text-sm mb-6">Access your key features instantly</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => window.open(reviewLink+'?source=directlink', '_blank')}
              className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Link2 size={20} className="text-blue-600" />
              <span className="font-medium text-blue-600">View Landing Page</span>
            </button>
            <button
              onClick={() => navigate('/admin/business-card')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard size={20} className="text-gray-700" />
              <span className="font-medium text-gray-700">Business Card</span>
            </button>
            <button
              onClick={openQRModal}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <QrCode size={20} className="text-gray-700" />
              <span className="font-medium text-gray-700">Generate QR Code</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <span>Welcome back!</span>
            <span>👋</span>
          </h2>
          <p className="text-gray-600 mb-6">Here's what's happening with your business reviews today.</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => window.open(reviewLink+'?source=directlink', '_blank')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Link2 size={16} />
              <span>View Landing Page</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Copy size={16} />
              <span>Copy URL</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Visits</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-green-600 mr-2">👁️</span>
                {overviewData?.user?.business?.visitCount ? overviewData?.user?.business?.visitCount?.toString() : '0'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-green-600 mr-2">💬</span>
                {overviewData?.reviews[0]?.totalReviews ? overviewData?.reviews[0]?.totalReviews : '0'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Average Rating</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-yellow-500 mr-2">⭐</span>
                {overviewData?.reviews[0]?.averageRating?.toFixed(1) ? overviewData?.reviews[0]?.averageRating?.toFixed(1) : '0'} / 5.0
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">This Month</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-blue-600 mr-2">📊</span>
                {overviewData?.thisMonthReviews[0]?.reviewsThisMonth?.toString() ? overviewData?.thisMonthReviews[0]?.reviewsThisMonth?.toString() : '0'}/30
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Review Usage</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reviews Used This Month</span>
              <span className="font-semibold text-gray-900">
                {overviewData?.thisMonthReviews[0]?.reviewsThisMonth?.toString() ? overviewData?.thisMonthReviews[0]?.reviewsThisMonth?.toString() : '0'} / {overviewData?.user?.
subscription?.planId?.reviewsAllowed?overviewData?.user?.
reviewsUser+overviewData?.thisMonthReviews[0]?.reviewsThisMonth:'30'}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
  className="bg-blue-600 h-full rounded-full transition-all duration-300"
  style={{
    width: `${Math.min(
      (
        (
          (overviewData?.user?.subscription?.planId?.reviewsAllowed
            ? (overviewData?.user?.reviewsUser || 0) +
              (overviewData?.thisMonthReviews?.[0]?.reviewsThisMonth || 0)
            : overviewData?.thisMonthReviews?.[0]?.reviewsThisMonth || 0)
        ) / 30
      ) * 100,
      100
    )}%`,
  }}
></div>

            </div>

            <div className="text-right text-sm text-gray-500">
  {Math.min(
    Math.round(
      ((overviewData?.thisMonthReviews?.[0]?.reviewsThisMonth || 0) /
        (overviewData?.user?.subscription?.planId?.reviewsAllowed || 30)) *
        100
    ),
    100
  )}%
</div>

          </div>
        </div>

      {overviewData?.user?.subscription?'':  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Unlock Premium Features</h2>
          <p className="text-gray-600 mb-6">
            Get unlimited reviews, advanced analytics, and priority support with our Premium plan.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Upgrade to Premium
          </button>
        </div>}

        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <QrCode size={24} className="text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">QR Code for Reviews</h3>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{businessName}</h4>

                <div className="flex justify-center mb-4">
                  <canvas
                    ref={qrCanvasRef}
                    className="border-4 border-gray-200 rounded-lg"
                    style={{ maxWidth: '300px', width: '100%', height: 'auto' }}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">Scan to leave us a review!</p>
                <p className="text-xs text-gray-500 mb-6 break-all">{reviewLink}</p>

                <button
                  onClick={downloadQRCode}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  <Download size={20} />
                  <span className="font-medium">Download QR Code</span>
                </button>

                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Usage Tips:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Print and display at your business location</li>
                    <li>• Share on social media and email signatures</li>
                    <li>• Include in business cards and receipts</li>
                    <li>• Perfect for table tents and counter displays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Overview;