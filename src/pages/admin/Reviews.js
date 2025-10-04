import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Star, Search, Download, Trash2, Check, X, Eye } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../baseurl';
import { toast, ToastContainer } from 'react-toastify';
const ReviewManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalReviews = reviews.length;
  const directlinkReviews =reviews?.filter(r => r?.source === 'directlink')?.length;
  const approvedReviews = reviews?.filter(r => r?.status === 'approved')?.length;
  const qrReviews = reviews?.filter(r => r?.source === 'qrcode')?.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const handleApprove = (reviewId) => {
    setReviews(reviews.map(review => 
      review._id === reviewId ? { ...review, status: 'approved' } : review
    ));
  };

  const handleDelete =async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
    try{
let response=await axios.delete(`${BASE_URL}/deleteReview/${reviewId}`)
toast.success(response.data.message,{containerId:"reviewTablePage"})
setReviews(reviews.filter(review => review._id !== reviewId));
    }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"reviewTablePage"})
}else{
  toast.error("Error occured while deleting review",{containerId:"reviewTablePage"})
}
    }
    }
  };

  const handleBulkAction = async(action) => {
    if (selectedReviews.length === 0) {
      alert('Please select reviews first');
      return;
    }

    if (action === 'approve') {
      setReviews(reviews.map(review => 
        selectedReviews.includes(review._id) ? { ...review, status: 'approved' } : review
      ));
      setSelectedReviews([]);
    } else if (action === 'delete') {
      console.log(selectedReviews)
      if (window.confirm(`Are you sure you want to delete ${selectedReviews.length} review(s)?`)) {
      try{
 let response=await axios.post(`${BASE_URL}/bulkdelete`,selectedReviews)
        setReviews(reviews.filter(review => !selectedReviews.includes(review._id)));
        setSelectedReviews([]);
        toast.success(response.data.message,{containerId:"reviewTablePage"})
      }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"reviewTablePage"})
}else{
  toast.error("Error occured while deleting reviews",{containerId:"reviewTablePage"})
}
      }
      }
    }
  };

  const toggleSelectReview = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(r => r._id));
    }
  };

  const exportReviews = () => {
    const csv = [
      ['Customer', 'Email', 'Rating', 'Comment', 'Date', 'Source', 'Status'],
      ...reviews.map(r => [
        r.reviewBy && r.reviewBy[0] ? r.reviewBy[0].name || 'Anonymous' : 'Anonymous',
        r.reviewBy && r.reviewBy[0] ? r.reviewBy[0].email || 'N/A' : 'N/A',
        r.rating,
        r.description,
        new Date(r.createdAt).toLocaleDateString(),
        r.source,
        r.status || 'approved'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reviews.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredReviews = reviews.filter(review => {
    const customerName = review.reviewBy && review.reviewBy[0] ? review.reviewBy[0].name || '' : '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'all' || (review.status || 'approved') === filterStatus;
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getReviews`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews(response.data.reviews);
      
      // Sample data for demonstration
  
    
      setLoading(false);
    } catch (e) {
      console.error('Error fetching reviews:', e);
      setLoading(false);
    }
  };

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

<ToastContainer containerId={"reviewTablePage"}/>



<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
          <p className="text-gray-600">Manage customer reviews, respond to feedback, and monitor your business reputation.</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Reviews</span>
              <MessageSquare className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalReviews}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Qr source reviews</span>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{qrReviews}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Direct link source</span>
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{directlinkReviews}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Avg Rating</span>
              <Star className="text-purple-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900 flex items-center">
              {avgRating}
              <span className="text-lg text-gray-500 ml-1">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

             
            </div>

            <button
              onClick={exportReviews}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>

          {selectedReviews.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {selectedReviews.length} selected
              </span>
           
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex items-center space-x-1"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review._id)}
                          onChange={() => toggleSelectReview(review._id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.reviewBy && review.reviewBy[0] ? review.reviewBy[0].name || 'Anonymous' : 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.reviewBy && review.reviewBy[0] ? review.reviewBy[0].email || 'N/A' : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-900">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">{review.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 capitalize">{review.source}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          (review.status || 'approved') === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(review.status || 'approved').charAt(0).toUpperCase() + (review.status || 'approved').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {(review.status || 'approved') === 'pending' && (
                            <button
                              onClick={() => handleApprove(review._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
</>
  );
};

export default ReviewManagement;