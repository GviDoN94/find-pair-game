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

  function renderElement(parent, element) {
    parent.append(element);
  }

  const sectionMain = createElement('section', 'main'),
        container = createElement('div', 'container'),
        title = createElement('h1', 'title', 'Игра в пары'),
        game = createElement('ul', 'game'),
        playAgainBtn = createElement('button', 'play-again-btn', 'Сыграть ещё раз');

  playAgainBtn.addEventListener('click', () => {
    startGame(8);
    playAgainBtn.style.display = 'none';
  });

  renderElement(document.body, sectionMain);
  renderElement(sectionMain, container);
  renderElement(container, title);
  renderElement(container, game);
  renderElement(container, playAgainBtn);

  function createArrayOfNumbers(amount) {
    const arr = [];
    for (let i = 1; i <= amount; i++) {
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
      renderElement(parent, card);
    });
  }

  function startGame(amountPairs) {
    game.replaceChildren();
    const arrOfNumbers = createArrayOfNumbers(amountPairs);
    shuffleArray(arrOfNumbers);
    createAndInsertCards(arrOfNumbers, game);

    const storage = {
      firstCard: null,
      secondCard: null,
      openedCards: 0
    };

    game.addEventListener('click', (e) => {
      const currenElement = e.target;

      if (!currenElement.classList.contains('card') ||
           currenElement.classList.contains('card--success') ||
           currenElement.classList.contains('card--open')) {
            return;
      }

      if (storage.secondCard && storage.firstCard.textContent !== storage.secondCard.textContent) {
        storage.firstCard.classList.remove('card--open');
        storage.secondCard.classList.remove('card--open');
        storage.firstCard = null;
        storage.secondCard = null;
      }

      if (!storage.firstCard) {
        storage.firstCard = currenElement;
        storage.firstCard.classList.add('card--open');
      } else if (storage.firstCard.textContent !== currenElement.textContent) {
        storage.secondCard = currenElement;
        storage.secondCard.classList.add('card--open');
      } else {
        storage.firstCard.classList.add('card--success');
        currenElement.classList.add('card--success');
        storage.firstCard = null;
        storage.secondCard = null;
        storage.openedCards++;

        if(storage.openedCards === amountPairs) {
          playAgainBtn.style.display = 'block';
          storage.openedCards = 0;
        }
      }
    });
  }

  startGame(8);
});
