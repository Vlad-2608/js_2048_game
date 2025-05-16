// import * as GameModule from './modules/Game.class.js';
const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const gameField = document.querySelector('.game-field tbody');
  const scoreDisplay = document.querySelector('.game-score');
  const startButton = document.querySelector('.button.start');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  // const game = new GameModule.Game();

  function updateBoardUI() {
    gameField.innerHTML = '';

    const board = game.getState();

    board.forEach((row) => {
      const rowElement = document.createElement('tr');

      rowElement.classList.add('field-row');

      row.forEach((cellValue) => {
        const cell = document.createElement('td');

        cell.classList.add('field-cell');

        if (cellValue !== null) {
          cell.classList.add(`field-cell--${cellValue}`);
          cell.textContent = cellValue;
        }
        rowElement.appendChild(cell);
      });
      gameField.appendChild(rowElement);
    });
    scoreDisplay.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }

  function startGame() {
    game.start();
    updateBoardUI();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  function restartGame() {
    game.restart();
    updateBoardUI();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      startGame();
    } else {
      restartGame();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (game.getStatus() === 'playing') {
      let moved = false;

      switch (evt.key) {
        case 'ArrowLeft':
          game.moveLeft();
          moved = true;
          break;
        case 'ArrowRight':
          game.moveRight();
          moved = true;
          break;
        case 'ArrowUp':
          game.moveUp();
          moved = true;
          break;
        case 'ArrowDown':
          game.moveDown();
          moved = true;
          break;
      }

      if (moved) {
        updateBoardUI();
      }
    }
  });

  if (startButton.classList.contains('start')) {
  } else {
    startGame();
  }
});
