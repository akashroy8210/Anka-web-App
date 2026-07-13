import React from 'react';
import EditThemeModal from './EditThemeModal';
import ThemeCard from './ThemeCard';

export default function ThemeList({
  cat,
  token,
  editingDemo,
  editDemoName,
  setEditDemoName,
  editDemoVideo,
  setEditDemoVideo,
  editDemoLiveUrl,
  setEditDemoLiveUrl,
  editDemoSlug,
  setEditDemoSlug,
  editDemoImage,
  setEditDemoImage,
  editDemoImages,
  setEditDemoImages,
  editDemoDescription,
  setEditDemoDescription,
  isUploadingEditDemoImage,
  setIsUploadingEditDemoImage,
  isUploadingEditDemoGallery,
  setIsUploadingEditDemoGallery,
  handleUpdateDemoSubmit,
  setEditingDemo,
  handleStartEditDemo,
  handleDeleteDemo,
  handleOpenCreateDemoLinkModal,
  editDemoFeatures,
  setEditDemoFeatures
}) {
  if (!cat.demos || cat.demos.length === 0) {
    return (
      <p className="text-xs text-slate-400 font-light italic text-left">
        No design layouts configured yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cat.demos.map((d) => {
        const isEditingTheme = editingDemo && editingDemo._id === d._id;

        if (isEditingTheme) {
          return (
            <EditThemeModal
              key={d._id}
              token={token}
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
              catSlug={cat.slug}
              editDemoFeatures={editDemoFeatures}
              setEditDemoFeatures={setEditDemoFeatures}
            />
          );
        }

        return (
          <ThemeCard
            key={d._id}
            d={d}
            cat={cat}
            token={token}
            handleStartEditDemo={handleStartEditDemo}
            handleDeleteDemo={handleDeleteDemo}
            handleOpenCreateDemoLinkModal={handleOpenCreateDemoLinkModal}
          />
        );
      })}
    </div>
  );
}
