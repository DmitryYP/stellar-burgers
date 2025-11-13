import { rootReducer } from './store';

describe('Проверка rootReducer', () => {
  it('проверка инициализации', () => {
    const state = rootReducer(undefined, { type: '' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burgerConstructor');
  });
  it('проверка при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(rootReducer(undefined, { type: '' }));
  });
});
