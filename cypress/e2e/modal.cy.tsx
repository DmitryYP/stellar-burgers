/// <reference types="cypress" />
// data-cy='modal-overlay'   оверлей модалки
// data-cy='modal'  модалка
// data-cy='modal_close-button'  кнопка закрыть у модалки

describe('Тест модального окна', () => {
  // перехват запроса
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit('/');
  });
  it('Открытие модального окна', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');
    cy.get('[data-cy="modal"]').find('button').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('Закрытие модального окна по кнопке', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy="modal_close-button"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('Закрытие модального окна по клику на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
