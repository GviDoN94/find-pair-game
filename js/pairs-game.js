'use strict';
window.addEventListener('DOMContentLoaded', () => {

  function createElement(name, classEl = null, text = null) {
    const element = document.createElement(name);
    if (classEl) {
      element.classList.add(classEl);
    }
    element.textContent = text;
    return element;
  }

  function addElementIntoParent(parent, element) {
    parent.append(element);
  }

  function createCards(amount) {
    for (let i = 0, number = 1; i < amount; i++, number++) {
      const card = createElement('li', 'card'),
            cardNumber = createElement('span', 'card--namber', number);
      addElementIntoParent(card, cardNumber);
      addElementIntoParent(game, card);
      if (i === 7) {
        number = 0;
      }
    }
  }

  const sectionMain = createElement('section', 'main'),
        container = createElement('div', 'container'),
        title = createElement('h1', 'title', 'Пары'),
        game = createElement('ul', 'game');

  addElementIntoParent(document.body, sectionMain);
  addElementIntoParent(sectionMain, container);
  addElementIntoParent(container, title);
  addElementIntoParent(container, game);

  createCards(16);
});
