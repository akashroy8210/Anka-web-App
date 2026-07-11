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
  handleOpenCreateDemoLinkModal
}) {
  const isEditingCategory = editingCategory && editingCategory._id === cat._id;

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
    isUploadingEditDemoImage,
    setIsUploadingEditDemoImage,
    isUploadingEditDemoGallery,
    setIsUploadingEditDemoGallery,
    handleCreateDemo,
    handleDeleteDemo,
    handleStartEditDemo,
    handleUpdateDemoSubmit
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
            className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-655 rounded-lg transition-colors cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
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
            isUploadingEditDemoImage={isUploadingEditDemoImage}
            setIsUploadingEditDemoImage={setIsUploadingEditDemoImage}
            isUploadingEditDemoGallery={isUploadingEditDemoGallery}
            setIsUploadingEditDemoGallery={setIsUploadingEditDemoGallery}
            handleUpdateDemoSubmit={handleUpdateDemoSubmit}
            setEditingDemo={setEditingDemo}
            handleStartEditDemo={handleStartEditDemo}
            handleDeleteDemo={handleDeleteDemo}
            handleOpenCreateDemoLinkModal={handleOpenCreateDemoLinkModal}
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
            isUploadingDemoImage={isUploadingDemoImage}
            setIsUploadingDemoImage={setIsUploadingDemoImage}
            isUploadingDemoGallery={isUploadingDemoGallery}
            setIsUploadingDemoGallery={setIsUploadingDemoGallery}
            handleCreateDemo={handleCreateDemo}
            token={token}
          />
        </div>
      </div>
    </div>
  );
}
