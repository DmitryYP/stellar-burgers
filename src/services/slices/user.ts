import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false
};

// fetch текущего пользователя
export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      return rejectWithValue('unauthorized');
    }
  }
);

// Регистрация
export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('user/register', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    if (res.success && res.accessToken && res.refreshToken) {
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    return res.user;
  } catch (res: any) {
    return rejectWithValue(res.message || 'Ошибка регистрации');
  }
});

// Вход
export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(credentials);
    if (res.success && res.accessToken && res.refreshToken && res.user) {
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    return res.user;
  } catch (res: any) {
    return rejectWithValue(res.message || 'Ошибка при входе');
  }
});

// Выход
export const logout = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch {
      return rejectWithValue('Ошибка при выходе');
    }
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении данных');
    }
  }
);

// Слайс
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.loading = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = null;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (typeof action.payload === 'string') {
          state.loading = false;
          state.error = action.payload;
        } else {
          state.loading = false;
          state.error = 'Ошибка при регистрации';
        }
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (typeof action.payload === 'string') {
          state.loading = false;
          state.error = action.payload;
        } else {
          state.loading = false;
          state.error = 'Ошибка при входе';
        }
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (typeof action.payload === 'string') {
          state.loading = false;
          state.error = action.payload;
        } else {
          state.loading = false;
          state.error = 'Ошибка при обновлении данных';
        }
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) => state.user.loading;

export const userReducer = userSlice.reducer;
