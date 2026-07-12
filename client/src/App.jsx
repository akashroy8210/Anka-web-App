import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Surprises from './pages/Surprises';
import CategoryPage from './pages/CategoryPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import OnDemand from './pages/OnDemand';
import AdminDashboard from './apps/admin/AdminPage';
import CustomerMiniPanel from './pages/CustomerMiniPanel';
import SurpriseSite from './pages/SurpriseSite';
import ClientLiveControl from './pages/ClientLiveControl';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';

function AppContent() {
  const location = useLocation();
  
  // Hide Navbar/Footer completely on recipient live pages
  const isLiveSurprisePage = location.pathname.startsWith('/s/') || location.pathname.startsWith('/control/');
  
  // Hide global footer in Dashboards & Checkout Success
  const isDashboardView = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/customizer') || 
    location.pathname.startsWith('/control') || 
    location.pathname.startsWith('/checkout/success');

  return (
    <div className="flex flex-col min-h-screen text-slate-800 transition-colors duration-300">
      {!isLiveSurprisePage && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surprises" element={<Surprises />} />
            <Route path="/surprises/:slug" element={<CategoryPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/on-demand" element={<OnDemand />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/customizer/:instanceId" element={<CustomerMiniPanel />} />
            <Route path="/control/:instanceId" element={<ClientLiveControl />} />
            <Route path="/s/:instanceId" element={<SurpriseSite />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!isLiveSurprisePage && !isDashboardView && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
