import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Store {
  id: number;
  name: string;
  city: string;
  state: string;
}

interface StoreState {
  stores: Store[];
}

const initialState: StoreState = {
  stores: [
    { id: 1, name: "Atlanta Outfitters", city: "Atlanta", state: "GA" },
    { id: 2, name: "Chicago Charm Boutique", city: "Chicago", state: "IL" },
  ],
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    addStore: (state, action: PayloadAction<Store>) => {
      state.stores.push(action.payload);
    },
    removeStore: (state, action: PayloadAction<number>) => {
      state.stores = state.stores.filter((store) => store.id !== action.payload);
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.stores.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    reorderStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
  },
});

export const { addStore, removeStore, updateStore, reorderStores } = storeSlice.actions;
export default storeSlice.reducer;
