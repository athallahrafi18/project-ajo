import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { formatRupiah } from '../utils/formatCurrency';

interface MenuCardProps {
  item: Product;
  showBestSellerBadge?: boolean; // Tambahkan prop ini
}

const MenuCard: React.FC<MenuCardProps> = ({ item, showBestSellerBadge = false }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product: item, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48">
        {/* BADGE BEST SELLER */}
        {showBestSellerBadge && (
          <span className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            Best Seller
          </span>
        )}
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-secondary-900">{item.name}</h3>
          <span className="text-primary-600 font-semibold">{formatRupiah(item.price)}</span>
        </div>
        <p className="text-secondary-600 text-sm mb-4">{item.description}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
