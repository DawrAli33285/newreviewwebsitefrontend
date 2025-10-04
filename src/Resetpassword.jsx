import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, KeyRound } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './baseurl';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        userName: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const navigate = useNavigate();
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match", { containerId: "reset" });
            return;
        }

        // Validate password strength (optional)
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long", { containerId: "reset" });
            return;
        }

        try {
            let response = await axios.patch(`${BASE_URL}/updatePassword`, {
                userName: formData.userName,
                newPassword: formData.newPassword
            });
            
            toast.success("Password reset successfully!", { containerId: "reset" });
            
            // Redirect to login after successful reset
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
            console.log(response.data);
        } catch(e) {
            console.log(e.message)
            toast.dismiss();
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "reset" });
            } else {
                toast.error("Error occurred while resetting password", { containerId: "reset" });
            }
        }
    };

    return (
        <>
            <ToastContainer containerId={"reset"} />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                        
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                            <p className="text-gray-600">Enter your username and new password</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Username Field */}
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                                    User name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        placeholder="Enter your user name"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    />
                                </div>
                            </div>

                            {/* New Password Field */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter your new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base h-12"
                            >
                                Reset Password
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            {/* Back to Login Link */}
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Remember your password?</p>
                                <Link 
                                    to="/login" 
                                    className="text-blue-600 hover:text-blue-700 font-medium text-base"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}