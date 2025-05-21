import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types/admin';

interface AdminState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  categories: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((cat: Category) => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((cat: Category) => cat.id !== action.payload);

    },
    reorderCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  }
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  setLoading,
  setError
} = adminSlice.actions;

export default adminSlice.reducer;
