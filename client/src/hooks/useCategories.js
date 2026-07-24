import { useState } from 'react';
import { categoryService } from '../services/category.service';

export function useCategories(initialCategories, fetchAllData) {
  const [categories, setCategories] = useState(initialCategories || []);
  
  // Category Form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catImages, setCatImages] = useState([]);
  
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [isUploadingCatGallery, setIsUploadingCatGallery] = useState(false);

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatImages, setEditCatImages] = useState([]);
  const [editCatIsActive, setEditCatIsActive] = useState(true);

  const [isUploadingEditCatImage, setIsUploadingEditCatImage] = useState(false);
  const [isUploadingEditCatGallery, setIsUploadingEditCatGallery] = useState(false);

  const handleCreateCategory = async (e, token) => {
    e.preventDefault();
    if (!catName || !catSlug) return;

    try {
      const res = await categoryService.createCategory({
        name: catName,
        slug: catSlug.toLowerCase(),
        description: catDesc,
        imageUrl: catImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        images: catImages,
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
      alert('Error creating surprise category.');
    }
  };

  const handleDeleteCategory = async (categoryId, token) => {
    if (!window.confirm('Are you sure you want to delete this category? All child design themes will be affected.')) return;
    try {
      const res = await categoryService.deleteCategory(categoryId, token);
      if (res.success) {
        setCategories(categories.filter(c => c._id !== categoryId));
        alert('Category deleted successfully.');
      } else {
        alert(res.message || 'Error deleting category');
      }
    } catch (err) {
      alert('Error connecting to delete category service.');
    }
  };

  const handleStartEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDesc(cat.description);
    setEditCatImage(cat.imageUrl || '');
    setEditCatImages(cat.images || []);
    setEditCatIsActive(cat.isActive !== false);
  };

  const handleUpdateCategorySubmit = async (e, token) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await categoryService.updateCategory(editingCategory._id, {
        name: editCatName,
        slug: editCatSlug.toLowerCase(),
        description: editCatDesc,
        imageUrl: editCatImage,
        images: editCatImages,
        isActive: editCatIsActive
      }, token);
      if (res.success) {
        setCategories(categories.map(c => c._id === editingCategory._id ? { ...c, ...res.category } : c));
        setEditingCategory(null);
        setEditCatImages([]);
        alert('Category details updated successfully!');
        if (fetchAllData) fetchAllData();
      } else {
        alert(res.message || 'Error updating category details');
      }
    } catch (err) {
      alert('Error updating category.');
    }
  };

  return {
    categories,
    setCategories,
    catName,
    setCatName,
    catSlug,
    setCatSlug,
    catDesc,
    setCatDesc,
    catImage,
    setCatImage,
    catImages,
    setCatImages,
    isUploadingCatImage,
    setIsUploadingCatImage,
    isUploadingCatGallery,
    setIsUploadingCatGallery,
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
    isUploadingEditCatImage,
    setIsUploadingEditCatImage,
    isUploadingEditCatGallery,
    setIsUploadingEditCatGallery,
    handleCreateCategory,
    handleDeleteCategory,
    handleStartEditCategory,
    handleUpdateCategorySubmit
  };
}
