import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  orderBurgerApi,
  getOrdersApi
} from '@api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './constructor';
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  orderModalData: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('feed/createOrder', async (ingredientsIds, { dispatch, rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientsIds);
    dispatch(clearConstructor());

    return res.order;
  } catch (err) {
    const error =
      err instanceof Error ? err.message : 'Ошибка оформления заказа';
    return rejectWithValue(error);
  }
});

export const getFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/getFeed', async (_, { rejectWithValue }) => {
  try {
    const res = await getFeedsApi();
    return res;
  } catch (err) {
    const error =
      err instanceof Error ? err.message : 'Ошибка загрузки ленты заказов';
    return rejectWithValue(error);
  }
});

export const getMyOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feed/getMyOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await getOrdersApi();
    return res;
  } catch (err) {
    const error =
      err instanceof Error ? err.message : 'Ошибка загрузки заказов';
    return rejectWithValue(error);
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feed/getOrderByNumber', async (number: number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Ошибка загрузки заказа';
    return rejectWithValue(error);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка getFeedThunk
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeed.fulfilled,
        (state, { payload: { orders, total, totalToday } }) => {
          state.isLoading = false;
          state.orders = orders;
          state.total = total;
          state.totalToday = totalToday;
        }
      )
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Обработка getMyOrdersThunk
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Обработка getOrderByNumberThunk
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.currentOrder = payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
      })

      // Обработка createOrderThunk
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orderModalData = payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder, clearOrderModal } = feedSlice.actions;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotals = createSelector(
  [
    (state: RootState) => state.feed.total,
    (state: RootState) => state.feed.totalToday
  ],
  (total, totalToday) => ({ total, totalToday })
);
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectCurrentOrder = (state: RootState) => state.feed.currentOrder;
export const selectOrderModalData = (state: RootState) =>
  state.feed.orderModalData;

export const feedReducer = feedSlice.reducer;
