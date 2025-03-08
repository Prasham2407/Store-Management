import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Store, StoreUpdate } from '../../types/Store';

// Mock data
let mockStores: Store[] = [
  { id: 1, storeCode: 'ST035', name: 'San Francisco Bay Trends', city: 'San Francisco', state: 'CA' },
  { id: 2, storeCode: 'ST046', name: 'Phoenix Sunwear', city: 'Phoenix', state: 'AZ' },
  { id: 3, storeCode: 'ST064', name: 'Dallas Ranch Supply', city: 'Dallas', state: 'TX' },
  { id: 4, storeCode: 'ST066', name: 'Atlanta Outfitters', city: 'Atlanta', state: 'GA' },
  { id: 5, storeCode: 'ST073', name: 'Nashville Melody Music Store', city: 'Nashville', state: 'TN' },
  { id: 6, storeCode: 'ST074', name: 'New York Empire Eats', city: 'New York', state: 'NY' },
  { id: 7, storeCode: 'ST091', name: 'Denver Peaks Outdoor', city: 'Denver', state: 'CO' },
];

interface StoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

export const fetchStores = createAsyncThunk(
  'store/fetchStores',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStores;
  }
);

export const addStore = createAsyncThunk(
  'store/addStore',
  async (store: Omit<Store, 'id'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    const newStore: Store = {
      ...store,
      id: mockStores.length + 1,
    };
    mockStores = [...mockStores, newStore];
    return newStore;
  }
);


export const updateStore = createAsyncThunk(
  'store/updateStore',
  async ({ id, updates }: { id: number; updates: StoreUpdate }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const store = mockStores.find(s => s.id === id);
    if (!store) throw new Error('Store not found');
    const updatedStore = { ...store, ...updates };
    const index = mockStores.findIndex(s => s.id === id);
    mockStores[index] = updatedStore;
    return updatedStore;
  }
);

export const deleteStore = createAsyncThunk(
  'store/deleteStore',
  async (id: number) => {
    // Simulate API call
    const index = mockStores.findIndex(s => s.id === id);
    const filteredData = mockStores.filter((i) => i.id !== id);
    if (index !== -1) mockStores = [...filteredData];
    return id;
  }
);

export const reorderStores = createAsyncThunk(
  'store/reorderStores',
  async (stores: Store[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    mockStores.length = 0;
    mockStores.push(...stores);
    return stores;
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stores';
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.stores.push(action.payload);
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(store => store.id === action.payload.id);
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.stores = state.stores.filter(store => store.id !== action.payload);
      })
      .addCase(reorderStores.fulfilled, (state, action) => {
        state.stores = action.payload;
      });
  },
});

export default storeSlice.reducer; 