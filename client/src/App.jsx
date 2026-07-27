import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageSkeleton from './components/common/PageSkeleton';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import { routePreloader } from './utils/routePreloader';
import { scrollState } from './utils/scrollState';

const createPreloadableComponent = (factory, pathKey) => {
  const Component = lazy(factory);
  if (pathKey) {
    routePreloader.registerRoute(pathKey, factory);
  }
  return Component;
};

// Lazy loaded page components with preloading hooks
const Home = createPreloadableComponent(() => import('./pages/Home'), '/');
const Surprises = createPreloadableComponent(() => import('./pages/Surprises'), '/surprises');
const CategoryPage = createPreloadableComponent(() => import('./pages/CategoryPage'), '/surprises/:slug');
const CheckoutSuccess = createPreloadableComponent(() => import('./pages/CheckoutSuccess'), '/checkout/success');
const About = createPreloadableComponent(() => import('./pages/About'), '/about');
const Contact = createPreloadableComponent(() => import('./pages/Contact'), '/contact');
const Login = createPreloadableComponent(() => import('./pages/Login'), '/login');
const OnDemand = createPreloadableComponent(() => import('./pages/OnDemand'), '/on-demand');
const AdminDashboard = createPreloadableComponent(() => import('./apps/admin/AdminPage'), '/admin');
const CustomerMiniPanel = createPreloadableComponent(() => import('./pages/CustomerMiniPanel'), '/customizer/:instanceId');
const ClientLiveControl = createPreloadableComponent(() => import('./pages/ClientLiveControl'), '/control/:instanceId');
const SurpriseSite = createPreloadableComponent(() => import('./pages/SurpriseSite'), '/s/:instanceId');

// Lazy loaded legal pages
const PrivacyPolicy = createPreloadableComponent(() => import('./pages/legal/PrivacyPolicy'), '/privacy');
const TermsConditions = createPreloadableComponent(() => import('./pages/legal/TermsConditions'), '/terms');
const RefundPolicy = createPreloadableComponent(() => import('./pages/legal/RefundPolicy'), '/refund');

function AppContent() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Background idle preloading of top routes after mount
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        routePreloader.preloadRoute('/surprises');
        routePreloader.preloadRoute('/about');
        routePreloader.preloadRoute('/contact');
      }, { timeout: 4000 });
    }
  }, []);

  // Track navigation & scroll position restoration
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = prevPathRef.current;

    if (previousPath && previousPath !== currentPath) {
      scrollState.saveScrollPosition(previousPath);
      routePreloader.recordNavigation(previousPath, currentPath);
    }
    prevPathRef.current = currentPath;

    // Try restoring scroll position or fallback to top
    if (!scrollState.restoreScrollPosition(currentPath)) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Hide Navbar/Footer completely on recipient live pages
  const isLiveSurprisePage = location.pathname.startsWith('/s/') || location.pathname.startsWith('/control/');
  
  // Hide global footer in Dashboards & Checkout Success
  const isDashboardView = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/customizer') || 
    location.pathname.startsWith('/control') || 
    location.pathname.startsWith('/checkout/success');

  // Resolve skeleton type based on path
  const getSkeletonType = () => {
    if (location.pathname.startsWith('/surprises/')) return 'category';
    if (location.pathname.startsWith('/customizer/')) return 'customizer';
    if (location.pathname.startsWith('/s/')) return 'site';
    return 'default';
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-800 transition-colors duration-300">
      {!isLiveSurprisePage && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton type={getSkeletonType()} />}>
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
      <AppContent />
    </Router>
  );
}
