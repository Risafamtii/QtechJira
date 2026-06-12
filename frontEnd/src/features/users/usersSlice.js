import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

// Normalize an Axios error into { message, fieldErrors } (same shape as authSlice).
const normalizeError = (error) => {
  const res = error.response?.data;
  return {
    message: res?.message || error.message || 'Something went wrong',
    fieldErrors: res?.errors || null,
  };
};

const withRejectValue = (fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
};

// --- thunks --------------------------------------------------------------

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  withRejectValue((params) => userApi.listUsers(params))
);

export const createUser = createAsyncThunk(
  'users/create',
  withRejectValue((payload) => userApi.createUser(payload))
);

export const updateUser = createAsyncThunk(
  'users/update',
  withRejectValue(({ id, payload }) => userApi.updateUser(id, payload))
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  withRejectValue((id) => userApi.deleteUser(id))
);

// --- slice ---------------------------------------------------------------

const initialState = {
  items: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.meta = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to load users';
      })
      // create — prepend in place, no refetch
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.meta.total += 1;
      })
      // update — replace by id
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete — filter out
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload.id);
        state.meta.total = Math.max(state.meta.total - 1, 0);
      });
  },
});

export default usersSlice.reducer;
