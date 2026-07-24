import { useState } from 'react';
import { themeService } from '../services/theme.service';

const defaultBasicTier = {
  name: 'Basic',
  price: 399,
  description: 'Standard Surprise Experience',
  features: ['Custom Photos & Music', 'Standard Relationship Timeline (3 Memories)', '6 Reasons Why I Love You', 'Instant Access Link'],
  limits: { photosLimit: 6, timelineLimit: 3, reasonsLimit: 6, dreamsLimit: 3, starsLimit: 5, hasVoiceNotes: false, hasVideoUploads: false, hasLockGates: false }
};

const defaultPremiumTier = {
  name: 'Premium',
  price: 999,
  description: 'Ultimate Interactive Surprise Experience',
  features: ['Voice Note Audio Recording & MP3 Uploads', 'Extended Memory Timeline (10 Memories)', 'Video Upload Support (MP4)', 'Interactive Question & Answer Lock Gates', 'All 12 Reasons & All 6 Future Dreams Unlocked', 'Memory Sky Interactive Stars'],
  limits: { photosLimit: 15, timelineLimit: 10, reasonsLimit: 12, dreamsLimit: 6, starsLimit: 10, hasVoiceNotes: true, hasVideoUploads: true, hasLockGates: true }
};

export function useThemes(categories, setCategories) {
  // Demo Form state (tracked per active category ID)
  const [activeCatDemoFormId, setActiveCatDemoFormId] = useState(null);
  const [demoName, setDemoName] = useState('');
  const [demoVideo, setDemoVideo] = useState('');
  const [demoImage, setDemoImage] = useState('');
  const [demoImages, setDemoImages] = useState([]);
  const [demoLiveUrl, setDemoLiveUrl] = useState('');
  const [demoDescription, setDemoDescription] = useState('');
  const [demoTiers, setDemoTiers] = useState([defaultBasicTier, defaultPremiumTier]);
  const [isUploadingDemoImage, setIsUploadingDemoImage] = useState(false);
  const [isUploadingDemoGallery, setIsUploadingDemoGallery] = useState(false);

  // Demo Edit state
  const [editingDemo, setEditingDemo] = useState(null);
  const [editDemoCategoryId, setEditDemoCategoryId] = useState('');
  const [editDemoName, setEditDemoName] = useState('');
  const [editDemoVideo, setEditDemoVideo] = useState('');
  const [editDemoLiveUrl, setEditDemoLiveUrl] = useState('');
  const [editDemoImage, setEditDemoImage] = useState('');
  const [editDemoImages, setEditDemoImages] = useState([]);
  const [editDemoSlug, setEditDemoSlug] = useState('');
  const [editDemoDescription, setEditDemoDescription] = useState('');
  const [editDemoTiers, setEditDemoTiers] = useState([defaultBasicTier, defaultPremiumTier]);

  const [isUploadingEditDemoImage, setIsUploadingEditDemoImage] = useState(false);
  const [isUploadingEditDemoGallery, setIsUploadingEditDemoGallery] = useState(false);

  const handleCreateDemo = async (e, categoryId, token) => {
    e.preventDefault();
    if (!demoName || !demoVideo || !demoLiveUrl) return;

    try {
      const res = await themeService.createDemo({
        categoryId,
        name: demoName,
        videoUrl: demoVideo,
        imageUrl: demoImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        images: demoImages,
        liveDemoUrl: demoLiveUrl,
        themeSlug: demoName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: demoDescription,
        tiers: demoTiers
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
        setDemoDescription('');
        setDemoTiers([defaultBasicTier, defaultPremiumTier]);
        setActiveCatDemoFormId(null);
        alert('Design Vibe Theme added successfully!');
      } else {
        alert(res.message || 'Error adding design');
      }
    } catch (err) {
      alert('Error connecting to design creation service.');
    }
  };

  const handleDeleteDemo = async (demoId, categoryId, token) => {
    if (!window.confirm('Delete this design theme demo?')) return;
    try {
      const res = await themeService.deleteDemo(demoId, token);
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

  const handleStartEditDemo = (d, categoryId) => {
    setEditingDemo(d);
    setEditDemoCategoryId(categoryId);
    setEditDemoName(d.name);
    setEditDemoVideo(d.videoUrl);
    setEditDemoLiveUrl(d.liveDemoUrl);
    setEditDemoImage(d.imageUrl || '');
    setEditDemoImages(d.images || []);
    setEditDemoSlug(d.themeSlug);
    setEditDemoDescription(d.description || '');
    setEditDemoTiers(d.tiers && d.tiers.length > 0 ? d.tiers : [defaultBasicTier, defaultPremiumTier]);
  };

  const handleUpdateDemoSubmit = async (e, token) => {
    e.preventDefault();
    if (!editingDemo) return;
    try {
      const res = await themeService.updateDemo(editingDemo._id, {
        name: editDemoName,
        videoUrl: editDemoVideo,
        liveDemoUrl: editDemoLiveUrl,
        imageUrl: editDemoImage,
        images: editDemoImages,
        themeSlug: editDemoSlug,
        description: editDemoDescription,
        tiers: editDemoTiers
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
        alert('Design Vibe Theme details & tiers updated successfully!');
      } else {
        alert(res.message || 'Error updating theme details');
      }
    } catch (err) {
      alert('Error updating design theme.');
    }
  };

  return {
    activeCatDemoFormId,
    setActiveCatDemoFormId,
    demoName,
    setDemoName,
    demoVideo,
    setDemoVideo,
    demoImage,
    setDemoImage,
    demoImages,
    setDemoImages,
    demoLiveUrl,
    setDemoLiveUrl,
    demoDescription,
    setDemoDescription,
    demoTiers,
    setDemoTiers,
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
    editDemoTiers,
    setEditDemoTiers,
    isUploadingEditDemoImage,
    setIsUploadingEditDemoImage,
    isUploadingEditDemoGallery,
    setIsUploadingEditDemoGallery,
    handleCreateDemo,
    handleDeleteDemo,
    handleStartEditDemo,
    handleUpdateDemoSubmit,
  };
}
