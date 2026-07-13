import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.service';
import { AlertCircle } from 'lucide-react';

// Layout & Navigation Components
import AdminLayout from './AdminLayout';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Loading from '../../components/common/Loading';

// Domain Tab Views
import DashboardStats from '../../components/dashboard/DashboardStats';
import OrdersTable from '../../components/orders/OrdersTable';
import CategoryList from '../../components/categories/CategoryList';
import CreateCategoryModal from '../../components/categories/CreateCategoryModal';
import LeadsSection from '../../components/leads/LeadsSection';
import CouponsSection from '../../components/coupons/CouponsSection';
import ConfigureDemoLinkModal from '../../components/birthday/ConfigureDemoLinkModal';
import AdminSettingsSection from './AdminSettingsSection';

// Custom State Hooks
import { useCategories } from '../../hooks/useCategories';
import { useThemes } from '../../hooks/useThemes';
import { useOrders } from '../../hooks/useOrders';
import { useCoupons } from '../../hooks/useCoupons';
import { useLeads } from '../../hooks/useLeads';
import { useDemoLink } from '../../hooks/useDemoLink';

export default function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Route protection
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const [activeTab, setActiveTab] = useState('analytics'); // analytics, instances, categories, leads, coupons
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const modalOverlayRef = useRef(null);

  // Initialize Hooks for refactored operations
  const categoriesHook = useCategories([], fetchAllData);
  const themeHook = useThemes(categoriesHook.categories, categoriesHook.setCategories);
  const ordersHook = useOrders([]);
  const couponsHook = useCoupons([]);
  const leadsHook = useLeads([]);
  const demoLinkHook = useDemoLink();

  // Load and refresh lists data
  async function fetchAllData() {
    if (!token) return;
    setRefreshing(true);
    try {
      const statsRes = await api.getDashboardStats(token);
      const instancesRes = await api.getAllInstances(token);
      const couponsRes = await api.getCoupons(token);
      const leadsRes = await api.getLeads(token);
      const categoriesRes = await api.getCategories();

      if (statsRes.success) setStats(statsRes.stats);
      if (instancesRes.success) ordersHook.setInstances(instancesRes.instances);
      if (couponsRes.success) couponsHook.setCoupons(couponsRes.coupons);
      if (leadsRes.success) leadsHook.setLeads(leadsRes.leads);
      if (categoriesRes.success) categoriesHook.setCategories(categoriesRes.categories);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error loading database tables. Is the server running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleOpenCreateDemoLinkModal = (category, demo) => {
    demoLinkHook.handleOpenCreateDemoLinkModal(category, demo, ordersHook.instances);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AdminLayout>
        <AdminHeader
          refreshing={refreshing}
          fetchAllData={fetchAllData}
          handleLogout={handleLogout}
        />

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-650 text-xs font-medium mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content Routing views */}
        {activeTab === 'analytics' && stats && (
          <DashboardStats stats={stats} />
        )}

        {activeTab === 'instances' && (
          <OrdersTable
            instances={ordersHook.instances}
            token={token}
            handleImpersonate={ordersHook.handleImpersonate}
            handleDeleteInstance={ordersHook.handleDeleteInstance}
            navigate={navigate}
          />
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CreateCategoryModal
              token={token}
              catName={categoriesHook.catName}
              setCatName={categoriesHook.setCatName}
              catSlug={categoriesHook.catSlug}
              setCatSlug={categoriesHook.setCatSlug}
              catDesc={categoriesHook.catDesc}
              setCatDesc={categoriesHook.setCatDesc}
              catImage={categoriesHook.catImage}
              setCatImage={categoriesHook.setCatImage}
              catImages={categoriesHook.catImages}
              setCatImages={categoriesHook.setCatImages}
              isUploadingCatImage={categoriesHook.isUploadingCatImage}
              setIsUploadingCatImage={categoriesHook.setIsUploadingCatImage}
              isUploadingCatGallery={categoriesHook.isUploadingCatGallery}
              setIsUploadingCatGallery={categoriesHook.setIsUploadingCatGallery}
              handleCreateCategory={categoriesHook.handleCreateCategory}
            />

            <CategoryList
              categories={categoriesHook.categories}
              token={token}
              categoryHook={categoriesHook}
              themeHook={themeHook}
              handleOpenCreateDemoLinkModal={handleOpenCreateDemoLinkModal}
              instances={ordersHook.instances}
            />
          </div>
        )}

        {activeTab === 'leads' && (
          <LeadsSection
            leads={leadsHook.leads}
            token={token}
            handleUpdateLeadStatus={leadsHook.handleUpdateLeadStatus}
            handleDeleteLead={leadsHook.handleDeleteLead}
          />
        )}

        {activeTab === 'coupons' && (
          <CouponsSection
            coupons={couponsHook.coupons}
            token={token}
            newCode={couponsHook.newCode}
            setNewCode={couponsHook.setNewCode}
            newType={couponsHook.newType}
            setNewType={couponsHook.setNewType}
            newValue={couponsHook.newValue}
            setNewValue={couponsHook.setNewValue}
            newExpiry={couponsHook.newExpiry}
            setNewExpiry={couponsHook.setNewExpiry}
            handleCreateCoupon={couponsHook.handleCreateCoupon}
            handleDeleteCoupon={couponsHook.handleDeleteCoupon}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsSection token={token} />
        )}
      </AdminLayout>

      {/* Pre-configured Demo Link Modal Dialog */}
      <ConfigureDemoLinkModal
        token={token}
        setInstances={ordersHook.setInstances}
        setCategories={categoriesHook.setCategories}
        modalOverlayRef={modalOverlayRef}
        demoLinkHook={demoLinkHook}
      />
    </>
  );
}
