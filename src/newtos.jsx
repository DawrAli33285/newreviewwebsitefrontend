import React from 'react';
import { Mail, Shield, Lock, CheckCircle } from 'lucide-react';

export default function PrivacyConsentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy & Consent</h1>
          <p className="text-lg text-gray-600">Your privacy matters to us</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Communication Consent</h2>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Email Consent Section */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Receive Updates & Offers</h3>
                <p className="text-gray-700 leading-relaxed">
                  By entering your email address and checking the box you agree to receive further emails from us about our latest news, resources, and exclusive offers.
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Data is Protected</h3>
                <p className="text-gray-700 leading-relaxed">
                  We value your privacy. Your personal data will be processed and stored securely in accordance to the law. We will never sell or share your information with third parties without your explicit consent.
                </p>
              </div>
            </div>

            {/* Unsubscribe Section */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Unsubscribe</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can unsubscribe or change your preferences at any time by sending us an email at{' '}
                  <a 
                    href="mailto:info@predictive-reviews.com?subject=Unsubscribe" 
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = 'mailto:info@predictive-reviews.com?subject=Unsubscribe';
                    }}
                  >
                    info@predictive-reviews.com
                  </a>
                  {' '}and write "unsubscribe".
                </p>
              </div>
            </div>

            {/* Highlighted Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Your Rights</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Right to access your personal data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Right to request correction or deletion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Right to withdraw consent at any time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Right to object to data processing</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Us</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about our privacy practices or wish to exercise your rights:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  <a 
                    href="mailto:info@predictive-reviews.com" 
                    className="text-blue-600 hover:text-blue-700 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = 'mailto:info@predictive-reviews.com';
                    }}
                  >
                    info@predictive-reviews.com
                  </a>
                </p>
                <p>
                  <span className="font-medium">Data Controller:</span> Da-Marketing
                </p>
                <p>
                  <span className="font-medium">Legal Basis:</span> Consent (Article 6(1)(a) GDPR)
                </p>
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
}