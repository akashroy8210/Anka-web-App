import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryPhotos } from "../data/placeholderData";
import { Camera, Maximize2, X } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function MemoryGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const configContext = useCustomConfig();
  const { config, isEditing, updateGalleryPhotoItem } = configContext || {};
  const isBasic = (configContext?.instance?.tier || '').toLowerCase() === 'basic';
  const rawPhotos = config?.galleryPhotos || galleryPhotos;
  const photos = isBasic ? rawPhotos.slice(0, 3) : rawPhotos;

  return (
    <section id="memory-gallery" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Camera className="w-3.5 h-3.5" />
          Captured Moments
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Our Memory Gallery
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          A collection of small snippets in time. Hover over each card, or tap to enlarge the memory.
        </motion.p>
      </div>

      {/* Masonry CSS Grid layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {photos.map((photo) => {
          const isVideo = photo.url.includes("video") || photo.url.includes(".mp4") || photo.url.startsWith("data:video");
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid glass-panel relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl hover:border-lavender-glow transition-all duration-300 pointer-events-auto"
            >
              {/* Image or Looping Preview Video */}
              {isVideo ? (
                <video
                  src={photo.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              )}

              {/* Upload overlay for editor mode */}
              {isEditing ? (
                <label className="absolute inset-0 bg-black/60 hover:bg-black/80 flex flex-col items-center justify-center gap-1.5 text-white text-xs font-semibold cursor-pointer transition-all z-20 pointer-events-auto">
                  <span>📷 Upload Photo/Video</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = () => {
                          updateGalleryPhotoItem(photo.id, "url", reader.result);
                        };
                      }
                    }}
                    className="hidden"
                  />
                </label>
              ) : (
                /* Hover Caption Overlay */
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="text-white space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg font-display text-white">{photo.title}</h3>
                      <Maximize2 className="w-4 h-4 text-romantic-pink opacity-70 group-hover:opacity-100" />
                    </div>
                    <p className="text-slate-200 text-xs md:text-sm font-sans font-light">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Modal Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} // Prevent click-through closing
              className="relative max-w-4xl max-h-[85vh] bg-transparent flex flex-col justify-center items-center w-full"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-romantic-pink transition-colors p-1 cursor-pointer"
                aria-label="Close image preview"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lightbox Image / Video */}
              <div className="glass-panel overflow-hidden rounded-3xl border border-glass-border shadow-2xl bg-black">
                {selectedPhoto.url.includes("video") || selectedPhoto.url.includes(".mp4") || selectedPhoto.url.startsWith("data:video") ? (
                  <video
                    src={selectedPhoto.url}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-[70vh] object-contain rounded-3xl"
                  />
                ) : (
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-3xl"
                  />
                )}
              </div>

              {/* Lightbox Info */}
              {isEditing ? (
                <div className="w-full text-center mt-4 text-white px-2 space-y-2 z-20 pointer-events-auto max-w-md">
                  <input
                    type="text"
                    value={selectedPhoto.title}
                    onChange={(e) => {
                      updateGalleryPhotoItem(selectedPhoto.id, "title", e.target.value);
                      setSelectedPhoto(prev => ({ ...prev, title: e.target.value }));
                    }}
                    placeholder="Edit Title..."
                    className="text-lg font-bold font-display text-romantic-pink bg-transparent border-b border-dashed border-romantic-pink/40 outline-none w-full text-center focus:border-romantic-pink"
                  />
                  <textarea
                    value={selectedPhoto.caption}
                    onChange={(e) => {
                      updateGalleryPhotoItem(selectedPhoto.id, "caption", e.target.value);
                      setSelectedPhoto(prev => ({ ...prev, caption: e.target.value }));
                    }}
                    placeholder="Edit Caption..."
                    className="text-slate-300 text-sm font-sans bg-transparent border border-dashed border-white/15 rounded-lg p-2 outline-none w-full min-h-[60px] text-center focus:border-romantic-pink"
                  />
                </div>
              ) : (
                <div className="w-full text-center mt-4 text-white px-2">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-romantic-pink">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base font-sans mt-1">
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
