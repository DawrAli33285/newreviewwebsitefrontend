import React from 'react';
import { Shield, Lock, Eye, Database, Share2, Cookie, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      number: "1",
      title: "Information We Collect",
      content: "We may collect the following types of information:",
      items: [
        "Information you provide directly (such as name, email address, or contact details).",
        "Information automatically collected (such as browser type, IP address, and usage data).",
        "Information from cookies and similar technologies."
      ],
      icon: <Database className="w-5 h-5" />
    },
    {
      number: "2",
      title: "How We Use Your Information",
      content: "We may use your information to:",
      items: [
        "Provide, operate, and improve our services.",
        "Communicate with you about updates, offers, or support.",
        "Ensure compliance with our Terms of Service.",
        "Analyze usage trends to improve user experience."
      ],
      icon: <Eye className="w-5 h-5" />
    },
    {
      number: "3",
      title: "Sharing of Information",
      content: "We do not sell your personal information. We may share information with:",
      items: [
        "Service providers who help operate our platform.",
        "Legal authorities when required by law.",
        "Business partners in case of merger, acquisition, or transfer of assets."
      ],
      icon: <Share2 className="w-5 h-5" />
    },
    {
      number: "4",
      title: "Cookies and Tracking",
      content: "We use cookies to enhance functionality and analyze traffic. See our Cookie Policy for details.",
      icon: <Cookie className="w-5 h-5" />
    },
    {
      number: "5",
      title: "Data Security",
      content: "We use reasonable measures to protect your information, but no method of transmission or storage is 100% secure.",
      icon: <Lock className="w-5 h-5" />
    },
    {
      number: "6",
      title: "Your Rights",
      content: "Depending on your location, you may have rights to access, update, or delete your personal information. Please contact us for assistance.",
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      number: "7",
      title: "Changes to this Policy",
      content: "We may update this Privacy Policy from time to time. Changes will be posted here with an updated effective date.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      number: "8",
      title: "Contact Us",
      content: "If you have any questions, please contact us.",
      icon: <Mail className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {sections.map((section, index) => (
            <div 
              key={section.number}
              className={`p-6 sm:p-8 ${index !== sections.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  {section.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-blue-600">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    {section.content}
                  </p>
                  {section.items && (
                    <ul className="mt-3 space-y-2">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Additional Info */}
        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Your Data is Protected</h3>
              <p className="text-sm text-green-800 leading-relaxed">
                We are committed to protecting your privacy and ensuring the security of your personal information. We implement industry-standard security measures and regularly review our practices to keep your data safe.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Rights Card */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Transparency</h4>
            </div>
            <p className="text-sm text-gray-600">Clear information about data collection</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Your Control</h4>
            </div>
            <p className="text-sm text-gray-600">Manage your data preferences anytime</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Security First</h4>
            </div>
            <p className="text-sm text-gray-600">Industry-standard protection measures</p>
          </div>
        </div>
      </div>
    </div>
  );
}