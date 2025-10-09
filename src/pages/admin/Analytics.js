import React, { useEffect, useState } from 'react';
import { Eye, MessageSquare, Star, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { BASE_URL } from '../../baseurl';
const Analytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    totalReviews: 0,
    avgRating: 0,
    growthRate: 0,
    performanceData: [],
    trafficSources: [],
    monthlyComparison: [],
    ratingDistribution: [],
  });

  const getReviews = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getAnalyticsReviews`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const reviewsData = response.data.reviews;
      
     
      setReviews(reviewsData);
      processAnalytics(reviewsData);
      setLoading(false);
    } catch (e) {
     
      setLoading(false);
    }
  };

  const processAnalytics = (reviewsData) => {
    // Calculate total reviews
    const totalReviews = reviewsData.length;

    // Calculate average rating
    const avgRating = totalReviews > 0
      ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

    // Calculate rating distribution
    const ratingDist = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviewsData.filter(r => r.rating === rating).length
    }));

    // Process reviews by date for performance data
    const reviewsByDate = {};
    reviewsData.forEach(review => {
      const date = new Date(review.createdAt).toISOString().split('T')[0];
      reviewsByDate[date] = (reviewsByDate[date] || 0) + 1;
    });

    const performanceData = Object.entries(reviewsByDate)
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-21); // Last 21 data points

    // Calculate traffic sources
    const sourceCounts = reviewsData.reduce((acc, review) => {
      const source = review.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const totalSources = Object.values(sourceCounts).reduce((a, b) => a + b, 0);
    const sourceColors = {
      direct: '#3b82f6',
      qrcode: '#10b981',
      website: '#f59e0b',
      social: '#6366f1',
    };

    const trafficSources = Object.entries(sourceCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / totalSources) * 100),
      color: sourceColors[name] || '#94a3b8'
    }));

    // Monthly comparison
    const monthlyData = {};
    reviewsData.forEach(review => {
      const month = new Date(review.createdAt).toLocaleString('en-US', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const monthlyComparison = Object.entries(monthlyData).map(([month, visits]) => ({
      month,
      visits
    }));

    // Calculate growth rate (mock calculation based on reviews)
    const currentMonthReviews = reviewsData.filter(r => {
      const reviewDate = new Date(r.createdAt);
      const now = new Date();
      return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
    }).length;

    const lastMonthReviews = reviewsData.filter(r => {
      const reviewDate = new Date(r.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return reviewDate.getMonth() === lastMonth.getMonth() && reviewDate.getFullYear() === lastMonth.getFullYear();
    }).length;

    const growthRate = lastMonthReviews > 0
      ? (((currentMonthReviews - lastMonthReviews) / lastMonthReviews) * 100).toFixed(1)
      : 0;

    setAnalytics({
      totalVisits: totalReviews * 23, // Mock calculation
      totalReviews,
      avgRating,
      growthRate,
      performanceData,
      trafficSources,
      monthlyComparison,
      ratingDistribution: ratingDist,
    });
  };

  useEffect(() => {
    getReviews();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center lg:flex-row flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Metrics</h1>
              <p className="text-gray-600">Detailed insights about your business performance and customer feedback.</p>
            </div>
            <div className="flex lg:flex-row flex-col lg:gap-0 gap-[10px] items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Visits</span>
              <Eye className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalVisits}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Reviews</span>
              <MessageSquare className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalReviews}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Average Rating</span>
              <Star className="text-yellow-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900 flex items-center">
              {analytics.avgRating}
              <span className="text-lg text-gray-500 ml-1">/ 5</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Growth Rate</span>
              <TrendingUp className={`${parseFloat(analytics.growthRate) >= 0 ? 'text-green-500' : 'text-red-500'}`} size={20} />
            </div>
            <div className={`text-3xl font-bold ${parseFloat(analytics.growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(analytics.growthRate) >= 0 ? '+' : ''}{analytics.growthRate}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Trends</h3>
            {analytics.performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    tickFormatter={(date) => new Date(date).getDate()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Sources</h3>
            {analytics.trafficSources.length > 0 ? (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.trafficSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {analytics.trafficSources.map((source) => (
                    <div key={source.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-sm text-gray-700">{source.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Reviews</h3>
          {reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Review #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer Name
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.slice(0, 5).map((review, index) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {review.reviewBy && review.reviewBy[0] ? review.reviewBy[0].name || 'Anonymous' : 'Anonymous'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-900">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 line-clamp-1">{review.description}</span>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {analytics.ratingDistribution.map((item) => {
                const maxCount = Math.max(...analytics.ratingDistribution.map(r => r.count), 1);
                return (
                  <div key={item.rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${item.count > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Comparison</h3>
            {analytics.monthlyComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="visits" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;