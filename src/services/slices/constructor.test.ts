import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  constructorReducer
} from './constructor';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSecondIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('constructorSlice', () => {
  it('добавляет булочку в конструктор', () => {
    const initialState = {
      burger: {
        bun: null,
        ingredients: []
      },
      isLoading: false,
      error: undefined
    };

    const action = addIngredient(mockBun);
    const newState = constructorReducer(initialState, action);

    expect(newState.burger.bun).toMatchObject(mockBun);
    expect(newState.burger.bun?.name).toBe(mockBun.name);
    expect(newState.burger.bun?._id).toBe(mockBun._id);
  });

  it('добавляет ингредиент в конструктор', () => {
    const initialState = {
      burger: {
        bun: null,
        ingredients: []
      },
      isLoading: false,
      error: undefined
    };

    const action = addIngredient(mockIngredient);
    const newState = constructorReducer(initialState, action);

    expect(newState.burger.ingredients.length).toBe(1);
    expect(newState.burger.ingredients[0]).toMatchObject(mockIngredient);
    expect(newState.burger.ingredients[0].id).toBeDefined();
  });

  it('удаляет ингредиент по id', () => {
    const ingredientToRemove = { ...mockIngredient, id: '123' };
    const initialState = {
      burger: {
        bun: null,
        ingredients: [ingredientToRemove]
      },
      isLoading: false,
      error: undefined
    };

    const action = removeIngredient('123');
    const newState = constructorReducer(initialState, action);

    expect(newState.burger.ingredients.length).toBe(0);
  });

  it('перемещает ингредиент в список', () => {
    const ingredient1 = { ...mockIngredient, id: 'a' };
    const ingredient2 = { ...mockSecondIngredient, id: 'b' };

    const initialState = {
      burger: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      },
      isLoading: false,
      error: undefined
    };

    const action = moveIngredient({ from: 0, to: 1 });
    const newState = constructorReducer(initialState, action);

    expect(newState.burger.ingredients[0].id).toBe('b');
    expect(newState.burger.ingredients[1].id).toBe('a');
  });
});
