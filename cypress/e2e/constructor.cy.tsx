/// <reference types="cypress" />
// data-cy='burger-constructor'   конструктор бургера
// data-cy={ingredient._id}   ингредиент по айди
// data-cy='ingredient-name'   название ингредиента
// data-cy='button'  кнопка добавить ингредиент

describe('Тест страницы конструктора бургера', () => {
  // перехват запроса на эндпоин
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    });

    cy.visit('/');
  });
  //загрузка ингередиентов
  it('Загрузка ингредиентов', () => {
    // Проверяем, что ингредиенты есть
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('Добавление ингредиентов', () => {
    // Добавляем булочку
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click();
    // Проверяем, что булочку добавилась в конструктор
    cy.get('[data-cy="burger-constructor"]')
      .contains('Краторная булка N-200i')
      .should('exist');

    // Добавляем котлету
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click();
    // Проверяем, что котлета добавилась в конструктор
    cy.get('[data-cy="burger-constructor"]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});
