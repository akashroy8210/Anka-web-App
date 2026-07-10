import { api } from './api.service';

export const categoryService = {
  getCategories: api.getCategories,
  getCategory: api.getCategory,
  createCategory: api.createCategory,
  updateCategory: api.updateCategory,
  deleteCategory: api.deleteCategory,
};
