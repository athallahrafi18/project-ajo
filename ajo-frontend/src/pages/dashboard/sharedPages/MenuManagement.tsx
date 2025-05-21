import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Product } from '../../../types';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, AlertTriangle,
  Filter, Search, ToggleLeft, ToggleRight,
} from 'lucide-react';
import Loading from '../../../components/Loading';
import ItemModal from '../../../components/modals/ItemModal';
import ConfirmModal from '../../../components/modals/ConfirmModal';

const MenuManagement = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [menus, setMenus] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/menus', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(res.data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data menu');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const names = res.data.map((cat: { name: string }) => cat.name);
      setCategoryList(names);
    } catch (err) {
      console.error('Gagal mengambil kategori', err);
    }
  }, [token]);

  const handleDelete = async () => {
    if (!deleteItemId) return;
    try {
      await axios.delete(`http://localhost:8000/api/menus/${deleteItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus((prev) => prev.filter((menu) => menu.id !== deleteItemId));
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleToggleStatus = async (item: Product) => {
    const newStatus = item.status === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      await axios.patch(
        `http://localhost:8000/api/menus/${item.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setMenus((prev) =>
        prev.map((menu) =>
          menu.id === item.id ? { ...menu, status: newStatus } : menu
        )
      );
    } catch (error) {
      console.error('Gagal mengubah status:', error);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, [fetchMenus, fetchCategories]);

  const filteredItems = menus.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in-stock' && item.status === 'In Stock') ||
      (statusFilter === 'out-of-stock' && item.status === 'Out of Stock');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Add New Item</span>
        </button>
      </div>

      {menus.filter(item => item.status === 'Out of Stock').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              {menus.filter(item => item.status === 'Out of Stock').length} items are currently out of stock
            </p>
          </div>
        </motion.div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h2>
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-[1024px] w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="h-[300px] flex items-center justify-center">
                        <Loading />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-red-500">{error}</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">No Menus found.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-5">
                          <button onClick={() => setSelectedItem(item)} className="text-primary-600 hover:text-primary-900" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`transition duration-300 transform hover:scale-110 ${item.status === 'In Stock' ? 'text-green-600' : 'text-yellow-500'}`}
                            title="Toggle Status"
                          >
                            {item.status === 'In Stock' ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </button>
                          <button onClick={() => setDeleteItemId(item.id)} className="text-red-600 hover:text-red-900" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ItemModal
        isOpen={showAddModal || !!selectedItem}
        onClose={() => {
          setShowAddModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem || undefined}
        onSave={() => {
          fetchMenus();
          setShowAddModal(false);
          setSelectedItem(null);
        }}
        token={token}
        categories={categoryList}
      />

      <ConfirmModal
        isOpen={deleteItemId !== null}
        message="Apakah kamu yakin ingin menghapus menu ini? Tindakan ini tidak bisa dibatalkan."
        onCancel={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MenuManagement;
