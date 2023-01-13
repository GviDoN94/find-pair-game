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

  function createArrayOfNumbers(amount) {
    const arr = [];
    for (let i = 1; i <= amount / 2; i++) {
      arr.push(i, i);
    }
    return arr;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function createAndInsertCards(arr, parent) {
    arr.forEach(numberOfCard => {
      const card = createElement('li', 'card', numberOfCard);
      addElementIntoParent(parent, card);
    });
  }

  function startGame(amountCards, parent) {
    const arrOfNumbers = createArrayOfNumbers(amountCards);
    shuffleArray(arrOfNumbers);
    createAndInsertCards(arrOfNumbers, parent);

    let firstCard = null,
        secondCard = null;

    parent.addEventListener('click', (e) => {
      const currenElement = e.target;

      if (!currenElement.classList.contains('card') ||
           currenElement.classList.contains('card--success') ||
           currenElement.classList.contains('card--open')) {
            return;
      }

      if (secondCard && firstCard.textContent !== secondCard.textContent) {
        firstCard.classList.remove('card--open');
        secondCard.classList.remove('card--open');
        firstCard = null;
        secondCard = null;
      }

      if (!firstCard) {
        firstCard = currenElement;
        firstCard.classList.add('card--open');
      } else if (firstCard.textContent !== currenElement.textContent) {
        secondCard = currenElement;
        secondCard.classList.add('card--open');
      } else {
        firstCard.classList.add('card--success');
        currenElement.classList.add('card--success');
        firstCard = null;
        secondCard = null;
      }
    });
  }

  const sectionMain = createElement('section', 'main'),
        container = createElement('div', 'container'),
        title = createElement('h1', 'title', 'Пары'),
        game = createElement('ul', 'game');

  addElementIntoParent(document.body, sectionMain);
  addElementIntoParent(sectionMain, container);
  addElementIntoParent(container, title);
  addElementIntoParent(container, game);

  startGame(16, game);
});
