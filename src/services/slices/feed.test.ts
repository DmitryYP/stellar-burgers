import { TOrder, TOrdersData } from '@utils-types';
import {
  clearCurrentOrder,
  clearOrderModal,
  createOrder,
  feedReducer,
  getFeed,
  getMyOrders,
  getOrderByNumber,
  initialState
} from './feed';

const mockFeedData: TOrdersData = {
  orders: [
    {
      _id: '6914b24da64177001b31e574',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2025-11-12T16:14:05.145Z',
      updatedAt: '2025-11-12T16:14:05.345Z',
      number: 94091
    }
  ],
  total: 18134,
  totalToday: 68
};

const mockOrders: TOrder[] = [
  {
    _id: '6914c012a64177001b31e590',
    ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0940'],
    status: 'done',
    name: 'Метеоритный люминесцентный бургер',
    createdAt: '2025-11-12T17:12:50.329Z',
    updatedAt: '2025-11-12T17:12:50.578Z',
    number: 94097
  }
];

const mockOrder: TOrder = {
  _id: '123',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2025-11-13T10:00:00.000Z',
  updatedAt: '2025-11-13T10:00:00.000Z',
  number: 12345,
  ingredients: ['643d69a5c3f7b9001cfa093d']
};

describe('feedReducer', () => {
  // Проверка начального состояния
  it('должен возвращать исходное состояние по умолчанию', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  // Тесты для getFeed thunk
  it('обрабатывает getFeed.pending', () => {
    const state = feedReducer(initialState, { type: getFeed.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  it('обрабатывает getFeed.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: getFeed.fulfilled.type,
      payload: mockFeedData
    });
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(18134);
  });
  it('обрабатывает getFeed.rejected', () => {
    const errorMsg = 'Ошибка загрузки';
    const state = feedReducer(initialState, {
      type: getFeed.rejected.type,
      payload: errorMsg
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // Тесты для getMyOrders
  it('обрабатывает getMyOrders.pending', () => {
    const state = feedReducer(initialState, { type: getMyOrders.pending.type });
    expect(state.isLoading).toBe(true);
  });
  it('обрабатывает getMyOrders.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: getMyOrders.fulfilled.type,
      payload: mockOrders
    });
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });
  it('обрабатывает getMyOrders.rejected', () => {
    const errorMsg = 'Ошибка загрузки заказов';
    const state = feedReducer(initialState, {
      type: getMyOrders.rejected.type,
      payload: errorMsg
    });
    expect(state.error).toBe(errorMsg);
  });

  // Тесты для createOrder
  it('обрабатывает createOrder.pending', () => {
    const state = feedReducer(initialState, { type: createOrder.pending.type });
    expect(state.isLoading).toBe(true);
  });
  it('обрабатывает createOrder.fulfilled', () => {
    const orderData = mockOrders[0];
    const state = feedReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: orderData
    });
    expect(state.isLoading).toBe(false);
    expect(state.orderModalData).toEqual(orderData);
  });
  it('обрабатывает createOrder.rejected', () => {
    const errorMsg = 'Ошибка оформления заказа';
    const state = feedReducer(initialState, {
      type: createOrder.rejected.type,
      payload: errorMsg
    });
    expect(state.error).toBe(errorMsg);
  });

  // Тесты для getOrderByNumber
  it('обрабатывает getOrderByNumber.pending', () => {
    const state = feedReducer(initialState, {
      type: getOrderByNumber.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.currentOrder).toBeNull();
  });

  it('обрабатывает getOrderByNumber.fulfilled', () => {
    const order = mockOrders[0];
    const state = feedReducer(initialState, {
      type: getOrderByNumber.fulfilled.type,
      payload: order
    });
    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(order);
  });

  it('обрабатывает getOrderByNumber.rejected', () => {
    const errorMsg = 'Ошибка загрузки заказа';
    const state = feedReducer(initialState, {
      type: getOrderByNumber.rejected.type,
      payload: errorMsg
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
    expect(state.currentOrder).toBeNull();
  });

  // Тест на очистку текущего заказа
  it('очищает при вызове clearCurrentOrder', () => {
    const prevState = { ...initialState, currentOrder: mockOrder };
    const newState = feedReducer(prevState, clearCurrentOrder());
    expect(newState.currentOrder).toBeNull();
  });

  // Тест на очистку данных модального окна
  it('очищает при вызове clearOrderModal', () => {
    const prevState = { ...initialState, orderModalData: mockOrder };
    const newState = feedReducer(prevState, clearOrderModal());
    expect(newState.orderModalData).toBeNull();
  });
});
