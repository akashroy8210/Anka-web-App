import React from 'react';
import CategoryCard from './CategoryCard';

export default function CategoryList({
  categories,
  token,
  categoryHook,
  themeHook,
  handleOpenCreateDemoLinkModal,
  instances
}) {
  const {
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
    editCatIsActive,
    setEditCatIsActive,
    isUploadingEditCatImage,
    setIsUploadingEditCatImage,
    isUploadingEditCatGallery,
    setIsUploadingEditCatGallery,
    handleUpdateCategorySubmit,
    handleStartEditCategory,
    handleDeleteCategory
  } = categoryHook;

  return (
    <div className="space-y-8 lg:col-span-2">
      <div className="flex justify-between items-center pb-2 border-b border-rosePrimary/5">
        <h3 className="font-heading font-extrabold text-2xl text-wineDeep">Active Surprise Occasions</h3>
      </div>
      
      {categories && categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              cat={cat}
              token={token}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
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
              handleStartEditCategory={handleStartEditCategory}
              handleDeleteCategory={handleDeleteCategory}
              themeHook={themeHook}
              handleOpenCreateDemoLinkModal={handleOpenCreateDemoLinkModal}
              instances={instances}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-sm text-slate-400 font-light italic">
          No categories created yet. Use the form on the left to start!
        </p>
      )}
    </div>
  );
}
