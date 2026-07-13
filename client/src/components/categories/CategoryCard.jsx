import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import EditCategoryModal from './EditCategoryModal';
import ThemeList from '../themes/ThemeList';
import CreateThemeModal from '../themes/CreateThemeModal';

export default function CategoryCard({
  cat,
  token,
  editingCategory,
  setEditingCategory,
  editCatName,
  setEditCatName,
  editCatSlug,
  setEditCatSlug,
  editCatDesc,
  setEditCatDesc,
  editCatImage,
  setEditCatImage,
  editCatImages,
  setEditCatImages,
  editCatIsActive,
  setEditCatIsActive,
  editBasicPrice,
  setEditBasicPrice,
  editBasicInclusions,
  setEditBasicInclusions,
  editPremiumPrice,
  setEditPremiumPrice,
  editPremiumInclusions,
  setEditPremiumInclusions,
  isUploadingEditCatImage,
  setIsUploadingEditCatImage,
  isUploadingEditCatGallery,
  setIsUploadingEditCatGallery,
  handleUpdateCategorySubmit,
  handleStartEditCategory,
  handleDeleteCategory,
  themeHook,
  handleOpenCreateDemoLinkModal,
  instances
}) {
  const isEditingCategory = editingCategory && editingCategory._id === cat._id;

  const totalThemes = cat.demos ? cat.demos.length : 0;
  const totalDemoConfigs = cat.demos ? cat.demos.reduce((acc, d) => acc + (d.liveDemoUrl ? 1 : 0) + Object.values(d.features || {}).filter(Boolean).length, 0) : 0;
  const totalPackages = cat.tiers ? cat.tiers.length : 0;
  const activeThemes = totalThemes;
  const activeOrders = (instances || []).filter(inst => {
    const instCatId = inst.category?._id || inst.category;
    return instCatId?.toString() === cat._id?.toString();
  }).length;
  const lastUpdated = cat.updatedAt ? new Date(cat.updatedAt).toLocaleDateString() : (cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A');

  if (isEditingCategory) {
    return (
      <EditCategoryModal
        cat={cat}
        token={token}
        editCatName={editCatName}
        setEditCatName={setEditCatName}
        editCatSlug={editCatSlug}
        setEditCatSlug={setEditCatSlug}
        editCatDesc={editCatDesc}
        setEditCatDesc={setEditCatDesc}
        editCatImage={editCatImage}
        setEditCatImage={setEditCatImage}
        editCatImages={editCatImages}
        setEditCatImages={setEditCatImages}
        editCatIsActive={editCatIsActive}
        setEditCatIsActive={setEditCatIsActive}
        editBasicPrice={editBasicPrice}
        setEditBasicPrice={setEditBasicPrice}
        editBasicInclusions={editBasicInclusions}
        setEditBasicInclusions={setEditBasicInclusions}
        editPremiumPrice={editPremiumPrice}
        setEditPremiumPrice={setEditPremiumPrice}
        editPremiumInclusions={editPremiumInclusions}
        setEditPremiumInclusions={setEditPremiumInclusions}
        isUploadingEditCatImage={isUploadingEditCatImage}
        setIsUploadingEditCatImage={setIsUploadingEditCatImage}
        isUploadingEditCatGallery={isUploadingEditCatGallery}
        setIsUploadingEditCatGallery={setIsUploadingEditCatGallery}
        handleUpdateCategorySubmit={handleUpdateCategorySubmit}
        setEditingCategory={setEditingCategory}
      />
    );
  }

  // Destructure Theme Hook states
  const {
    activeCatDemoFormId,
    setActiveCatDemoFormId,
    demoName,
    setDemoName,
    demoVideo,
    setDemoVideo,
    demoLiveUrl,
    setDemoLiveUrl,
    demoImage,
    setDemoImage,
    demoImages,
    setDemoImages,
    isUploadingDemoImage,
    setIsUploadingDemoImage,
    isUploadingDemoGallery,
    setIsUploadingDemoGallery,
    editingDemo,
    setEditingDemo,
    editDemoCategoryId,
    setEditDemoCategoryId,
    editDemoName,
    setEditDemoName,
    editDemoVideo,
    setEditDemoVideo,
    editDemoLiveUrl,
    setEditDemoLiveUrl,
    editDemoImage,
    setEditDemoImage,
    editDemoImages,
    setEditDemoImages,
    editDemoSlug,
    setEditDemoSlug,
    editDemoDescription,
    setEditDemoDescription,
    demoDescription,
    setDemoDescription,
    isUploadingEditDemoImage,
    setIsUploadingEditDemoImage,
    isUploadingEditDemoGallery,
    setIsUploadingEditDemoGallery,
    handleCreateDemo,
    handleDeleteDemo,
    handleStartEditDemo,
    handleUpdateDemoSubmit,
    demoFeatures,
    setDemoFeatures,
    editDemoFeatures,
    setEditDemoFeatures
  } = themeHook;

  return (
    <div className="bg-white rounded-3xl p-6 border border-rosePrimary/10 shadow-sm space-y-5">
      
      {/* Category Header details */}
      <div className="flex justify-between items-start border-b border-rosePrimary/5 pb-3">
        <div className="text-left">
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
            onClick={() => handleDeleteCategory(cat._id, token)}
            className="p-2 bg-red-55 hover:bg-red-100 border border-red-200 text-red-655 rounded-lg transition-colors cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-rosePrimary/5 p-4 rounded-2xl border border-rosePrimary/10 text-xs">
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Themes</span>
          <span className="text-sm font-black text-wineDeep">{totalThemes}</span>
        </div>
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Demos URLs</span>
          <span className="text-sm font-black text-wineDeep">{totalDemoConfigs}</span>
        </div>
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Packages</span>
          <span className="text-sm font-black text-wineDeep">{totalPackages}</span>
        </div>
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Themes</span>
          <span className="text-sm font-black text-wineDeep">{activeThemes}</span>
        </div>
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Orders</span>
          <span className="text-sm font-black text-wineDeep">{activeOrders}</span>
        </div>
        <div className="text-center p-2 bg-white rounded-xl border border-rosePrimary/5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Last Updated</span>
          <span className="text-[10px] font-bold text-rosePrimary">{lastUpdated}</span>
        </div>
      </div>

      {/* Demos listed under this category */}
      <div className="space-y-4">
        <div className="text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Design Vibe Layouts</span>
          <ThemeList
            cat={cat}
            token={token}
            editingDemo={editingDemo}
            editDemoName={editDemoName}
            setEditDemoName={setEditDemoName}
            editDemoVideo={editDemoVideo}
            setEditDemoVideo={setEditDemoVideo}
            editDemoLiveUrl={editDemoLiveUrl}
            setEditDemoLiveUrl={setEditDemoLiveUrl}
            editDemoSlug={editDemoSlug}
            setEditDemoSlug={setEditDemoSlug}
            editDemoImage={editDemoImage}
            setEditDemoImage={setEditDemoImage}
            editDemoImages={editDemoImages}
            setEditDemoImages={setEditDemoImages}
            editDemoDescription={editDemoDescription}
            setEditDemoDescription={setEditDemoDescription}
            isUploadingEditDemoImage={isUploadingEditDemoImage}
            setIsUploadingEditDemoImage={setIsUploadingEditDemoImage}
            isUploadingEditDemoGallery={isUploadingEditDemoGallery}
            setIsUploadingEditDemoGallery={setIsUploadingEditDemoGallery}
            handleUpdateDemoSubmit={handleUpdateDemoSubmit}
            setEditingDemo={setEditingDemo}
            handleStartEditDemo={handleStartEditDemo}
            handleDeleteDemo={handleDeleteDemo}
            handleOpenCreateDemoLinkModal={handleOpenCreateDemoLinkModal}
            editDemoFeatures={editDemoFeatures}
            setEditDemoFeatures={setEditDemoFeatures}
          />
        </div>

        {/* Add Design Theme Demo Form */}
        <div className="border-t border-rosePrimary/5 pt-4">
          <CreateThemeModal
            cat={cat}
            activeCatDemoFormId={activeCatDemoFormId}
            setActiveCatDemoFormId={setActiveCatDemoFormId}
            demoName={demoName}
            setDemoName={setDemoName}
            demoVideo={demoVideo}
            setDemoVideo={setDemoVideo}
            demoLiveUrl={demoLiveUrl}
            setDemoLiveUrl={setDemoLiveUrl}
            demoImage={demoImage}
            setDemoImage={setDemoImage}
            demoImages={demoImages}
            setDemoImages={setDemoImages}
            demoDescription={demoDescription}
            setDemoDescription={setDemoDescription}
            isUploadingDemoImage={isUploadingDemoImage}
            setIsUploadingDemoImage={setIsUploadingDemoImage}
            isUploadingDemoGallery={isUploadingDemoGallery}
            setIsUploadingDemoGallery={setIsUploadingDemoGallery}
            handleCreateDemo={handleCreateDemo}
            token={token}
            demoFeatures={demoFeatures}
            setDemoFeatures={setDemoFeatures}
          />
        </div>
      </div>
    </div>
  );
}
