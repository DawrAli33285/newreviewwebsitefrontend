import React from 'react';
import { FileText, Shield, Users, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  const sections = [
    {
      number: "1",
      title: "Use of Services",
      content: "You agree to use our platform only for lawful purposes and in accordance with these terms.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      number: "2",
      title: "Accounts",
      content: "You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your login details and for all activity under your account.",
      icon: <Users className="w-5 h-5" />
    },
    {
      number: "3",
      title: "User Content",
      content: "You are responsible for any content you post or share. By submitting content, you grant us a non-exclusive, worldwide license to use, display, and distribute it in connection with providing our services.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      number: "4",
      title: "Prohibited Activities",
      content: "You agree not to:",
      items: [
        "Use the service for unlawful or harmful purposes.",
        "Attempt to interfere with the security or functionality of the platform.",
        "Post false, misleading, or offensive content."
      ],
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      number: "5",
      title: "Intellectual Property",
      content: "All rights, titles, and interests in the platform (excluding user content) belong to us or our licensors.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      number: "6",
      title: "Termination",
      content: "We reserve the right to suspend or terminate your account if you violate these terms.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      number: "7",
      title: "Limitation of Liability",
      content: "To the maximum extent permitted by law, we are not liable for damages resulting from your use of the platform.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      number: "8",
      title: "Changes to Terms",
      content: "We may update these Terms of Service at any time. Continued use after changes means you accept the updated terms.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      number: "9",
      title: "Governing Law",
      content: "These terms shall be governed by applicable laws.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      number: "10",
      title: "Contact Us",
      content: "For questions, please contact us.",
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These Terms of Service govern your use of our platform. By using our services, you agree to these terms.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Terms Sections */}
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

        {/* Footer */}
    
        {/* Additional Info */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Important Notice</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}