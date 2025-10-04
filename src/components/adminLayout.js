import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, BarChart3, MessageSquare, CreditCard, Settings, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [user,setUser]=useState()
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'business-info', label: 'Business Info', icon: Building2, path: '/admin/business-info' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
    { id: 'business-card', label: 'Business Card', icon: CreditCard, path: '/admin/business-card' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  useEffect(()=>{

  },[])

  const getUser=()=>{
    try{
let user=JSON.parse(localStorage.getItem('user'))
setUser(user)
    }catch(e){

    }
  }
  const Sidebar = () => (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full">

      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <div>
            <div className="text-lg font-bold">DrikReviews</div>
            <div className="text-xs text-gray-400">Business Dashboard</div>
          </div>
        </Link>
      </div>


      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                         (item.path === '/admin' && location.pathname === '/admin/overview');
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeMobileMenu}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


     
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <div className="hidden lg:block">
        <Sidebar />
      </div>

     
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

    
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

   
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
           
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find(item => location.pathname === item.path)?.label || 'Overview'}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            
           
          </div>
        </header>

      
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;