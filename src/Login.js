import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './baseurl';
export default function Login() {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        remember: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const navigate=useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
      
try{
let response=await axios.post(`${BASE_URL}/login`,formData)
localStorage.setItem('token',response.data.token)
localStorage.setItem('user',JSON.stringify(response.data.user))
navigate('/admin/overview')

}catch(e){
    toast.dismiss();
    if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error,{containerId:"login"})
    }else{
        toast.error("Error occured while authenticating",{containerId:"login"})
    }
}
    };

    return (
     <>
     <ToastContainer containerId={"login"}/>




     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
             
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-600">Sign in to access your dashboard</p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">
               
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                             User name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
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

             
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
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

          
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

               
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base h-12"
                        >
                            Sign In
                        </button>

        
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

              
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Don't have an account?</p>
                            <Link 
                                to="/get-started" 
                                className="text-blue-600 hover:text-blue-700 font-medium text-base"
                            >
                                Create new account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
     
     </>
    );
}