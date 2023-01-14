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
        title = createElement('h1', 'title', 'Найди пару'),
        game = createElement('ul', 'game');

  renderElement(container, title);
  renderElement(container, game);
  renderElement(sectionMain, container);
  renderElement(document.body, sectionMain);

  const modal = createElement('div', 'modal'),
        modalContainer = createElement('div', 'modal__container'),
        modalMessage = createElement('span', 'modal__message'),
        modalBtn = createElement('button', 'modal__btn', 'Сыграть ещё раз'),
        modalMessages = {
          win: 'Победа!',
          lose: 'Время вышло!'
        };

  modalBtn.addEventListener('click', () => {
    closeModal();
    startGame(8, 60);
  });

  renderElement(modalContainer, modalMessage);
  renderElement(modalContainer, modalBtn);
  renderElement(modal, modalContainer);
  renderElement(document.body, modal);

  function openModal(message) {
    modalMessage.textContent = message;
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  const timer = createElement('div', 'timer'),
  timerMinutes = createElement('span', 'timer__minutes'),
  timerSeparator = createElement('span', 'timer__separator', ':'),
  timerSeconds = createElement('span', 'timer__seconds');

  renderElement(timer, timerMinutes);
  renderElement(timer, timerSeparator);
  renderElement(timer, timerSeconds);
  title.after(timer);

  let timerInterval = null;

  // function setTimer(time) {
  //   function addZero(num) {
  //     if (num < 10 && num >= 0) {
  //       return `0${num}`;
  //     }
  //     return num;
  //   }

  //   function updateTimer() {
  //     const minutes = Math.floor(curentTime / 60),
  //     seconds = curentTime % 60;
  //     timerMinutes.textContent = addZero(minutes);
  //     timerSeconds.textContent = addZero(seconds);
  //     if (curentTime <= 0) {
  //       clearInterval(timerInterval);
  //       openModal(modalMessages.lose);
  //     }
  //     curentTime--;
  //   }

  //   let curentTime = time;
  //   updateTimer();
  //   timerInterval = setInterval(updateTimer, 1000);
  // }

      function addZero(num) {
      if (num < 10 && num >= 0) {
        return `0${num}`;
      }
      return num;
    }

      function renderTime(time) {

        const minutes = Math.floor(time / 60),
              seconds = time % 60;
        timerMinutes.textContent = addZero(minutes);
        timerSeconds.textContent = addZero(seconds);
    }

    function setTimer(currentTime) {
      function updateTimer() {
        renderTime(currentTime);
        if (currentTime <= 0) {
          clearInterval(timerInterval);
          openModal(modalMessages.lose);
        }
        currentTime--;
      }

      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }


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

  function startGame(amountPairs, time) {
    game.replaceChildren();
    const arrOfNumbers = createArrayOfNumbers(amountPairs);
    shuffleArray(arrOfNumbers);
    createAndInsertCards(arrOfNumbers, game);

    const storage = {
      firstCard: null,
      secondCard: null,
      openedCards: 0,
      startGame: false
    };

    renderTime(time);
    setTimer(time);

    game.addEventListener('click', (e) => {
      const currenElement = e.target;

      if (!currenElement.classList.contains('card') ||
           currenElement.classList.contains('card--success') ||
           currenElement.classList.contains('card--open')) {
            return;
      }

      // if(!storage.startGame) {
      //   storage.startGame = true;
      //   setTimer(60);
      // }

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
          clearInterval(timerInterval)
          openModal(modalMessages.win);
          storage.openedCards = 0;
        }
      }
    });
  }

  startGame(8, 60);
});
