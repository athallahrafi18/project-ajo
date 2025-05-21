import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  total: number;
}

// 🔹 Fungsi untuk memuat cart dari Local Storage
const loadCartFromLocalStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

// 🔹 Inisialisasi state dengan data dari Local Storage
const initialState: CartState = {
  items: loadCartFromLocalStorage(),
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity; // ✅ Tambahkan quantity jika item sudah ada
      } else {
        state.items.push(action.payload); // ✅ Jika belum ada, tambahkan item baru
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items)); // ✅ Simpan ke Local Storage
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items)); // ✅ Simpan ke Local Storage
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
        localStorage.setItem('cart', JSON.stringify(state.items)); // ✅ Simpan ke Local Storage
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart'); // ✅ Hapus dari Local Storage
    },

    setCartFromLocalStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = calculateTotal(state.items);
    },
  },
});

// 🔹 Fungsi untuk menghitung total harga keranjang
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemTotal = item.product.price * item.quantity;
    const customizationTotal = Object.values(item.customizations || {})
      .reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
    return total + itemTotal + customizationTotal;
  }, 0);
};

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartFromLocalStorage } = cartSlice.actions;
export default cartSlice.reducer;