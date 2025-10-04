import { useState } from 'react';
import { Mail, Send, MapPin, Clock, Headphones, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from './baseurl';
import { ToastContainer,toast } from 'react-toastify';

export default function Contact() {
    const [loading,setLoading]=useState(false)
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
        if(formData.firstName.length==0){
            toast.error("Please enter your first name",{containerId:"contactUs"})
        return
        }else if(formData.lastName.length==0){
            toast.error("Please enter your last name",{containerId:"contactUs"})
        return;
        }else if(formData.email.length==0){
            toast.error("Please enter your email",{containerId:"contactUs"})
            return
        }else if(formData.subject.length==0){
            toast.error("Please enter subject of the email",{containerId:"contactUs"})
            return
        }else if(formData.message.length==0){
            toast.error("Please enter message of the email",{containerId:"contactUs"})
            return;
        }
try{
    setLoading(true)
let response=await axios.post(`${BASE_URL}/contactUsEmail`,formData)
toast.success("Email sent sucessfully",{containerId:"contactUs"})
setFormData({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    subject: '',
    message: ''
})
setLoading(false)
}catch(e){
if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"contactUs"})
}else{
toast.error("Error occured while sending email",{containerId:"contactUs"})
}
}
    };

    return (
   <>
<ToastContainer containerId={"contactUs"}/>


<div className="min-h-screen bg-white">

<div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about DrikReviews? Need help getting started? Our team is here to help you succeed with your review management.
            </p>
        </div>
    </div>
</div>




<div className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Send className="w-6 h-6 mr-3 text-blue-600" />
                        Send us a Message
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name (Optional)
                            </label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Your Business Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
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
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us how we can help you..."
                                required
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
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

         
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-8 sticky top-24">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                        Office Information
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">Address</p>
                                <p className="text-gray-600 whitespace-pre-line">
                                    123 Business Street, Suite 100
                                    New York, NY 10001
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">Business Hours</p>
                                <p className="text-gray-600 whitespace-pre-line">
                                    Monday - Friday: 9:00 AM - 6:00 PM EST
                                    Saturday: 10:00 AM - 4:00 PM EST
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Headphones className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-1">Support Hours</p>
                                <p className="text-gray-600 whitespace-pre-line">
                                    24/7 Email Support
                                    Phone: Monday - Friday 9:00 AM - 8:00 PM EST
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div className="py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    How quickly do you respond to support requests?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                    We typically respond to email inquiries within 24 hours during business days. For urgent issues, please call our phone support line.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    Can I schedule a demo or consultation?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                    Absolutely! We offer free demos and consultations. Just sign-up, it's FREE.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    What information should I include in my support request?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                    Please include your business name, account email, a detailed description of your issue, and any relevant screenshots or error messages.
                </p>
            </div>
        </div>

        {/* <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                View Full FAQ
            </button>
        </div> */}
    </div>
</div>
</div>

   </>
    );
}