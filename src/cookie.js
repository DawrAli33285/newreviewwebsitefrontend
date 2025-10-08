import React from 'react';
import { Cookie, Info, Layers, Users, Settings, FileText, Mail } from 'lucide-react';

export default function CookiePolicy() {
  const sections = [
    {
      number: "1",
      title: "What Are Cookies?",
      content: "Cookies are small text files stored on your device when you visit a website. They help us improve your experience by remembering preferences and analyzing site traffic.",
      icon: <Info className="w-5 h-5" />
    },
    {
      number: "2",
      title: "Types of Cookies We Use",
      items: [
        {
          title: "Essential Cookies:",
          desc: "Necessary for the platform to function."
        },
        {
          title: "Performance Cookies:",
          desc: "Help us understand how visitors use the site."
        },
        {
          title: "Functional Cookies:",
          desc: "Remember your preferences and settings."
        },
        {
          title: "Advertising Cookies:",
          desc: "May be used to deliver relevant ads (if applicable)."
        }
      ],
      icon: <Layers className="w-5 h-5" />
    },
    {
      number: "3",
      title: "Third-Party Cookies",
      content: "We may allow third-party service providers to use cookies for analytics or advertising purposes.",
      icon: <Users className="w-5 h-5" />
    },
    {
      number: "4",
      title: "Managing Cookies",
      content: "Most browsers allow you to control cookies through settings. You can accept, reject, or delete cookies at any time. Please note that disabling cookies may affect site functionality.",
      icon: <Settings className="w-5 h-5" />
    },
    {
      number: "5",
      title: "Updates to this Policy",
      content: "We may update this Cookie Policy periodically. Any changes will be posted with a new effective date.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      number: "6",
      title: "Contact Us",
      content: "If you have any questions about this Cookie Policy, please contact us.",
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const cookieTypes = [
    {
      name: "Essential",
      icon: <Cookie className="w-5 h-5" />,
      color: "bg-red-100 text-red-600",
      description: "Required for basic functionality"
    },
    {
      name: "Performance",
      icon: <Layers className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      description: "Track site usage and analytics"
    },
    {
      name: "Functional",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      description: "Remember your preferences"
    },
    {
      name: "Advertising",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      description: "Deliver relevant content"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This Cookie Policy explains how we use cookies and similar technologies when you visit our platform.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Cookie Types Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {cookieTypes.map((type, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${type.color} mb-3`}>
                {type.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Cookie Policy Sections */}
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
                  {section.content && (
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  )}
                  {section.items && (
                    <ul className="mt-3 space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>{item.title}</strong> {item.desc}
                          </span>
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
        <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Cookie className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Cookie Preferences</h3>
              <p className="text-sm text-orange-800 leading-relaxed mb-3">
                You have control over your cookie preferences. You can manage or disable cookies through your browser settings at any time. Keep in mind that some features may not work properly if cookies are disabled.
              </p>
            
            </div>
          </div>
        </div>

        {/* Browser Help Links */}
    
      </div>
    </div>
  );
}