import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loaded page components for bundle size optimization
const Home = lazy(() => import('./pages/Home'));
const Surprises = lazy(() => import('./pages/Surprises'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const OnDemand = lazy(() => import('./pages/OnDemand'));
const AdminDashboard = lazy(() => import('./apps/admin/AdminPage'));
const CustomerMiniPanel = lazy(() => import('./pages/CustomerMiniPanel'));
const ClientLiveControl = lazy(() => import('./pages/ClientLiveControl'));
const SurpriseSite = lazy(() => import('./pages/SurpriseSite'));

// Lazy loaded compliant legal pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/legal/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/legal/RefundPolicy'));

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
          <Suspense fallback={<Loading />}>
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
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/refund" element={<RefundPolicy />} />
            </Routes>
          </Suspense>
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
