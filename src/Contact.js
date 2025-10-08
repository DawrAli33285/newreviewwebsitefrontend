import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

export default function Contact() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        
        if(formData.firstName.length === 0){
            alert("Please enter your first name");
            return;
        } else if(formData.lastName.length === 0){
            alert("Please enter your last name");
            return;
        } else if(formData.email.length === 0){
            alert("Please enter your email");
            return;
        } else if(formData.subject.length === 0){
            alert("Please enter subject of the email");
            return;
        } else if(formData.message.length === 0){
            alert("Please enter message of the email");
            return;
        }
        
        try {
            setLoading(true);
            // Your API call here
            await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Email sent sucessfully",{containerId:"contactPage"})
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                businessName: '',
                subject: '',
                message: ''
            });
            setLoading(false);
        } catch(e) {
            alert("Error occurred while sending email");
            setLoading(false);
        }
    };

    return (
    <>
    
    <ToastContainer containerId={"contactPage"}/>
    <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Contact Us
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Have questions about Us? Need help getting started? Our team is here to help you succeed with your review management.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Form Section - Centered */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                            <Send className="w-6 h-6 mr-3 text-blue-600" />
                            Send us a Message
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="Your Business Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="demo">Request Demo</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can help you..."
                                    rows="6"
                                    maxLength="1000"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                                <p className="text-sm text-gray-500 mt-2 text-right">
                                    {formData.message.length} / 1000
                                </p>
                            </div>

                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}