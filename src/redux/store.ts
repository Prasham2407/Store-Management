import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slices/storeSlice";
import skuReducer from "./slices/skuSlice";
import planningReducer from "./slices/planningSlice";

export const store = configureStore({
  reducer: {
    store: storeReducer,
    sku: skuReducer,
    planning: planningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
