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
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to load users';
      })
      // create — prepend in place, no refetch
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // update — replace by id
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete — filter out
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload.id);
      });
  },
});

export default usersSlice.reducer;
