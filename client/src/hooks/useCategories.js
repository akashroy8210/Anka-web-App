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

  // Category Tiers Edit state
  const [editBasicPrice, setEditBasicPrice] = useState(0);
  const [editBasicInclusions, setEditBasicInclusions] = useState('');
  const [editPremiumPrice, setEditPremiumPrice] = useState(0);
  const [editPremiumInclusions, setEditPremiumInclusions] = useState('');
  const [editDeluxePrice, setEditDeluxePrice] = useState(0);
  const [editDeluxeInclusions, setEditDeluxeInclusions] = useState('');

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

  const handleDeleteCategory = async (id, token) => {
    if (!window.confirm('Delete this Category? This will also remove all its design templates!')) return;
    try {
      const res = await categoryService.deleteCategory(id, token);
      if (res.success) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  const handleStartEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDesc(cat.description);
    setEditCatImage(cat.imageUrl || '');
    setEditCatImages(cat.images || []);

    const basicTier = cat.tiers?.find(t => t.name === 'Basic') || { price: 299, inclusions: [] };
    const premiumTier = cat.tiers?.find(t => t.name === 'Premium') || { price: 999, inclusions: [] };
    const deluxeTier = cat.tiers?.find(t => t.name === 'Deluxe') || { price: 1999, inclusions: [] };

    setEditBasicPrice(basicTier.price);
    setEditBasicInclusions(basicTier.inclusions.join(', '));
    setEditPremiumPrice(premiumTier.price);
    setEditPremiumInclusions(premiumTier.inclusions.join(', '));
    setEditDeluxePrice(deluxeTier.price);
    setEditDeluxeInclusions(deluxeTier.inclusions.join(', '));
  };

  const handleUpdateCategorySubmit = async (e, token) => {
    e.preventDefault();
    if (!editingCategory) return;

    const newTiers = [
      {
        name: 'Basic',
        price: Number(editBasicPrice),
        inclusions: editBasicInclusions.split(',').map(s => s.trim()).filter(Boolean)
      },
      {
        name: 'Premium',
        price: Number(editPremiumPrice),
        inclusions: editPremiumInclusions.split(',').map(s => s.trim()).filter(Boolean)
      },
      {
        name: 'Deluxe',
        price: Number(editDeluxePrice),
        inclusions: editDeluxeInclusions.split(',').map(s => s.trim()).filter(Boolean)
      }
    ];

    try {
      const res = await categoryService.updateCategory(editingCategory._id, {
        name: editCatName,
        slug: editCatSlug.toLowerCase(),
        description: editCatDesc,
        imageUrl: editCatImage,
        images: editCatImages,
        tiers: newTiers
      }, token);
      if (res.success) {
        setCategories(categories.map(c => c._id === editingCategory._id ? { ...c, ...res.category } : c));
        setEditingCategory(null);
        setEditCatImages([]);
        alert('Category details and package plans updated successfully!');
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
    editBasicPrice,
    setEditBasicPrice,
    editBasicInclusions,
    setEditBasicInclusions,
    editPremiumPrice,
    setEditPremiumPrice,
    editPremiumInclusions,
    setEditPremiumInclusions,
    editDeluxePrice,
    setEditDeluxePrice,
    editDeluxeInclusions,
    setEditDeluxeInclusions,
    isUploadingEditCatImage,
    setIsUploadingEditCatImage,
    isUploadingEditCatGallery,
    setIsUploadingEditCatGallery,
    handleCreateCategory,
    handleDeleteCategory,
    handleStartEditCategory,
    handleUpdateCategorySubmit,
  };
}
