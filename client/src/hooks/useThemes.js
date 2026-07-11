import { useState } from 'react';
import { themeService } from '../services/theme.service';

export function useThemes(categories, setCategories) {
  // Demo Form state (tracked per active category ID)
  const [activeCatDemoFormId, setActiveCatDemoFormId] = useState(null);
  const [demoName, setDemoName] = useState('');
  const [demoVideo, setDemoVideo] = useState('');
  const [demoImage, setDemoImage] = useState('');
  const [demoImages, setDemoImages] = useState([]);
  const [demoLiveUrl, setDemoLiveUrl] = useState('');
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
        price: 0,
        themeSlug: demoName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
  };

  const handleUpdateDemoSubmit = async (e, token) => {
    e.preventDefault();
    if (!editingDemo) return;
    try {
      const res = await themeService.updateDemo(editingDemo._id, {
        name: editDemoName,
        price: 0,
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
    handleUpdateDemoSubmit,
  };
}
