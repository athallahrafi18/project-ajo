import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface MenuState {
  items: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.categories = Array.from(new Set(action.payload.map(item => item.category)));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMenuItems, setLoading, setError } = menuSlice.actions;
export default menuSlice.reducer;