import React, { useState, useEffect } from 'react';
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './baseurl';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Subscription() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardExpiryError, setCardExpiryError] = useState('');
  const [cardCvcError, setCardCvcError] = useState('');
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [fetchingPlan, setFetchingPlan] = useState(true);

  const location = useLocation();

  useEffect(() => {
    fetchPlans();
  }, []);

  const navigate=useNavigate();

  const fetchPlans = async () => {
    try {
      setFetchingPlan(true);
      let params = new URLSearchParams(location.search);
      let planId = params.get('planId');
      
      const response = await axios.get(`${BASE_URL}/getPlan/${planId}`);
      
      // Store the single plan in an array for the existing UI logic
      if (response.data && response.data.plan) {
        setPlans([response.data.plan]);
        // Auto-select the plan since there's only one
        setSelectedPlan(response.data.plan);
      }
    } catch (error) {
      toast.error('Failed to load plan',{containerId:"subscriptionPage"});
    } finally {
      setFetchingPlan(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    if (!selectedPlan) {
      toast.error('Please select a plan', {containerId:"subscriptionPage"});
      return;
    }
  
    if (!cardholderName.trim()) {
      toast.error('Please enter cardholder name', {containerId:"subscriptionPage"});
      return;
    }
  
    setLoading(true);
  
    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: cardholderName,
        },
      });
  
      if (error) {
        toast.error(error.message, {containerId:"subscriptionPage"});
        setLoading(false);
        return;
      }
  
   
      // Send payment method to your backend
      let token = localStorage.getItem('token')
      const response = await axios.post(`${BASE_URL}/subscribe`, {
        paymentMethod: paymentMethod.id,
        planId: selectedPlan._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        toast.success('Subscription successful!', {containerId:"subscriptionPage"});
        // Reset form
        setCardholderName('');
        setSelectedPlan(null);
        elements.getElement(CardNumberElement).clear();
        elements.getElement(CardExpiryElement).clear();
        elements.getElement(CardCvcElement).clear();
        setTimeout(()=>{
navigate('/admin')
        },1500)
      } else {
        toast.error('Subscription failed. Please try again.', {containerId:"subscriptionPage"});
      }
    } catch (error) {
     
      // Fixed: Access error.response?.data?.error instead of message
      toast.error(error.response?.data?.error || 'An error occurred', {containerId:"subscriptionPage"});
    } finally {
      setLoading(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleCardNumberChange = (event) => {
    setCardNumberError(event.error ? event.error.message : '');
    setCardNumberComplete(event.complete);
  };

  const handleCardExpiryChange = (event) => {
    setCardExpiryError(event.error ? event.error.message : '');
    setCardExpiryComplete(event.complete);
  };

  const handleCardCvcChange = (event) => {
    setCardCvcError(event.error ? event.error.message : '');
    setCardCvcComplete(event.complete);
  };

  const isFormValid = () => {
    return (
      selectedPlan &&
      cardholderName.trim() &&
      cardNumberComplete &&
      cardExpiryComplete &&
      cardCvcComplete &&
      !cardNumberError &&
      !cardExpiryError &&
      !cardCvcError
    );
  };

  return (
   <>
   
   <ToastContainer containerId={"subscriptionPage"}/>


   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscribe to Premium
          </h1>
          <p className="text-lg text-gray-600">
            Choose your plan and start enjoying premium features
          </p>
        </div>

        {fetchingPlan ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plans Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Select a Plan
              </h2>
              {plans.length === 0 ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-600">
                  No plan found. Please check the URL.
                </div>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan._id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan?._id === plan._id
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {plan.planName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.unlimited 
                            ? 'Unlimited Reviews' 
                            : `${plan.reviewsAllowed || 0} Reviews per month`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-gray-500">/month</div>
                      </div>
                    </div>
                    {selectedPlan?._id === plan._id && (
                      <div className="mt-4 flex items-center text-blue-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Payment Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className={`px-4 py-3 border rounded-lg ${
                    cardNumberError ? 'border-red-500' : 'border-gray-300'
                  } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                    <CardNumberElement 
                      options={cardElementOptions}
                      onChange={handleCardNumberChange}
                    />
                  </div>
                  {cardNumberError && (
                    <p className="mt-1 text-sm text-red-600">{cardNumberError}</p>
                  )}
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <div className={`px-4 py-3 border rounded-lg ${
                      cardExpiryError ? 'border-red-500' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                      <CardExpiryElement 
                        options={cardElementOptions}
                        onChange={handleCardExpiryChange}
                      />
                    </div>
                    {cardExpiryError && (
                      <p className="mt-1 text-sm text-red-600">{cardExpiryError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <div className={`px-4 py-3 border rounded-lg ${
                      cardCvcError ? 'border-red-500' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                      <CardCvcElement 
                        options={cardElementOptions}
                        onChange={handleCardCvcChange}
                      />
                    </div>
                    {cardCvcError && (
                      <p className="mt-1 text-sm text-red-600">{cardCvcError}</p>
                    )}
                  </div>
                </div>

                {/* Selected Plan Summary */}
                {selectedPlan && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium capitalize">
                        {selectedPlan.planName} Plan
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        ${selectedPlan.price}/month
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedPlan.unlimited 
                        ? 'Unlimited Reviews' 
                        : `${selectedPlan.reviewsAllowed || 0} Reviews per month`
                      }
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedPlan}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                    loading || !selectedPlan
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Subscribe for $${selectedPlan?.price || '0'}/month`
                  )}
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure payment powered by Stripe
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You'll Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedPlan?.unlimited ? 'Unlimited Reviews' : 'Review Management'}
              </h4>
              <p className="text-gray-600 text-sm">
                {selectedPlan?.unlimited 
                  ? 'Collect unlimited customer reviews' 
                  : `Manage up to ${selectedPlan?.reviewsAllowed || 'multiple'} reviews per month`
                }
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
              <p className="text-gray-600 text-sm">Get detailed insights and reports</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Priority Support</h4>
              <p className="text-gray-600 text-sm">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  );
}