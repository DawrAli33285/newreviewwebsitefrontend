import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Layout from './components/layout';
import AdminLayout from './components/adminLayout';
import App from './App';
import Pricing from './Pricing';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import GetStarted from './signup';
import Overview  from './Overview';
import BusinessInfo from './pages/admin/BusinessInfo';
import Analytics from './pages/admin/Analytics';
import Reviews from './pages/admin/Reviews';
import BusinessCard from './pages/admin/BusinessCard';
import SettingsPage from './pages/admin/SettingsPage';
import ReviewPage from './ReviewPage';
import ComplaintPage from './pages/admin/Complaint';
import ScrollUp from './scrollup';
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Subscription from './subscription';
import Middleware from './Middleware';
import ResetPassword from './Resetpassword';
import TermsOfService from './terms';
import PrivacyPolicy from './privacy';
import CookiePolicy from './cookie';
import PrivacyConsentPage from './newtos';


// const stripePromise = loadStripe('pk_test_51OwuO4LcfLzcwwOYdssgGfUSfOgWT1LwO6ewi3CEPewY7WEL9ATqH6WJm3oAcLDA3IgUvVYLVEBMIEu0d8fUwhlw009JwzEYmV');
// const stripePromise = loadStripe('pk_live_51Ns5fCBkmEEICXZiy6ZwvN46z07z0ShtTF7rFqMIG5Jmv87UF8vuhzDZdApeEwV76cD6MzJkZLRFehVVLaa9AKlH00ilY6rQ1a');

const stripePromise = loadStripe('pk_live_51Ns5fCBkmEEICXZiy6ZwvN46z07z0ShtTF7rFqMIG5Jmv87UF8vuhzDZdApeEwV76cD6MzJkZLRFehVVLaa9AKlH00ilY6rQ1a');







const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ScrollUp>
        <Layout />
      </ScrollUp>
    ),
    children: [
      { index: true, element: <App /> },
      { path: "pricing", element: <Pricing /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "get-started", element: <GetStarted /> },
      {path:'subscription',element:<Subscription/>},
      {path:'/forgot-password',element:<ResetPassword/>},
      {path:'/terms',element:<TermsOfService/>},
      {path:'/privacy',element:<PrivacyPolicy/>},
      {path:'/cookie',element:<CookiePolicy/>},
      {path:'/consent', element:<PrivacyConsentPage/>}
    ]
  },
  {
    path: "/admin",
    element: (
      <ScrollUp>
        <Middleware>
          <AdminLayout />
        </Middleware>
      </ScrollUp>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "overview", element: <Overview /> },
      { path: "business-info", element: <BusinessInfo /> },
      { path: "analytics", element: <Analytics /> },
      { path: "reviews", element: <Reviews /> },
      { path: "business-card", element: <BusinessCard /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },  
  { 
    path: "/restaurant/:restaurantName", 
    element: (
      <ScrollUp>
        <ReviewPage />
      </ScrollUp>
    ) 
  },
  { 
    path: "complaint", 
    element: (
      <ScrollUp>
        <ComplaintPage />
      </ScrollUp>
    ) 
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise} >

    <RouterProvider router={router} />
    </Elements>
  </React.StrictMode>
);

reportWebVitals();