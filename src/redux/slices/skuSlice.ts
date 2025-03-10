import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Sku, SkuUpdate } from '../../types/Sku';

// Mock data
let mockSkus: Sku[] = [
  { id: 1, skuCode: 'SK00158', name: 'Crew Neck Merino Wool Sweater', category: 'Tops', department: "Men's Apparel", price: 114.99, cost: 18.28 },
  { id: 2, skuCode: 'SK00269', name: 'Faux Leather Leggings', category: 'Jewelry', department: 'Footwear', price: 9.99, cost: 8.45 },
  { id: 3, skuCode: 'SK00300', name: 'Fleece-Lined Parka', category: 'Jewelry', department: 'Unisex Accessories', price: 199.99, cost: 17.80 },
  { id: 4, skuCode: 'SK00304', name: 'Cotton Polo Shirt', category: 'Tops', department: "Women's Apparel", price: 139.99, cost: 10.78 },
  { id: 5, skuCode: 'SK00766', name: 'Foldable Travel Hat', category: 'Tops', department: 'Footwear', price: 44.99, cost: 27.08 },
  { id: 6, skuCode: 'SK00786', name: 'Chic Quilted Wallet', category: 'Bottoms', department: 'Footwear', price: 14.99, cost: 4.02 },
  { id: 7, skuCode: 'SK00960', name: 'High-Slit Maxi Dress', category: 'Outerwear', department: 'Sportswear', price: 74.99, cost: 47.47 },
  { id: 8, skuCode: 'SK01183', name: 'Turtleneck Cable Knit Sweater', category: 'Footwear', department: 'Footwear', price: 49.99, cost: 22.60 },
  { id: 9, skuCode: 'SK01189', name: 'Retro-Inspired Sunglasses', category: 'Bottoms', department: "Women's Apparel", price: 194.99, cost: 115.63 },
  { id: 10, skuCode: 'SK01193', name: 'Stretch Denim Overalls', category: 'Bottoms', department: 'Unisex Accessories', price: 129.99, cost: 47.06 }
];

interface SkuState {
  skus: Sku[];
  loading: boolean;
  error: string | null;
}

const initialState: SkuState = {
  skus: [],
  loading: false,
  error: null,
};

export const fetchSkus = createAsyncThunk(
  'sku/fetchSkus',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSkus;
  }
);

export const addSku = createAsyncThunk(
  'sku/addSku',
  async (sku: Omit<Sku, 'id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newSku = {
      ...sku,
      id: mockSkus.length + 1,
    };
    mockSkus.push(newSku);
    return newSku;
  }
);

export const updateSku = createAsyncThunk(
  'sku/updateSku',
  async ({ id, updates }: { id: number; updates: SkuUpdate }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const sku = mockSkus.find(s => s.id === id);
    if (!sku) throw new Error('SKU not found');
    // const updatedSku = { ...sku, ...updates };
    const index = mockSkus.findIndex(s => s.id === id);
    if (index === -1) throw new Error("SKU not found");
    mockSkus = mockSkus.map((sku) =>
      sku.id === id ? { ...sku, ...updates } : sku
    );

    return mockSkus;
  }
);

export const deleteSku = createAsyncThunk(
  'sku/deleteSku',
  async (id: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockSkus.findIndex(s => s.id === id);
    if (index !== -1) mockSkus.splice(index, 1);
    return id;
  }
);

export const reorderSkus = createAsyncThunk(
  'sku/reorderSkus',
  async (skus: Sku[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    mockSkus.length = 0;
    mockSkus.push(...skus);
    return skus;
  }
);

const skuSlice = createSlice({
  name: 'sku',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkus.fulfilled, (state, action) => {
        state.loading = false;
        state.skus = action.payload;
      })
      .addCase(fetchSkus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch SKUs';
      })
      .addCase(addSku.fulfilled, (state, action) => {
        state.skus.push(action.payload);
      })
      .addCase(updateSku.fulfilled, (state, action) => {
        const index = state.skus.findIndex(sku => sku.id === action.payload.id);
        if (index !== -1) {
          state.skus[index] = action.payload;
        }
      })
      .addCase(deleteSku.fulfilled, (state, action) => {
        state.skus = state.skus.filter(sku => sku.id !== action.payload);
      })
      .addCase(reorderSkus.fulfilled, (state, action) => {
        state.skus = action.payload;
      });
  },
});

export default skuSlice.reducer; 