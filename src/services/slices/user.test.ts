import { TUser } from '@utils-types';
import {
  fetchUser,
  registerUser,
  loginUser,
  logout,
  updateUser,
  userReducer,
  initialState
} from './user';

const mockUser: TUser = {
  name: 'Витя Арахис',
  email: 'vitya@gmail.com'
};

describe('userReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  // проверка fetchUser
  it('Состояние при fetchUser.pending', () => {
    const state = userReducer(initialState, { type: fetchUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Состояние при fetchUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Состояние при fetchUser.rejected', () => {
    const state = userReducer(initialState, {
      type: fetchUser.rejected.type,
      payload: 'unauthorized'
    });
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  // проверка registerUser
  it('Состояние при registerUser.pending', () => {
    const state = userReducer(initialState, {
      type: registerUser.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Состояние при registerUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Состояние при registerUser.rejected', () => {
    const errorMsg = 'Ошибка регистрации';
    const state = userReducer(initialState, {
      type: registerUser.rejected.type,
      payload: errorMsg
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // проверка loginUser
  it('Состояние при loginUser.pending', () => {
    const state = userReducer(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Состояние при loginUser.fulfilled', () => {
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Состояние при loginUser.rejected', () => {
    const errorMsg = 'Ошибка при входе';
    const state = userReducer(initialState, {
      type: loginUser.rejected.type,
      payload: errorMsg
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // провека logout
  it('Состояние при logout.fulfilled', () => {
    const state = userReducer(initialState, { type: logout.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  // проверка updateUser
  it('Состояние при updateUser.pending', () => {
    const state = userReducer(initialState, { type: updateUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Состояние при updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Витя Неарахис' };
    const state = userReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(updatedUser);
  });

  it('Состояние при updateUser.rejected', () => {
    const errorMsg = 'Ошибка при обновлении данных';
    const state = userReducer(initialState, {
      type: updateUser.rejected.type,
      payload: errorMsg
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
