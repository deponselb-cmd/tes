import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useSeedCategories } from '../hooks/useCategories';
import type { Category, CategoryType, CreateCategoryInput, UpdateCategoryInput } from '../types/api.types';

// Color options for categories
const colorOptions = [
  { value: 'emerald', label: 'Green', class: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
];

// Icon options
const iconOptions = [
  'payments', 'work', 'monetization_on', 'undo', 'home', 'shopping_cart',
  'bolt', 'movie', 'flight', 'restaurant', 'local_gas_station', 'fitness_center',
  'school', 'medical_services', 'pets', 'redeem', 'savings', 'account_balance'
];

// Get color class
const getColorClasses = (color: string | null, isExpense: boolean = false) => {
  const defaultColor = isExpense ? 'rose' : 'emerald';
  const c = color || defaultColor;
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
  };
  return colorMap[c] || { bg: 'bg-gray-500/10', text: 'text-gray-500' };
};

const Settings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    icon: string;
    color: string;
    type: CategoryType;
  }>({
    name: '',
    description: '',
    icon: 'payments',
    color: 'emerald',
    type: 'income',
  });

  const { data: allCategories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const seedMutation = useSeedCategories();

  // Filter categories by search and type
  const incomeCategories = (allCategories || [])
    .filter((cat) => cat.type === 'income')
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const expenseCategories = (allCategories || [])
    .filter((cat) => cat.type === 'expense')
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openCreateModal = (type: CategoryType) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: type === 'income' ? 'payments' : 'shopping_cart',
      color: type === 'income' ? 'emerald' : 'rose',
      type,
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'payments',
      color: category.color || 'emerald',
      type: category.type,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      const input: UpdateCategoryInput = {
        name: formData.name,
        description: formData.description || undefined,
        icon: formData.icon,
        color: formData.color,
      };
      await updateMutation.mutateAsync({ id: editingCategory.id, input });
    } else {
      const input: CreateCategoryInput = {
        name: formData.name,
        description: formData.description || undefined,
        icon: formData.icon,
        color: formData.color,
        type: formData.type,
      };
      await createMutation.mutateAsync(input);
    }
    
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSeedDefaults = async () => {
    if (confirm('This will create default categories. Continue?')) {
      await seedMutation.mutateAsync();
    }
  };

  const renderCategoryItem = (category: Category, isExpense: boolean = false) => {
    const colors = getColorClasses(category.color, isExpense);
    const hoverBorder = isExpense ? 'hover:border-rose-500/50' : 'hover:border-emerald-500/50';

    return (
      <div key={category.id} className={`group flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#29382f] ${hoverBorder} hover:shadow-md transition-all`}>
        <div className="flex items-center gap-4">
          <div className={`size-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text}`}>
            <span className="material-symbols-outlined">{category.icon || 'category'}</span>
          </div>
          <div className="flex flex-col">
            <p className="text-slate-900 dark:text-white font-semibold">{category.name}</p>
            <p className="text-slate-500 dark:text-[#9eb7a8] text-xs">{category.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => openEditModal(category)}
            className="p-2 text-[#9eb7a8] hover:text-white hover:bg-[#29382f] rounded-full transition-colors" 
            title="Edit"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button 
            onClick={() => handleDelete(category.id)}
            disabled={deleteMutation.isPending}
            className="p-2 text-[#9eb7a8] hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors disabled:opacity-50" 
            title="Delete"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="#" className="text-[#9eb7a8] hover:text-primary transition-colors font-medium">Settings</a>
            <span className="text-[#9eb7a8] font-medium">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Categories</span>
          </div>

          {/* Page Heading & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Category Management</h1>
              <p className="text-slate-500 dark:text-[#9eb7a8] text-base font-normal leading-normal">Configure income and expense categories to organize transaction data efficiently.</p>
            </div>
          </div>

          {/* Toolbar (Search & Add) */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-[#29382f] shadow-sm">
            {/* Search Bar */}
            <label className="relative flex w-full sm:max-w-md items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#9eb7a8]">search</span>
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 dark:bg-[#111714] border-none text-slate-900 dark:text-white placeholder-[#9eb7a8] focus:ring-2 focus:ring-primary/50" 
              />
            </label>
            {/* Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              {(!allCategories || allCategories.length === 0) && (
                <button 
                  onClick={handleSeedDefaults}
                  disabled={seedMutation.isPending}
                  className="flex items-center gap-2 bg-slate-200 dark:bg-[#29382f] hover:bg-slate-300 dark:hover:bg-[#3d5245] text-slate-700 dark:text-white px-4 py-3 rounded-full font-medium transition-all whitespace-nowrap disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                  <span>Seed Defaults</span>
                </button>
              )}
              <button 
                onClick={() => openCreateModal('income')}
                className="flex items-center gap-2 bg-primary hover:bg-green-400 text-[#111714] px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading categories...</p>
              </div>
            </div>
          ) : (
            /* Split Layout: Income & Expense */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Income Categories Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-500 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-[20px]">trending_up</span>
                    </span>
                    Income Categories
                  </h2>
                  <span className="text-xs font-semibold bg-slate-200 dark:bg-[#29382f] text-slate-600 dark:text-[#9eb7a8] px-2 py-1 rounded-md">
                    {incomeCategories.length} Total
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {incomeCategories.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-300 dark:border-[#29382f] rounded-xl">
                      <p className="text-slate-500 dark:text-[#9eb7a8]">No income categories</p>
                      <button 
                        onClick={() => openCreateModal('income')}
                        className="text-primary text-sm font-medium hover:underline mt-2"
                      >
                        Add one
                      </button>
                    </div>
                  ) : (
                    incomeCategories.map((cat) => renderCategoryItem(cat, false))
                  )}
                </div>
              </div>

              {/* Expense Categories Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="bg-rose-500/20 text-rose-500 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-[20px]">trending_down</span>
                    </span>
                    Expense Categories
                  </h2>
                  <span className="text-xs font-semibold bg-slate-200 dark:bg-[#29382f] text-slate-600 dark:text-[#9eb7a8] px-2 py-1 rounded-md">
                    {expenseCategories.length} Total
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {expenseCategories.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-300 dark:border-[#29382f] rounded-xl">
                      <p className="text-slate-500 dark:text-[#9eb7a8]">No expense categories</p>
                      <button 
                        onClick={() => openCreateModal('expense')}
                        className="text-primary text-sm font-medium hover:underline mt-2"
                      >
                        Add one
                      </button>
                    </div>
                  ) : (
                    expenseCategories.map((cat) => renderCategoryItem(cat, true))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Footer area / Extra Space */}
          <div className="h-10 w-full"></div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-[#29382f] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-[#29382f] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#29382f] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {/* Type Toggle (only for new) */}
              {!editingCategory && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', color: 'emerald' })}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.type === 'income' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 dark:bg-[#29382f] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', color: 'rose' })}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.type === 'expense' 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-100 dark:bg-[#29382f] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#111714] border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50"
                  placeholder="Category name"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#111714] border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50"
                  placeholder="Short description"
                />
              </div>

              {/* Icon Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 rounded-lg transition-all ${
                        formData.icon === icon
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 dark:bg-[#29382f] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d5245]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-white">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.class} transition-all ${
                        formData.color === color.value
                          ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-surface-dark'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-full bg-slate-100 dark:bg-[#29382f] text-slate-700 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-[#3d5245] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-3 rounded-full bg-primary text-background-dark font-bold hover:bg-green-400 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
