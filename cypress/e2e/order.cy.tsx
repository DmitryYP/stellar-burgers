/// <reference types="cypress" />
// data-cy='burger-constructor'   конструктор бургера
// data-cy={ingredient._id}   ингредиент по айди
// data-cy='ingredient-name'   название ингредиента
// data-cy='button'  кнопка добавить

describe('Тест создания заказа', () => {
  // перехват запроса
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');
    // мокаем токины
    cy.setCookie('accessToken', 'some-access-token');
    window.localStorage.setItem('refreshToken', 'some-refresh-token');
    cy.visit('/');
  });
  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });
  it('Тест создания заказа', () => {
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click();
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click();
    cy.get('[data-cy="burger-constructor"]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy="burger-constructor"]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get("[data-cy='order-button']").click();
    cy.wait('@createOrder');
    // проверка открывшейся модалки
    cy.contains('Ваш заказ начали готовить').should('exist');
    cy.contains('93713').should('exist');
    // проверка закрытия модалки
    cy.get('[data-cy="modal_close-button"]').click();
    cy.contains('Ваш заказ начали готовить').should('not.exist');
    // проверка что конструктор очистился
    cy.get('[data-cy="burger-constructor"]')
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get('[data-cy="burger-constructor"]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
  });
});
