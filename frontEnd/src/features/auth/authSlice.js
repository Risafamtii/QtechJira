import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { TOKEN_KEY, USER_KEY } from '../../utils/constants';

// --- helpers -------------------------------------------------------------

const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistAuth = ({ user, token }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Normalize an Axios error into { message, fieldErrors }.
const normalizeError = (error) => {
  const res = error.response?.data;
  return {
    message: res?.message || error.message || 'Something went wrong',
    fieldErrors: res?.errors || null,
  };
};

// --- thunks --------------------------------------------------------------

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authApi.login(credentials);
      persistAuth(result);
      return result;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authApi.register(payload);
      persistAuth(result);
      return result;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

// --- slice ---------------------------------------------------------------

const initialState = {
  user: readUser(),
  token: localStorage.getItem(TOKEN_KEY) || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  fieldErrors: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearAuth();
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.fieldErrors = null;
    },
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.status = 'loading';
      state.error = null;
      state.fieldErrors = null;
    };
    const onFulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
    };
    const onRejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload?.message || 'Request failed';
      state.fieldErrors = action.payload?.fieldErrors || null;
    };

    builder
      .addCase(loginThunk.pending, onPending)
      .addCase(loginThunk.fulfilled, onFulfilled)
      .addCase(loginThunk.rejected, onRejected)
      .addCase(registerThunk.pending, onPending)
      .addCase(registerThunk.fulfilled, onFulfilled)
      .addCase(registerThunk.rejected, onRejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
