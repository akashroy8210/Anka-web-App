import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.service';
import { DollarSign, Award, ShoppingBag, Tag, LogOut, Trash2, ShieldCheck, AlertCircle, RefreshCw, MessageSquare, Plus, Video, ExternalLink, Image as ImageIcon, Check, X, Edit3, Phone, Sparkles, Send } from 'lucide-react';
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Route protection
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const [activeTab, setActiveTab] = useState('analytics'); // analytics, instances, categories, leads, coupons

  // Lists state
  const [stats, setStats] = useState(null);
  const [instances, setInstances] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [leads, setLeads] = useState([]);
  const [categories, setCategories] = useState([]);


  
  // Coupon Form state
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percentage');
  const [newValue, setNewValue] = useState(10);
  const [newExpiry, setNewExpiry] = useState('');

  // Category Form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catImages, setCatImages] = useState([]);

  // Demo Form state (tracked per active category ID)
  const [activeCatDemoFormId, setActiveCatDemoFormId] = useState(null);
  const [demoName, setDemoName] = useState('');
  const [demoVideo, setDemoVideo] = useState('');
  const [demoImage, setDemoImage] = useState('');
  const [demoImages, setDemoImages] = useState([]);
  const [demoLiveUrl, setDemoLiveUrl] = useState('');
  const [demoPrice, setDemoPrice] = useState(99);
  const [demoSlug, setDemoSlug] = useState('');

  // Inline Price Editing State
  const [editingDemoId, setEditingDemoId] = useState(null);
  const [tempPrice, setTempPrice] = useState(99);

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatImages, setEditCatImages] = useState([]);

  // Demo Edit state
  const [editingDemo, setEditingDemo] = useState(null);
  const [editDemoCategoryId, setEditDemoCategoryId] = useState('');
  const [editDemoName, setEditDemoName] = useState('');
  const [editDemoPrice, setEditDemoPrice] = useState(99);
  const [editDemoVideo, setEditDemoVideo] = useState('');
  const [editDemoLiveUrl, setEditDemoLiveUrl] = useState('');
  const [editDemoImage, setEditDemoImage] = useState('');
  const [editDemoImages, setEditDemoImages] = useState([]);
  const [editDemoSlug, setEditDemoSlug] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Response modal states
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedInstanceForResponse, setSelectedInstanceForResponse] = useState(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [submittingAdminResponse, setSubmittingAdminResponse] = useState(false);

  const fetchAllData = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const statsRes = await api.getDashboardStats(token);
      const instancesRes = await api.getAllInstances(token);
      const couponsRes = await api.getCoupons(token);
      const leadsRes = await api.getLeads(token);
      const categoriesRes = await api.getCategories();

      if (statsRes.success) setStats(statsRes.stats);
      if (instancesRes.success) setInstances(instancesRes.instances);
      if (couponsRes.success) setCoupons(couponsRes.coupons);
      if (leadsRes.success) setLeads(leadsRes.leads);
      if (categoriesRes.success) setCategories(categoriesRes.categories);

    } catch (err) {
      console.error(err);
      setErrorMsg('Error loading database tables. Is the server running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  // Categories CRUD
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catSlug) return;

    try {
      const res = await api.createCategory({
        name: catName,
        slug: catSlug.toLowerCase(),
        description: catDesc,
        imageUrl: catImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        images: catImages,
        tiers: catSlug === 'wedding-invitation' 
          ? [
              { name: 'Basic', price: 2500, inclusions: ['Single Page responsive invitation', 'RSVP via WhatsApp', 'Count-down timer', 'Location maps'] },
              { name: 'Premium', price: 4000, inclusions: ['All in basic', 'Photo Gallery Album', 'Background Music player'] }
            ]
          : [{ name: 'Basic', price: 99, inclusions: ['Personalized countdown', 'Upload photographs', 'Background loops picker'] }],
        addons: []
      }, token);

      if (res.success) {
        setCategories([...categories, { ...res.category, demos: [] }]);
        setCatName('');
        setCatSlug('');
        setCatDesc('');
        setCatImage('');
        setCatImages([]);
        alert('Surprise Category created successfully!');
      } else {
        alert(res.message || 'Error creating category');
      }
    } catch (err) {
      alert('Error connecting to category creation service.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this Category? This will also remove all its design templates!')) return;
    try {
      const res = await api.deleteCategory(id, token);
      if (res.success) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // Demos CRUD
  const handleCreateDemo = async (e, categoryId) => {
    e.preventDefault();
    if (!demoName || !demoVideo || !demoLiveUrl) return;

    try {
      const res = await api.createDemo({
        categoryId,
        name: demoName,
        videoUrl: demoVideo,
        imageUrl: demoImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        images: demoImages,
        liveDemoUrl: demoLiveUrl,
        price: Number(demoPrice),
        themeSlug: demoSlug || demoName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }, token);

      if (res.success) {
        setCategories(categories.map(c => {
          if (c._id === categoryId) {
            return { ...c, demos: [...(c.demos || []), res.demo] };
          }
          return c;
        }));
        setDemoName('');
        setDemoVideo('');
        setDemoImage('');
        setDemoImages([]);
        setDemoLiveUrl('');
        setDemoPrice(99);
        setDemoSlug('');
        setActiveCatDemoFormId(null);
        alert('Design Vibe Theme added successfully!');
      } else {
        alert(res.message || 'Error adding design');
      }
    } catch (err) {
      alert('Error connecting to design creation service.');
    }
  };

  const handleDeleteDemo = async (demoId, categoryId) => {
    if (!window.confirm('Delete this design theme demo?')) return;
    try {
      const res = await api.deleteDemo(demoId, token);
      if (res.success) {
        setCategories(categories.map(c => {
          if (c._id === categoryId) {
            return { ...c, demos: c.demos.filter(d => d._id !== demoId) };
          }
          return c;
        }));
      }
    } catch (err) {
      alert('Error deleting design theme.');
    }
  };

  // Inline Demo Price Change
  const handleUpdateDemoPrice = async (demoId, categoryId) => {
    if (!tempPrice || isNaN(tempPrice)) return;
    try {
      const res = await api.updateDemo(demoId, { price: Number(tempPrice) }, token);
      if (res.success) {
        setCategories(categories.map(c => {
          if (c._id === categoryId) {
            return {
              ...c,
              demos: c.demos.map(d => d._id === demoId ? { ...d, price: res.demo.price } : d)
            };
          }
          return c;
        }));
        setEditingDemoId(null);
        alert('Price updated successfully!');
      } else {
        alert(res.message || 'Error updating price');
      }
    } catch (err) {
      alert('Error updating theme price.');
    }
  };

  // Category Details Editing Start/Save
  const handleStartEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDesc(cat.description);
    setEditCatImage(cat.imageUrl || '');
    setEditCatImages(cat.images || []);
  };

  const handleUpdateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await api.updateCategory(editingCategory._id, {
        name: editCatName,
        slug: editCatSlug.toLowerCase(),
        description: editCatDesc,
        imageUrl: editCatImage,
        images: editCatImages
      }, token);
      if (res.success) {
        setCategories(categories.map(c => c._id === editingCategory._id ? { ...c, ...res.category } : c));
        setEditingCategory(null);
        setEditCatImages([]);
        alert('Category details updated successfully!');
      } else {
        alert(res.message || 'Error updating category details');
      }
    } catch (err) {
      alert('Error updating category.');
    }
  };

  // Demo Details Editing Start/Save
  const handleStartEditDemo = (d, categoryId) => {
    setEditingDemo(d);
    setEditDemoCategoryId(categoryId);
    setEditDemoName(d.name);
    setEditDemoPrice(d.price);
    setEditDemoVideo(d.videoUrl);
    setEditDemoLiveUrl(d.liveDemoUrl);
    setEditDemoImage(d.imageUrl || '');
    setEditDemoImages(d.images || []);
    setEditDemoSlug(d.themeSlug);
  };

  const handleUpdateDemoSubmit = async (e) => {
    e.preventDefault();
    if (!editingDemo) return;
    console.log(editDemoImages);
    try {
      const res = await api.updateDemo(editingDemo._id, {
        name: editDemoName,
        price: Number(editDemoPrice),
        videoUrl: editDemoVideo,
        liveDemoUrl: editDemoLiveUrl,
        imageUrl: editDemoImage,
        images: editDemoImages,
        themeSlug: editDemoSlug
      }, token);
      if (res.success) {
        setCategories(categories.map(c => {
          if (c._id === editDemoCategoryId) {
            return {
              ...c,
              demos: c.demos.map(d => d._id === editingDemo._id ? res.demo : d)
            };
          }
          return c;
        }));
        setEditingDemo(null);
        alert('Design Vibe Theme details updated successfully!');
      } else {
        alert(res.message || 'Error updating theme details');
      }
    } catch (err) {
      alert('Error updating design theme.');
    }
  };

  // Coupon CRUD
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCode || !newValue) return;

    try {
      const res = await api.createCoupon({
        code: newCode,
        discountType: newType,
        discountValue: newValue,
        expiryDate: newExpiry ? new Date(newExpiry) : null
      }, token);

      if (res.success) {
        setCoupons([res.coupon, ...coupons]);
        setNewCode('');
        setNewExpiry('');
        alert('Coupon created successfully!');
      } else {
        alert(res.message || 'Error creating coupon');
      }
    } catch (err) {
      alert('Network error creating coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await api.deleteCoupon(id, token);
      if (res.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting coupon');
    }
  };

  const handleDeleteInstance = async (id) => {
    if (!window.confirm('Permanently delete this surprise order?')) return;
    try {
      const res = await api.deleteInstance(id, token);
      if (res.success) {
        setInstances(instances.filter(inst => inst._id !== id));
      }
    } catch (err) {
      alert('Error deleting order');
    }
  };

  const handleUpdateLeadStatus = async (id, statusVal) => {
    try {
      const res = await api.updateLeadStatus(id, statusVal, token);
      if (res.success) {
        setLeads(leads.map(l => l._id === id ? { ...l, status: res.lead.status } : l));
      } else {
        alert(res.message || 'Error updating status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this custom idea inquiry?')) return;
    try {
      const res = await api.deleteLead(id, token);
      if (res.success) {
        setLeads(leads.filter(l => l._id !== id));
      }
    } catch (err) {
      alert('Error deleting lead');
    }
  };

  const handleImpersonate = (instanceId) => {
    localStorage.setItem('customerToken', token);
    localStorage.setItem('instanceId', instanceId);
    navigate(`/customizer/${instanceId}`);
  };



  const handleOpenResponseModal = (inst) => {
    setSelectedInstanceForResponse(inst);
    setAdminResponseText(inst.adminResponse || '');
    setResponseModalOpen(true);
  };

  const handleSubmitAdminResponse = async (e) => {
    e.preventDefault();
    if (!selectedInstanceForResponse) return;

    setSubmittingAdminResponse(true);
    try {
      const response = await fetch(`/api/instances/${selectedInstanceForResponse.instanceId}/admin-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminResponse: adminResponseText })
      });
      const data = await response.json();
      if (data.success) {
        setInstances(prev => prev.map(inst => 
          inst.instanceId === selectedInstanceForResponse.instanceId 
            ? { ...inst, adminResponse: data.adminResponse } 
            : inst
        ));
        setResponseModalOpen(false);
        setSelectedInstanceForResponse(null);
        setAdminResponseText('');
      } else {
        alert(data.message || 'Failed to submit response.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setSubmittingAdminResponse(false);
    }
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 space-y-4">
        <div className="w-10 h-10 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-light text-sm">Authenticating super admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        
        {/* Banner Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rosePrimary/15 text-rosePrimary rounded-2xl shadow-sm">
              <ShieldCheck className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Core</span>
              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-wineDeep">
                AnKa Main Admin Panel
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="flex-grow sm:flex-grow-0 p-2.5 bg-white border border-rosePrimary/10 text-slate-500 hover:text-wineDeep rounded-xl transition-all flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 text-xs font-medium mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-5 gap-2 mb-8 bg-white/70 p-1.5 rounded-2xl border border-rosePrimary/10">
          {[
            { id: 'analytics', label: 'Analytics', icon: DollarSign },
            { id: 'instances', label: 'Surprises', icon: ShoppingBag },
            { id: 'categories', label: 'Occasions & Demos', icon: Award },
            { id: 'leads', label: 'On-Demand Ideas', icon: MessageSquare },
            { id: 'coupons', label: 'Coupons', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-[10px] sm:text-sm font-semibold rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rosePrimary text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign },
                { label: 'Bookings (This Month)', value: stats.bookingsThisMonth, icon: ShoppingBag },
                { label: 'Popular Surprise Category', value: stats.mostBookedCategory, icon: Award }
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
                      <span className="mt-2 font-heading font-extrabold text-3xl text-wineDeep block">{kpi.value}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-rosePrimary/5 border border-rosePrimary/10 shrink-0">
                      <Icon className="w-6 h-6 text-rosePrimary" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3">Surprise Status Analytics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-light">Draft (Paid but no customization)</span>
                  <span className="font-bold text-slate-800">{stats.statusCounts?.Paid || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-light">Customized (Content Added)</span>
                  <span className="font-bold text-slate-800">{stats.statusCounts?.ContentAdded || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-light">Published Live</span>
                  <span className="font-bold text-green-600">{stats.statusCounts?.Live || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SURPRISES (INSTANCES) */}
        {activeTab === 'instances' && (
          <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-rosePrimary/5">
              <h3 className="font-heading font-bold text-lg text-wineDeep">Active Surprises</h3>
            </div>
            
            {instances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                      <th className="p-4">Surprise ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Occasion / Vibe</th>
                      <th className="p-4">Price Paid</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Recipient Reply</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                    {instances.map((inst) => (
                      <tr key={inst._id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-wineDeep">{inst.instanceId}</td>
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-slate-800 text-sm">{inst.customerName || 'None'}</div>
                          <div className="text-slate-400 text-xs">{inst.customerEmail}</div>
                          <div className="text-xs text-slate-450">{inst.customerPhone}</div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-slate-800 text-sm">{inst.category ? (typeof inst.category === 'object' ? inst.category.name : inst.category) : 'Unknown'}</div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{inst.tier}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-750 text-sm">₹{inst.pricePaid}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            inst.status === 'Live'
                              ? 'bg-green-50 border-green-200 text-green-600'
                              : inst.status === 'Content Added'
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-amber-50 border-amber-200 text-amber-600'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="p-4 space-y-1 max-w-[200px]">
                          {inst.recipientResponse ? (
                            <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-rosePrimary/10 relative leading-relaxed">
                              <span className="font-medium italic">"{inst.recipientResponse}"</span>
                              {inst.feedbackLiked === true && (
                                <span className="inline-block ml-1 text-red-500" title="Loved it! ❤️">❤️</span>
                              )}
                              {inst.feedbackLiked === false && (
                                <span className="inline-block ml-1 text-yellow-600" title="Not liked 😅">😅</span>
                              )}
                              {inst.adminResponse && (
                                <div className="mt-1 text-[10px] text-rosePrimary border-t border-slate-100 pt-1 font-bold">
                                  <span>Replied:</span> <span className="italic text-slate-500 font-normal">"{inst.adminResponse}"</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No response yet</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2 shrink-0">

                          {inst.recipientResponse && (
                            <button
                              onClick={() => handleOpenResponseModal(inst)}
                              className="px-3 py-1.5 bg-rosePrimary/10 hover:bg-rosePrimary/20 text-rosePrimary border border-rosePrimary/30 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors inline-block cursor-pointer"
                            >
                              Reply 💌
                            </button>
                          )}
                          <button
                            onClick={() => handleImpersonate(inst.instanceId)}
                            className="px-3.5 py-2 bg-slate-150 hover:bg-slate-200 text-rosePrimary rounded-lg font-bold border text-xs uppercase tracking-wider transition-colors inline-block cursor-pointer"
                          >
                            Edit Configs
                          </button>
                          <button
                            onClick={() => handleDeleteInstance(inst._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-12 text-sm text-slate-400 font-light italic">No surprise purchases found.</p>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES & DEMOS MANAGER */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Occasion Form */}
            <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm h-fit">
              <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3 mb-4">Create Surprise Category</h3>
              
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Occasion Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Birthday Surprise"
                    className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Slug</label>
                  <input
                    type="text"
                    required
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="e.g. birthday"
                    className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Describe this surprise..."
                    className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Catalog Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-450 uppercase font-light">Or upload local thumbnail:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const data = await api.uploadFile(file);
                            if (data.success) {
                              setCatImage(data.url);
                              alert('Local thumbnail uploaded successfully!');
                            } else {
                              alert(data.message || 'Upload failed.');
                            }
                          } catch (err) {
                            alert('Error uploading file.');
                          }
                        }
                      }}
                      className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Slideshow Images (Multiple)</label>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-450 uppercase font-light">Upload multiple screenshots:</span>
                    <div className="flex items-center gap-2">
                      {catImages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCatImages([]);
                            alert('Cleared all slideshow images.');
                          }}
                          className="px-2 py-1 bg-red-50 text-red-655 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const urls = [];
                            for (let i = 0; i < files.length; i++) {
                              try {
                                const data = await api.uploadFile(files[i]);
                                if (data.success) {
                                  urls.push(data.url);
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }
                            if (urls.length > 0) {
                              setCatImages(prev => [...prev, ...urls]);
                              alert(`Successfully uploaded ${urls.length} images!`);
                            } else {
                              alert('Failed to upload slideshow images.');
                            }
                          }
                        }}
                        className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer"
                      />
                    </div>
                  </div>

                  {catImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
                      {catImages.map((img, i) => (
                        <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCatImages(catImages.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </form>
            </div>

            {/* Category List & Demo Sub-managers */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-heading font-extrabold text-2xl text-wineDeep">Active Surprise Occasions</h3>
                         {categories.map((cat) => {
                const isEditingCategory = editingCategory && editingCategory._id === cat._id;
                if (isEditingCategory) {
                  return (
                    <form 
                      key={cat._id} 
                      onSubmit={handleUpdateCategorySubmit} 
                      className="bg-white rounded-3xl p-6 border border-rosePrimary/20 shadow-md space-y-4"
                    >
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h4 className="font-heading font-extrabold text-xl text-wineDeep">Edit Occasion Details</h4>
                        <button 
                          type="button" 
                          onClick={() => setEditingCategory(null)} 
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Name</label>
                          <input
                            type="text"
                            required
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Slug</label>
                          <input
                            type="text"
                            required
                            value={editCatSlug}
                            onChange={(e) => setEditCatSlug(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Description</label>
                        <textarea
                          rows="3"
                          value={editCatDesc}
                          onChange={(e) => setEditCatDesc(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                        />
                      </div>

                       <div>
                        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Catalog Thumbnail Image URL</label>
                        <input
                          type="url"
                          value={editCatImage}
                          onChange={(e) => setEditCatImage(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                        />
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-450 uppercase font-light">Or upload thumbnail:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const data = await api.uploadFile(file);
                                  if (data.success) {
                                    setEditCatImage(data.url);
                                    alert('Thumbnail uploaded successfully!');
                                  } else {
                                    alert(data.message || 'Upload failed.');
                                  }
                                } catch (err) {
                                  alert('Error uploading file.');
                                }
                              }
                            }}
                            className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Category Slideshow Images (Multiple)</label>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-450 uppercase font-light">Upload multiple screenshots:</span>
                          <div className="flex items-center gap-2">
                            {editCatImages.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditCatImages([]);
                                  alert('Cleared all slideshow images.');
                                }}
                                className="px-2 py-1 bg-red-50 text-red-655 border border-red-250 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                              >
                                Clear All
                              </button>
                            )}
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const urls = [];
                                  for (let i = 0; i < files.length; i++) {
                                    try {
                                      const data = await api.uploadFile(files[i]);
                                      if (data.success) {
                                        urls.push(data.url);
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }
                                  if (urls.length > 0) {
                                    setEditCatImages(prev => [...prev, ...urls]);
                                    alert(`Successfully uploaded ${urls.length} images!`);
                                  } else {
                                    alert('Failed to upload slideshow images.');
                                  }
                                }
                              }}
                              className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer"
                            />
                          </div>
                        </div>

                        {editCatImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
                            {editCatImages.map((img, i) => (
                              <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setEditCatImages(editCatImages.filter((_, idx) => idx !== i))}
                                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="w-1/2 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-655 text-sm font-bold uppercase rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-sm font-bold uppercase rounded-lg"
                        >
                          Save Details
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div key={cat._id} className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm space-y-5">
                    
                    {/* Category Header details */}
                    <div className="flex justify-between items-start border-b border-rosePrimary/5 pb-3">
                      <div>
                        <h4 className="font-heading font-extrabold text-xl text-wineDeep">{cat.name}</h4>
                        <span className="text-xs font-mono text-slate-400">Slug: {cat.slug} | ID: {cat._id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartEditCategory(cat)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 border border-rosePrimary/20 text-rosePrimary rounded-lg transition-colors cursor-pointer"
                          title="Edit Category Details"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-655 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Demos listed under this category */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Surprise Design Themes (Demos)</h5>
                      
                      {cat.demos && cat.demos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.demos.map((d) => {
                            const isEditingPrice = editingDemoId === d._id;
                            const isEditingTheme = editingDemo && editingDemo._id === d._id;

                            if (isEditingTheme) {
                              return (
                                <form 
                                  key={d._id} 
                                  onSubmit={handleUpdateDemoSubmit} 
                                  className="bg-white border border-rosePrimary/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md md:col-span-2"
                                >
                                  <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm font-bold text-wineDeep uppercase tracking-wider">Edit Design Vibe: {d.name}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => setEditingDemo(null)} 
                                      className="p-1 hover:bg-slate-150 rounded-full text-slate-400 hover:text-slate-800"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Name</label>
                                      <input
                                        type="text"
                                        required
                                        value={editDemoName}
                                        onChange={(e) => setEditDemoName(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Price (₹)</label>
                                      <input
                                        type="number"
                                        required
                                        value={editDemoPrice}
                                        onChange={(e) => setEditDemoPrice(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Video Tour Link</label>
                                      <input
                                        type="url"
                                        required
                                        value={editDemoVideo}
                                        onChange={(e) => setEditDemoVideo(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Live Demo URL</label>
                                      <input
                                        type="url"
                                        required
                                        value={editDemoLiveUrl}
                                        onChange={(e) => setEditDemoLiveUrl(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slug</label>
                                      <input
                                        type="text"
                                        required
                                        value={editDemoSlug}
                                        onChange={(e) => setEditDemoSlug(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Thumbnail Image URL</label>
                                      <input
                                        type="url"
                                        value={editDemoImage}
                                        onChange={(e) => setEditDemoImage(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-450 uppercase">Or upload image:</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          try {
                                            const data = await api.uploadFile(file);
                                            if (data.success) {
                                              setEditDemoImage(data.url);
                                              alert('Uploaded successfully!');
                                            } else {
                                              alert(data.message || 'Upload failed.');
                                            }
                                          } catch (err) {
                                            alert('Error uploading file.');
                                          }
                                        }
                                      }}
                                      className="text-xs text-slate-555 file:mr-1 file:py-1 file:px-2 file:rounded-lg file:border file:text-xs file:font-semibold file:bg-slate-100 file:cursor-pointer"
                                    />
                                  </div>

                                  {/* Multiple Slideshow Screenshots Upload */}
                                  <div className="border-t pt-3 space-y-2">
                                    <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-450 uppercase font-light">Upload multiple screenshots:</span>
                                      <div className="flex items-center gap-2">
                                        {editDemoImages.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditDemoImages([]);
                                              alert('Cleared all slideshow screenshots. Click Save to persist.');
                                            }}
                                            className="px-2 py-1 bg-red-50 text-red-605 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer animate-pulse"
                                          >
                                            Clear All
                                          </button>
                                        )}
                                        <input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                              const urls = [];
                                              for (let i = 0; i < files.length; i++) {
                                                try {
                                                  const data = await api.uploadFile(files[i]);
                                                  if (data.success) {
                                                    urls.push(data.url);
                                                  }
                                                } catch (err) {
                                                  console.error(err);
                                                }
                                              }
                                              if (urls.length > 0) {
                                                setEditDemoImages(prev => [...prev, ...urls]);
                                                alert(`Successfully uploaded ${urls.length} images!`);
                                              } else {
                                                alert('Failed to upload slideshow images.');
                                              }
                                            }
                                          }}
                                          className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer"
                                        />
                                      </div>
                                    </div>

                                    {editDemoImages.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
                                        {editDemoImages.map((img, i) => (
                                          <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                              type="button"
                                              onClick={() => setEditDemoImages(editDemoImages.filter((_, idx) => idx !== i))}
                                              className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex space-x-2 pt-2 border-t">
                                    <button
                                      type="button"
                                      onClick={() => setEditingDemo(null)}
                                      className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase rounded-xl"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="w-1/2 py-2.5 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-bold uppercase rounded-xl"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </form>
                              );
                            }

                            return (
                              <div key={d._id} className="bg-slate-50 border rounded-2xl p-4 flex flex-col justify-between space-y-3">
                                
                                <div>
                                  <div className="flex justify-between items-start">
                                    <h6 className="font-bold text-sm text-wineDeep">{d.name}</h6>
                                    <div className="flex items-center space-x-1.5">
                                      <button
                                        onClick={() => handleStartEditDemo(d, cat._id)}
                                        className="text-rosePrimary hover:text-wineDeep p-1 cursor-pointer"
                                        title="Edit Theme Details"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDemo(d._id, cat._id)}
                                        className="text-red-655 hover:text-red-800 p-1 cursor-pointer"
                                        title="Delete Theme"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  <span className="text-xs text-slate-400 font-mono mt-1 block">Theme Slug: {d.themeSlug}</span>
                                </div>

                                {/* Price update controls */}
                                <div className="border-t border-slate-100 pt-2">
                                  {isEditingPrice ? (
                                    <div className="flex items-center space-x-1.5">
                                      <span className="text-xs text-slate-500 font-semibold">₹</span>
                                      <input
                                        type="number"
                                        value={tempPrice}
                                        onChange={(e) => setTempPrice(Number(e.target.value))}
                                        className="w-20 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white text-slate-800 font-bold"
                                      />
                                      <button
                                        onClick={() => handleUpdateDemoPrice(d._id, cat._id)}
                                        className="p-1 bg-green-50 text-green-650 hover:bg-green-100 rounded cursor-pointer"
                                        title="Save Price"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingDemoId(null)}
                                        className="p-1 bg-slate-100 text-slate-400 hover:bg-slate-200 rounded cursor-pointer"
                                        title="Cancel"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-between items-center text-xs">
                                      <p className="text-slate-655 font-medium">
                                        Price: <span className="font-bold text-wineDeep">₹{d.price}</span>
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => { setEditingDemoId(d._id); setTempPrice(d.price); }}
                                        className="text-rosePrimary hover:text-wineDeep font-bold underline cursor-pointer flex items-center space-x-0.5"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Edit Price</span>
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 pt-1 border-t border-slate-100/50">
                                  <a href={d.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-white border rounded-lg text-slate-500 hover:text-rosePrimary text-[9px] font-semibold uppercase tracking-wider flex items-center space-x-1">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Demo link</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No themes added yet. Add a design theme below.</p>
                      )}
                    </div>

                  {/* Add Design Theme Demo Form */}
                  <div className="border-t border-rosePrimary/5 pt-4">
                    {activeCatDemoFormId === cat._id ? (
                      <form onSubmit={(e) => handleCreateDemo(e, cat._id)} className="bg-creamBase/20 p-4 rounded-2xl border border-rosePrimary/10 space-y-4">
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                          <span className="text-xs font-bold text-wineDeep uppercase tracking-wider">Add Design Theme to {cat.name}</span>
                          <button 
                            type="button" 
                            onClick={() => setActiveCatDemoFormId(null)}
                            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            <X className="w-4.5 h-4.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Name</label>
                            <input
                              type="text"
                              required
                              value={demoName}
                              onChange={(e) => setDemoName(e.target.value)}
                              placeholder="e.g. Classic Pink Vibe"
                              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Price (₹)</label>
                            <input
                              type="number"
                              required
                              value={demoPrice}
                              onChange={(e) => setDemoPrice(e.target.value)}
                              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Video Tour Link</label>
                            <input
                              type="url"
                              required
                              value={demoVideo}
                              onChange={(e) => setDemoVideo(e.target.value)}
                              placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Live Preview URL</label>
                            <input
                              type="url"
                              required
                              value={demoLiveUrl}
                              onChange={(e) => setDemoLiveUrl(e.target.value)}
                              placeholder="https://surprisebabe.vercel.app/"
                              className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Thumbnail Image URL (Optional)</label>
                          <input
                            type="url"
                            value={demoImage}
                            onChange={(e) => setDemoImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-white"
                          />
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-450 uppercase">Or upload local image:</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    const data = await api.uploadFile(file);
                                    if (data.success) {
                                      setDemoImage(data.url);
                                      alert('Local image uploaded successfully!');
                                    } else {
                                      alert(data.message || 'Upload failed.');
                                    }
                                  } catch (err) {
                                    alert('Error uploading file.');
                                  }
                                }
                              }}
                              className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Multiple Slideshow Screenshots Upload */}
                        <div className="border-t pt-3 space-y-2">
                          <label className="text-xs font-bold text-wineDeep uppercase block mb-1">Theme Slideshow Images (Multiple)</label>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-450 uppercase font-light">Upload multiple screenshots:</span>
                            <div className="flex items-center gap-2">
                              {demoImages.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDemoImages([]);
                                    alert('Cleared all screenshots.');
                                  }}
                                  className="px-2 py-1 bg-red-50 text-red-655 border border-red-200 rounded-lg text-[9px] font-bold uppercase hover:bg-red-100 cursor-pointer"
                                >
                                  Clear All
                                </button>
                              )}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) {
                                    const urls = [];
                                    for (let i = 0; i < files.length; i++) {
                                      try {
                                        const data = await api.uploadFile(files[i]);
                                        if (data.success) {
                                          urls.push(data.url);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                    if (urls.length > 0) {
                                      setDemoImages(prev => [...prev, ...urls]);
                                      alert(`Successfully uploaded ${urls.length} images!`);
                                    } else {
                                      alert('Failed to upload slideshow images.');
                                    }
                                  }
                                }}
                                className="text-xs text-slate-555 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-slate-100 file:cursor-pointer"
                              />
                            </div>
                          </div>

                          {demoImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl">
                              {demoImages.map((img, i) => (
                                <div key={i} className="relative w-12 h-12 border rounded-lg overflow-hidden group">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setDemoImages(demoImages.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-wineDeep hover:bg-rosePrimary text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Save Design Vibe Theme
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCatDemoFormId(cat._id);
                          setDemoPrice(cat.slug === 'wedding-invitation' ? 2500 : 99);
                        }}
                        className="px-4 py-2.5 border border-dashed border-rosePrimary/30 hover:border-rosePrimary hover:bg-rosePrimary/5 text-rosePrimary rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Design Vibe Theme</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>

          </div>
        )}

        {/* TAB 4: ON-DEMAND IDEAS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-rosePrimary/5">
              <h3 className="font-heading font-bold text-lg text-wineDeep">On-Demand Custom Surprise Requests</h3>
            </div>
            
            {leads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                      <th className="p-4">Customer</th>
                      <th className="p-4">WhatsApp / Phone</th>
                      <th className="p-4">Custom Idea description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-800">{lead.name}</td>
                        <td className="p-4 font-semibold text-slate-700">
                          <a href={`tel:${lead.phone}`} className="hover:underline flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.phone}</span>
                          </a>
                        </td>
                        <td className="p-4 max-w-sm text-slate-650 font-light leading-relaxed whitespace-pre-wrap">{lead.message}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            lead.status === 'Closed'
                              ? 'bg-slate-100 border-slate-300 text-slate-500'
                              : lead.status === 'Quoted'
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : lead.status === 'Contacted'
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                              : 'bg-rose-50 border-rose-200 text-rosePrimary'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-y-1.5">
                          <div className="flex flex-wrap gap-1 justify-end">
                            {['Contacted', 'Quoted', 'Closed'].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleUpdateLeadStatus(lead._id, s)}
                                className={`px-2 py-1 rounded-lg border text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                                  lead.status === s
                                    ? 'bg-slate-200 border-slate-300 text-slate-800'
                                    : 'bg-white hover:bg-slate-50 text-slate-500'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-12 text-sm text-slate-400 font-light italic">No custom inquiries found.</p>
            )}
          </div>
        )}

        {/* TAB 5: COUPON MANAGER */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Coupon form */}
            <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm h-fit">
              <h3 className="font-heading font-bold text-lg text-wineDeep border-b border-rosePrimary/5 pb-3 mb-4">Create Discount Coupon</h3>
              
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="WELCOME20"
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Discount Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                    >
                      <option value="percentage">Percent (%)</option>
                      <option value="fixed">Fixed (INR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Value</label>
                    <input
                      type="number"
                      required
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-wineDeep uppercase tracking-wider block mb-1.5">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-3xl border border-rosePrimary/10 shadow-sm overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 border-b border-rosePrimary/5">
                <h3 className="font-heading font-bold text-lg text-wineDeep">Active Coupons</h3>
              </div>
              
              {coupons.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-rosePrimary/10 font-bold text-slate-500">
                        <th className="p-4">Code</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                      {coupons.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono font-bold text-wineDeep uppercase">{c.code}</td>
                          <td className="p-4 font-semibold text-slate-800">
                            {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                          </td>
                          <td className="p-4 text-slate-500 font-light font-sans text-xs">
                            {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c._id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-200 inline-block cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-12 text-sm text-slate-400 font-light italic">No coupons found.</p>
              )}
            </div>

          </div>
        )}

        {/* Socket.IO Live Control Drawer/Modal */}


        {/* Respond Back Modal */}
        {responseModalOpen && selectedInstanceForResponse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in-up">
            <form onSubmit={handleSubmitAdminResponse} className="bg-white rounded-[32px] border border-rosePrimary/10 shadow-2xl p-6 md:p-8 max-w-lg w-full relative space-y-6">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setResponseModalOpen(false);
                  setSelectedInstanceForResponse(null);
                  setAdminResponseText('');
                }}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-505 rounded-full border cursor-pointer animate-pulse"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-[9px] font-black text-rosePrimary uppercase tracking-widest bg-rosePrimary/10 px-3 py-1 rounded-full inline-block">
                  Respond Back 💌
                </span>
                <h3 className="font-heading font-black text-xl md:text-2xl text-wineDeep">
                  Reply to Recipient
                </h3>
                <p className="text-xs text-slate-450">
                  Instance ID: <span className="font-mono">{selectedInstanceForResponse.instanceId}</span>
                </p>
              </div>

              {/* Recipient message quote */}
              <div className="bg-rosePrimary/5 border border-rosePrimary/10 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-rosePrimary uppercase tracking-wider block">
                  Recipient Message:
                </span>
                <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                  "{selectedInstanceForResponse.recipientResponse}"
                </p>
                {selectedInstanceForResponse.feedbackLiked === true && (
                  <span className="inline-flex items-center text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full mt-1">
                    ❤️ Loved the Surprise
                  </span>
                )}
              </div>

              {/* Response Textarea */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider block">
                  Your Response back:
                </label>
                <textarea
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                  placeholder="Type a loving reply, congratulations, or response here... e.g. So happy you liked it! I love you to the moon and back. ❤️"
                  rows={4}
                  required
                  className="w-full px-4 py-3 text-xs border border-rosePrimary/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-rosePrimary bg-slate-50 leading-relaxed resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setResponseModalOpen(false);
                    setSelectedInstanceForResponse(null);
                    setAdminResponseText('');
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdminResponse}
                  className="flex-1 py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submittingAdminResponse ? 'Sending...' : 'Send Response'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
