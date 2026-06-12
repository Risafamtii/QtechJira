import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketApi from '../../api/ticketApi';

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

export const fetchTickets = createAsyncThunk(
  'tickets/fetchList',
  withRejectValue((params) => ticketApi.listTickets(params))
);

export const fetchTicket = createAsyncThunk(
  'tickets/fetchOne',
  withRejectValue((id) => ticketApi.getTicket(id))
);

export const createTicket = createAsyncThunk(
  'tickets/create',
  withRejectValue((payload) => ticketApi.createTicket(payload))
);

export const updateTicket = createAsyncThunk(
  'tickets/update',
  withRejectValue(({ id, payload }) => ticketApi.updateTicket(id, payload))
);

export const deleteTicket = createAsyncThunk(
  'tickets/delete',
  withRejectValue((id) => ticketApi.deleteTicket(id))
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  withRejectValue(({ id, payload }) => ticketApi.updateStatus(id, payload))
);

export const assignTicket = createAsyncThunk(
  'tickets/assign',
  withRejectValue(({ id, payload }) => ticketApi.assignTicket(id, payload))
);

export const addComment = createAsyncThunk(
  'tickets/addComment',
  withRejectValue(({ id, payload }) => ticketApi.addComment(id, payload))
);

// --- slice ---------------------------------------------------------------

const initialState = {
  items: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  current: null,
  listStatus: 'idle',
  listError: null,
  detailStatus: 'idle',
  detailError: null,
};

// Replace a ticket in the loaded list, if present.
const replaceInList = (state, ticket) => {
  const idx = state.items.findIndex((t) => t._id === ticket._id);
  if (idx !== -1) state.items[idx] = ticket;
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearCurrentTicket(state) {
      state.current = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchTickets.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.items;
        state.meta = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload?.message || 'Failed to load tickets';
      })
      // detail
      .addCase(fetchTicket.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.current = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload?.message || 'Failed to load ticket';
      })
      // create — prepend in place
      .addCase(createTicket.fulfilled, (state, action) => {
        if (state.items.length) state.items.unshift(action.payload);
        state.current = action.payload;
      })
      // delete — filter out
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload.id);
        if (state.current?._id === action.payload.id) state.current = null;
      });

    // update / status / assign / comment all return the updated ticket.
    [updateTicket, updateTicketStatus, assignTicket, addComment].forEach(
      (thunk) => {
        builder.addCase(thunk.fulfilled, (state, action) => {
          state.current = action.payload;
          replaceInList(state, action.payload);
        });
      }
    );
  },
});

export const { clearCurrentTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;
