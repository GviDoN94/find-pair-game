"use strict";

window.addEventListener("DOMContentLoaded", () => {
  function createElement(name, text, ...classesEl) {
    const element = document.createElement(name);
    if (classesEl.length) {
      element.classList.add(...classesEl);
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  }

  function renderElement(parent, element) {
    parent.append(element);
  }

  const sectionMain = createElement("section", "", "main"),
    container = createElement("div", "", "container"),
    title = createElement("h1", "Найди пару", "title"),
    form = createElement("form", "", "form"),
    formTop = createElement("div", "", "form__top"),
    formMinusBtn = createElement("button", "-", "form__minus-btn"),
    formPlusBtn = createElement("button", "+", "form__plus-btn"),
    formInput = createElement("input", "", "form__input"),
    formBtn = createElement("button", "Начать игру", "btn"),
    formError = createElement(
      "span",
      "Введено некорректное значение. Прочитайе правила ниже.",
      "form__error",
      "invisible"
    ),
    formDescr = createElement(
      "p",
      `Для начала игры выберите количество карточек по вертикали/горизонтали и
        нажмите кнопку "Начать игру". Возможные варианты (2, 4, 6, 8, 10).`,
      "form__descr"
    ),
    game = createElement("ul", "", "game", "hide"),
    gameOptions = {
      2: {
        amount: 4,
        time: 30,
        size: 170,
      },
      4: {
        amount: 16,
        time: 60,
        size: 120,
      },
      6: {
        amount: 36,
        time: 120,
        size: 80,
      },
      8: {
        amount: 64,
        time: 300,
        size: 70,
      },
      10: {
        amount: 100,
        time: 420,
        size: 60,
      },
    },
    storage = {
      firstCard: null,
      secondCard: null,
      openedCards: 0,
      closeCardsTime: null,
      startGame: false,
    };

  formInput.value = 4;
  formPlusBtn.type = "button";
  formMinusBtn.type = "button";

  renderElement(container, title);
  renderElement(formTop, formMinusBtn);
  renderElement(formTop, formInput);
  renderElement(formTop, formPlusBtn);
  renderElement(formTop, formBtn);
  renderElement(form, formTop);
  renderElement(form, formError);
  renderElement(form, formDescr);
  renderElement(container, form);
  renderElement(container, game);
  renderElement(sectionMain, container);
  renderElement(document.body, sectionMain);

  const modal = createElement("div", "", "modal", "invisible"),
    modalContainer = createElement("div", "", "modal__container"),
    modalMessage = createElement("span", "", "modal__message"),
    modalBtn = createElement("button", "Сыграть ещё раз", "btn"),
    modalMessages = {
      win: "Победа!",
      lose: "Время вышло!",
    };

  modalBtn.addEventListener("click", () => {
    closeModal();
    changeClass(form, "form--show", "hide");
    changeClass(timer, "hide", "timer--show");
    changeClass(game, "hide", "game--show");
    formInput.value = 4;
  });

  renderElement(modalContainer, modalMessage);
  renderElement(modalContainer, modalBtn);
  renderElement(modal, modalContainer);
  renderElement(document.body, modal);

  function openModal(message) {
    modalMessage.textContent = message;
    changeClass(modal, "visible", "invisible");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    changeClass(modal, "invisible", "visible");
    document.body.style.overflow = "";
  }

  const timer = createElement("div", "", "timer", "hide"),
    timerMinutes = createElement("span", "", "timer__minutes"),
    timerSeparator = createElement("span", ":", "timer__separator"),
    timerSeconds = createElement("span", "", "timer__seconds");

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

  function wrongPair() {
    changeClass(storage.firstCard, "card--close", "card--open");
    changeClass(storage.secondCard, "card--close", "card--open");
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
    arr.forEach((numberOfCard) => {
      const card = createElement("li", numberOfCard, "card", "card--close");
      renderElement(parent, card);
      card.style.height = `${card.offsetWidth}px`;
    });
  }

  function startGame(cardInRow = 4, time = 60) {
    game.replaceChildren();
    game.style.gridTemplateColumns = `repeat(${cardInRow}, ${gameOptions[cardInRow].size}px)`;
    renderTime(gameOptions[cardInRow].time);
    changeClass(form, "hide", "form--show");
    changeClass(timer, "timer--show", "hide");
    changeClass(game, "game--show", "hide");
    const arrOfNumbers = createArrayOfNumbers(gameOptions[cardInRow].amount);
    shuffleArray(arrOfNumbers);
    createAndInsertCards(arrOfNumbers, game);

    function gameChecks(e) {
      const currenElement = e.target;
      if (!currenElement.classList.contains("card--close")) {
        return;
      }

      clearInterval(storage.closeCardsTime);

      if (!storage.startGame) {
        setTimer(gameOptions[cardInRow].time);
        storage.startGame = true;
      }

      if (
        storage.firstCard &&
        storage.secondCard &&
        storage.firstCard.textContent !== storage.secondCard.textContent
      ) {
        wrongPair(storage);
      }

      if (!storage.firstCard) {
        storage.firstCard = currenElement;
        changeClass(storage.firstCard, "card--open", "card--close");
      } else if (storage.firstCard.textContent !== currenElement.textContent) {
        storage.secondCard = currenElement;
        changeClass(storage.secondCard, "card--open", "card--close");
        storage.closeCardsTime = setInterval(wrongPair, 2000, storage);
      } else {
        changeClass(
          storage.firstCard,
          "card--success",
          "card--open",
          "card--close"
        );
        changeClass(
          currenElement,
          "card--success",
          "card--open",
          "card--close"
        );
        storage.firstCard = null;
        storage.openedCards += 2;

        if (storage.openedCards === gameOptions[cardInRow].amount) {
          endGame(modalMessages.win);
          game.removeEventListener("click", gameChecks);
        }
      }
    }

    game.addEventListener("click", gameChecks);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = formInput.value;
    if (inputValue % 2 === 0 && inputValue >= 2 && inputValue <= 10) {
      startGame(inputValue);
    } else {
      changeClass(formError, "visible", "invisible");
    }
  });

  formTop.addEventListener("click", (e) => {
    const currentNum = +formInput.value,
      plusBtn = e.target.classList.contains("form__plus-btn"),
      minusBtn = e.target.classList.contains("form__minus-btn");

    if (plusBtn && currentNum >= 2 && currentNum < 10) {
      formInput.value = currentNum + 2 - (currentNum % 2);
      changeClass(formError, "invisible", "visible");
    } else if (minusBtn && currentNum > 2 && currentNum <= 10) {
      formInput.value = currentNum - 2 + (currentNum % 2);
      changeClass(formError, "invisible", "visible");
    } else if (plusBtn && currentNum < 2) {
      formInput.value = 2;
    } else if (minusBtn && currentNum > 10) {
      formInput.value = 10;
    }
  });

  formInput.addEventListener("input", (e) => {
    changeClass(formError, "invisible", "visible");
    e.target.value = e.target.value.replace(/\D/g, "").substr(0, 2);
  });
});
