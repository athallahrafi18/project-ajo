import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderTree, Plus, Edit, Trash2, ChevronRight, ChevronDown,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { RootState } from '../../../store';
import { Category } from '../../../types/admin';
import { setCategories } from '../../../store/slices/adminSlice';
import { DragEndEvent } from '@dnd-kit/core';
import api from '../../../utils/api';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.admin.categories);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentId: '',
        attributes: []
    });

    const fetchCategories = useCallback(async () => {
        try {
          const res = await api.get('/categories');
          dispatch(setCategories(res.data));
        } catch (error) {
          console.error('Gagal mengambil kategori', error);
        }
      }, [dispatch]); // tambahkan dependency jika dispatch berubah (jarang)

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await api.put(`/categories/${selectedCategory.id}`, {
                    name: formData.name,
                    description: formData.description,
                    parentId: formData.parentId || null
                });
            } else {
                await api.post('/categories', {
                    name: formData.name,
                    description: formData.description,
                    parentId: formData.parentId || null
                });
            }
            fetchCategories();
            setShowAddModal(false);
            setSelectedCategory(null);
            setFormData({ name: '', description: '', parentId: '', attributes: [] });
        } catch (error) {
            console.error('Gagal menyimpan kategori', error);
            alert('Gagal menyimpan kategori');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Gagal menghapus kategori', error);
            alert('Gagal menghapus kategori');
        }
    };

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    const toggleExpand = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((cat: Category) => cat.id === active.id);
            const newIndex = categories.findIndex((cat: Category) => cat.id === over.id);
            dispatch(setCategories(arrayMove(categories, oldIndex, newIndex)));
        }
    };

    const renderCategoryTree = (parentId: string | undefined = undefined, level = 0) => {
        const categoryItems = categories.filter((cat: Category) => cat.parentId === parentId);
        return (
            <div className={`${level > 0 ? 'ml-6' : ''}`}>
                {categoryItems.map((category: Category) => (
                    <div key={category.id}>
                        <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                            <button onClick={() => toggleExpand(category.id)} className="p-1 hover:bg-gray-100 rounded">
                                {expandedCategories.has(category.id)
                                    ? <ChevronDown className="h-4 w-4 text-gray-500" />
                                    : <ChevronRight className="h-4 w-4 text-gray-500" />}
                            </button>
                            <FolderTree className="h-5 w-5 text-primary-600" />
                            <span className="flex-1 text-sm font-medium">{category.name}</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => {
                                    setSelectedCategory(category);
                                    setFormData({
                                        name: category.name,
                                        description: category.description || '',
                                        parentId: category.parentId || '',
                                        attributes: []
                                    });
                                    setShowAddModal(true);
                                }} className="p-1 text-gray-400 hover:text-gray-600">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-red-400 hover:text-red-600" onClick={() => handleDelete(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        {expandedCategories.has(category.id) && renderCategoryTree(category.id, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
                <button onClick={() => {
                    setShowAddModal(true);
                    setSelectedCategory(null);
                    setFormData({ name: '', description: '', parentId: '', attributes: [] });
                }} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                    <Plus className="h-4 w-4 inline-block mr-2" />Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                            {renderCategoryTree()}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-lg p-6 max-w-lg w-full">
                            <h2 className="text-xl font-semibold mb-4">{selectedCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                                    <select value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">None</option>
                                        {categories.map((cat: Category) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button type="button" onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedCategory(null);
                                        setFormData({ name: '', description: '', parentId: '', attributes: [] });
                                    }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">
                                        {selectedCategory ? 'Update Category' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryPage;
