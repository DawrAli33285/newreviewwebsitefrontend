import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
     
     <section className="bg-gradient-to-br from-blue-50 to-blue-100 pt-20 pb-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Main Text Content */}
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        Manage Your Business Reviews Like a Pro
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Create beautiful landing pages, collect customer reviews, and boost your online reputation with our powerful review management platform.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/get-started" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
          Get Started Free
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a href="/pricing" className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-lg font-medium shadow-md hover:shadow-lg">
          Pricing
        </a>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        No credit card required • 30 reviews included • Setup in 2 minutes
      </p>
    </div>

    {/* Videos Side by Side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto">
      
      {/* Video 1 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo 1
          </h3>
        </div>
        <div className="aspect-video bg-gray-900">
          <iframe 
            width="100%" 
            height="100%" 
            style={{border: 0}} 
            scrolling="no" 
            src="https://go.screenpal.com/player/cT613anDPiT?width=100%&height=100%&ff=1&title=0" 
            allowFullScreen={true}
            title="Animation Video 1"
          />
        </div>
        <div className="px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">See how easy it is to get started</p>
        </div>
      </div>

      {/* Video 2 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo 2
          </h3>
        </div>
        <div className="aspect-video bg-gray-900">
          <iframe 
            width="100%" 
            height="100%" 
            style={{border: 0}} 
            scrolling="no" 
            src="https://go.screenpal.com/player/cT613gnDPid?width=100%&height=100%&ff=1&title=0" 
            allowFullScreen={true}
            title="Animation Video 2"
          />
        </div>
        <div className="px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">Explore powerful features</p>
        </div>
      </div>
    </div>

  </div>
</section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create beautiful landing pages, collect customer reviews, and boost your online reputation with our powerful review management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Beautiful Landing Pages</h4>
              <p className="text-gray-600">
                Create stunning, mobile-responsive landing pages that encourage customers to leave reviews.
              </p>
            </div>

    
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Review Management</h4>
              <p className="text-gray-600">
                Easily manage, approve, and respond to customer reviews from one central dashboard.
              </p>
            </div>

            
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Analytics & Insights</h4>
              <p className="text-gray-600">
                Track your reputation with detailed analytics and insights about your review performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
     
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <div className="space-y-4">
                {[
                  'Custom business landing pages with QR codes',
                  'Professional business card design and printing',
                  'Detailed analytics and review tracking',
                  'Direct Google Reviews integration',
                  'Private feedback management system',
                  'Multi-language and currency support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          
            <div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Join thousands of businesses that trust us with their review management
                </p>
                <Link to="get-started" className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
                 Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}