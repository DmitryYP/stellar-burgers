import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface ConstructorState {
  burger: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | undefined;
}

export const initialState: ConstructorState = {
  burger: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: undefined
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавить ингредиент по id
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burger.bun = action.payload;
        } else {
          state.burger.ingredients.push(action.payload);
        }
        localStorage.setItem('burgerConstructor', JSON.stringify(state));
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
      })
    },
    // Удалить ингредиент по id
    removeIngredient: (state, { payload }) => {
      state.burger.ingredients = state.burger.ingredients.filter(
        (item) => item.id !== payload
      );
    },
    // Очистить конструктор
    clearConstructor(state) {
      state.burger.bun = null;
      state.burger.ingredients = [];
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    // Переместить ингредиент
    moveIngredient: (state, { payload }) => {
      const { from, to } = payload;
      const ingredient = state.burger.ingredients.splice(from, 1)[0];
      state.burger.ingredients.splice(to, 0, ingredient);
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state.burger
  }
});

export const { selectBurgerConstructor } = constructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
