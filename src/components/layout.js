import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/pricing", label: "Pricing" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" }
    ];

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">DrikReviews</span>
                        </Link>
                        
                        <div className="hidden lg:flex lg:space-x-8 lg:items-center">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`inline-block py-2 transition-colors font-medium ${
                                            isActive
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-700 hover:text-blue-600"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                          {localStorage.getItem('user')?<p className="cursor-pointer" onClick={()=>{
                            localStorage.removeItem('user')
                            localStorage.removeItem('token')
                            window.location.href="/"
                          }}>Logout</p>:<Link to="/login" className="text-sm px-4 py-2 text-blue-600 rounded-lg ">
                          Login
                      </Link>}
                          {localStorage.getItem('token')?  <Link to="/admin" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                               Dashboard
                            </Link>:  <Link to="/get-started" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Get Started
                            </Link>}
                        </div>

                        <button 
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

 
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300"
                    onClick={closeMobileMenu}
                />
            )}

       
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                   
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">DrikReviews</span>
                        </div>
                        <button 
                            className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={closeMobileMenu}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-1 mb-8">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={closeMobileMenu}
                                        className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                                            isActive
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-200">
                            <Link 
                                to="/login" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-center text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/get-started" 
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600 text-center">
                            © 2025 Drik Reviews
                        </p>
                    </div>
                </div>
            </div>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-12">

                        <div className="md:col-span-12 lg:col-span-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">D</span>
                                </div>
                                <span className="text-xl font-bold text-white">DrikReviews</span>
                            </div>
                            <p className="text-gray-300 mb-6">
                                Transform your business reviews with our smart filtering system. Enhance your online reputation while gathering valuable customer feedback.
                            </p>
                        </div>

                        <div className="md:col-span-12 lg:col-span-6">
                            <h5 className="text-white font-semibold mb-6">Quick Links</h5>
                            <div className="space-y-3">
                                <Link to="/" className="block text-gray-300 hover:text-blue-400 transition-colors">
                                    Home
                                </Link>
                                <Link to="/pricing" className="block text-gray-300 hover:text-blue-400 transition-colors">
                                    Pricing
                                </Link>
                                <Link to="/about" className="block text-gray-300 hover:text-blue-400 transition-colors">
                                    About
                                </Link>
                                <Link to="/contact" className="block text-gray-300 hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                                {localStorage.getItem('user')?<p className="cursor-pointer" onClick={()=>{
                            localStorage.removeItem('user')
                            localStorage.removeItem('token')
                            window.location.href="/"
                          }}>Logout</p>:<Link to="/login" className="block text-gray-300 hover:text-blue-400 transition-colors">
                          Login
                      </Link>}
                               
                                {/* <Link to="/admin" className="block text-gray-300 hover:text-blue-400 transition-colors">
                                    Admin Access
                                </Link> */}
                            </div>
                        </div>

                   
                        <div className="md:col-span-12 lg:col-span-6">
                            <h5 className="text-white font-semibold mb-6">Contact Info</h5>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="text-gray-300">info@predictive-reviews.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-center md:text-left">
                                © 2025 Drik Reviews. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
                                <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Terms of Service
                                </Link>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Cookie Policy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}