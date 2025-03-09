import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WeekData, PlanningRow } from '../../types/Planning';

interface PlanningData {
  storeCode: string;
  skuCode: string;
  week: string;
  salesUnits: number;
}

// Sample data
const mockPlanningData: PlanningData[] = [
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W01', salesUnits: 58 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W07', salesUnits: 107 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W09', salesUnits: 0 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W11', salesUnits: 92 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W13', salesUnits: 122 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W15', salesUnits: 38 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W23', salesUnits: 88 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W31', salesUnits: 45 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W35', salesUnits: 197 },
  { storeCode: 'ST035', skuCode: 'SK00158', week: 'W50', salesUnits: 133 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W05', salesUnits: 107 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W06', salesUnits: 104 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W09', salesUnits: 32 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W18', salesUnits: 174 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W23', salesUnits: 174 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W27', salesUnits: 37 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W28', salesUnits: 95 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W29', salesUnits: 161 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W30', salesUnits: 175 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W32', salesUnits: 200 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W33', salesUnits: 120 },
  { storeCode: 'ST035', skuCode: 'SK00269', week: 'W51', salesUnits: 167 },
  // ... add more data as needed
];

interface PlanningState {
  planningData: PlanningData[];
  loading: boolean;
  error: string | null;
}

const initialState: PlanningState = {
  planningData: [],
  loading: false,
  error: null,
};

export const fetchPlanningData = createAsyncThunk(
  'planning/fetchPlanningData',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPlanningData;
  }
);

export const updatePlanningData = createAsyncThunk(
  'planning/updatePlanningData',
  async (data: { storeCode: string; skuCode: string; week: string; salesUnits: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return data;
  }
);

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanningData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanningData.fulfilled, (state, action) => {
        state.loading = false;
        state.planningData = action.payload;
      })
      .addCase(fetchPlanningData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch planning data';
      })
      .addCase(updatePlanningData.fulfilled, (state, action) => {
        const index = state.planningData.findIndex(
          item => 
            item.storeCode === action.payload.storeCode && 
            item.skuCode === action.payload.skuCode &&
            item.week === action.payload.week
        );
        if (index !== -1) {
          state.planningData[index] = action.payload;
        } else {
          state.planningData.push(action.payload);
        }
      });
  },
});

export default planningSlice.reducer; 