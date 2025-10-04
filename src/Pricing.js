import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './baseurl';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const freeFeatures = [
    'Up to 30 reviews per month',
    'A landing page',
    'A business Card',
    'Basic analytics',
    'QR Code',
    'Reviews Filtering'
  ];

  const premiumFeatures = [
    'Everything in Free',
    'Unlimited Reviews'
  ];

  const faqs = [
    {
      question: 'Can I change plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial of our Premium plan. No credit card required.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
    }
  ];

  useEffect(() => {
    getPlans();
  }, [])

  const getPlans = async () => {
    try {
      setLoading(true);
      let response = await  axios.get(`${BASE_URL}/getPlans`)
      setPlans(response.data.plans);
      setLoading(false);
    } catch (e) {
      toast.error('Failed to load pricing plans');
      setLoading(false);
    }
  }

  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that's right for your business
          </p>
        </div>
      </section>

      <section className="pt-0 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-10">
              {/* Free Plan - Always Static */}
              <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="p-8">
                  <div className="pt-8 text-center">
                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-600">$0</span>
                      <span className="text-gray-500 ml-2">/forever</span>
                    </div>
                    <p className="text-gray-600 mb-8">
                      Perfect for small businesses getting started
                    </p>
                    <button className="w-full h-12 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium mb-8">
                      Get Started Free
                    </button>

                    <ul className="space-y-4 text-left">
                      {freeFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3 py-2">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dynamic Premium Plans */}
              {plans.map((plan, idx) => (
                <div key={plan._id} className="bg-white border-2 border-blue-500 rounded-lg shadow-xl hover:shadow-xl transition-shadow h-full relative">
                  {/* Most Popular Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>Most Popular</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="pt-8 text-center">
                      <h3 className="text-2xl font-bold mb-2 capitalize">{plan.planName}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-blue-600">${plan.price}</span>
                        <span className="text-gray-500 ml-2">/per month</span>
                      </div>
                      <p className="text-gray-600 mb-8">
                        For growing businesses that need more features
                      </p>
                      <button onClick={()=>navigate(`/subscription?planId=${plan._id}`)} className="w-full h-12 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-8">
                        Buy Now
                      </button>

                      <ul className="space-y-4 text-left">
                        {premiumFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3 py-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {plan.unlimited && (
                          <li className="flex items-center space-x-3 py-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 font-semibold">Unlimited Access</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Reviews?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of businesses already using our platform to improve their online reputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="h-12 px-8 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Get Started
            </button>
            <button className="h-12 px-8 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}