import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../../api/dashboardApi';

const normalizeError = (error) => {
  const res = error.response?.data;
  return res?.message || error.message || 'Something went wrong';
};

export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getStats();
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load stats';
      });
  },
});

export default dashboardSlice.reducer;
