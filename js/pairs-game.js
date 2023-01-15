'use strict';

window.addEventListener('DOMContentLoaded', () => {
  function createElement(name, text, ...classesEl) {
    const element = document.createElement(name);
    if (classesEl.length) {
      element.classList.add(...classesEl);
    }
    if(text) {
      element.textContent = text;
    }
    return element;
  }

  function renderElement(parent, element) {
    parent.append(element);
  }

  const sectionMain = createElement('section', '', 'main'),
        container = createElement('div', '', 'container'),
        title = createElement('h1', 'Найди пару', 'title'),
        form = createElement('form', '', 'form'),
        formTop = createElement('div','','form__top'),
        formInput = createElement('input', '', 'form__input'),
        formBtn = createElement('button', 'Начать игру', 'btn'),
        formDescr = createElement('p',
        `Для начала игры выберите количество карточек по вертикали/горизонтали и
        нажмите кнопку "Начать игру". Возможные варианты (2, 4, 6, 8, 10). По
        умолчанию будет выбрано 4.`,
        'form__descr'),
        game = createElement('ul', '', 'game'),
        storage = {
          firstCard: null,
          secondCard: null,
          openedCards: 0,
          closeCardsTime: null,
          startGame: false
        };

        formInput.value = 4;

  renderElement(container, title);
  renderElement(formTop, formInput);
  renderElement(formTop, formBtn);
  renderElement(form, formTop);
  renderElement(form, formDescr);
  renderElement(container, form);
  renderElement(container, game);
  renderElement(sectionMain, container);
  renderElement(document.body, sectionMain);

  const modal = createElement('div', '', 'modal' , 'hide'),
        modalContainer = createElement('div', '', 'modal__container'),
        modalMessage = createElement('span', '', 'modal__message'),
        modalBtn = createElement('button', 'Сыграть ещё раз', 'btn'),
        modalMessages = {
          win: 'Победа!',
          lose: 'Время вышло!'
        };

  modalBtn.addEventListener('click', () => {
    closeModal();
    startGame(8);
  });

  renderElement(modalContainer, modalMessage);
  renderElement(modalContainer, modalBtn);
  renderElement(modal, modalContainer);
  renderElement(document.body, modal);

  function openModal(message) {
    modalMessage.textContent = message;
    changeClass(modal, 'modal--open', 'modal--close');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    changeClass(modal, 'modal--close', 'modal--open');
    document.body.style.overflow = '';
  }

  const timer = createElement('div', '', 'timer'),
        timerMinutes = createElement('span', '', 'timer__minutes'),
        timerSeparator = createElement('span', ':', 'timer__separator'),
        timerSeconds = createElement('span', '', 'timer__seconds');

  renderElement(timer, timerMinutes);
  renderElement(timer, timerSeparator);
  renderElement(timer, timerSeconds);
  title.after(timer);

  let timerInterval = null;

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
        endGame(modalMessages.lose);
      }
      currentTime--;
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function changeClass(element, newClass, ...oldClasses) {
    element.classList.add(newClass);
    element.classList.remove(...oldClasses);
  }

  function wrongPair () {
    changeClass(storage.firstCard, 'card--close','card--open');
    changeClass(storage.secondCard, 'card--close','card--open');
    storage.firstCard = null;
    storage.secondCard = null;
    clearInterval(storage.closeCardsTime);
  }

  function endGame(message) {
    clearInterval(timerInterval);
    openModal(message);
    storage.firstCard = null;
    storage.openedCards = 0;
    storage.startGame = false;
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
      const card = createElement('li', numberOfCard, 'card', 'card--close');
      renderElement(parent, card);
    });
  }

  function startGame(amountPairs, rows = 4, time = 60) {
    game.replaceChildren();
    game.style.gridTemplateColumns = `repeat(${rows}, 100px)`;
    renderTime(time);
    const arrOfNumbers = createArrayOfNumbers(amountPairs);
    shuffleArray(arrOfNumbers);
    createAndInsertCards(arrOfNumbers, game);

    game.addEventListener('click', (e) => {
      const currenElement = e.target;

      if (!currenElement.classList.contains('card--close')) {
            return;
      }

      clearInterval(storage.closeCardsTime);

      if (!storage.startGame) {
        setTimer(time);
        storage.startGame = true;
      }

      if (storage.firstCard &&
          storage.secondCard &&
          storage.firstCard.textContent !== storage.secondCard.textContent) {
            wrongPair(storage);
          }

      if (!storage.firstCard) {
          storage.firstCard = currenElement;
          changeClass(storage.firstCard, 'card--open', 'card--close');
      } else if (storage.firstCard.textContent !== currenElement.textContent) {
          storage.secondCard = currenElement;
          changeClass(storage.secondCard, 'card--open', 'card--close');
          storage.closeCardsTime = setInterval(wrongPair, 2000, storage);
        } else {
            changeClass(storage.firstCard,
              'card--success', 'card--open', 'card--close');
            changeClass(currenElement,
              'card--success', 'card--open', 'card--close');
            storage.firstCard = null;
            storage.openedCards++;

            if(storage.openedCards === amountPairs) {
              endGame(modalMessages.win);
            }
          }
    });
  }

  startGame(8);
});
