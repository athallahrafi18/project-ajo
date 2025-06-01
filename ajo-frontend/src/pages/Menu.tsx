import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import { setMenuItems } from '../store/slices/menuSlice';
import { fetchMenus } from '../api';
import { Product } from '../types/index';

const BEST_SELLER_LABEL = "BEST SELLER"; // <--- Tambah konstanta ini

const Menu = () => {
  const dispatch = useDispatch();
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuData, setMenuData] = useState<Product[]>([]);

  useEffect(() => {
    const getMenus = async () => {
      const menus = await fetchMenus();
      setMenuData(menus);
      dispatch(setMenuItems(menus));
    };

    getMenus();
  }, [dispatch]);

  const rawCategories = menuData.map(item => item.category);

  // Parent Categories, tanpa duplikat
  const parentCategories = Array.from(
    new Set(
      rawCategories.map(cat => cat.parent?.name ?? cat.name)
    )
  );

  // Sisipkan Best Seller SETELAH 'All'
  const displayedParentCategories = [BEST_SELLER_LABEL, ...parentCategories.filter(cat => cat !== BEST_SELLER_LABEL)];

  // Subcategories, normal
  const subCategories = Array.from(
    new Set(
      rawCategories
        .filter(cat => {
          if (selectedParentCategory === 'All') return true;
          return (cat.parent?.name ?? cat.name) === selectedParentCategory;
        })
        .map(cat => cat.name)
    )
  );

  // Filtered Menu Items
  const filteredItems = menuData.filter(item => {
    const catName = item.category?.name;
    const parentName = item.category?.parent?.name ?? catName;

    // Logika untuk Best Seller
    if (selectedParentCategory === BEST_SELLER_LABEL) {
      return item.is_best_seller &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const matchesParent = selectedParentCategory === 'All' || parentName === selectedParentCategory;
    const matchesSub = selectedSubCategory === 'All' || catName === selectedSubCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesParent && matchesSub && matchesSearch;
  });

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-serif font-bold text-secondary-900 mb-2">Our Menu</h1>
        <p className="text-secondary-600">Discover our carefully curated selection of dishes</p>
      </motion.div>

      {/* Search */}
      <div className="mb-6 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
      </div>

      {/* Parent Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {/* Tab All */}
        <button
          onClick={() => {
            setSelectedParentCategory('All');
            setSelectedSubCategory('All');
          }}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedParentCategory === 'All'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          All
        </button>

        {/* Tab Best Seller & Parent Categories */}
        {displayedParentCategories.map(parent => (
          <button
            key={parent}
            onClick={() => {
              setSelectedParentCategory(parent);
              setSelectedSubCategory('All');
            }}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedParentCategory === parent
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            {parent}
          </button>
        ))}
      </div>

      {/* Subcategories, HANYA tampil kalau BUKAN Best Seller */}
      {selectedParentCategory !== 'All' && selectedParentCategory !== BEST_SELLER_LABEL && subCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedSubCategory('All')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedSubCategory === 'All'
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-200 text-secondary-700'
            }`}
          >
            All
          </button>

          {subCategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSubCategory === sub
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-200 text-secondary-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="relative">
            {item.status === 'Out of Stock' && (
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center rounded-lg">
                <span className="text-white font-semibold text-sm">Makanan Habis</span>
              </div>
            )}

            <div className={`${item.status === 'Out of Stock' ? 'opacity-40 pointer-events-none' : ''}`}>
              <MenuCard
                item={item}
                showBestSellerBadge={item.is_best_seller && selectedParentCategory !== BEST_SELLER_LABEL}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
