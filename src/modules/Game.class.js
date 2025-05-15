'use strict';

class Game {
  constructor(initialState) {
    this.boardSize = 4;

    this.board =
      initialState ||
      Array(this.boardSize)
        .fill(null)
        .map(() => Array(this.boardSize).fill(null));
    this.score = 0;
    this.status = this.isBoardEmpty(this.board) ? 'idle' : 'playing';
    this.hasMoved = false;

    this.hasMerged = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(false));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === null) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    } else if (this.status === 'playing' && !this.canMove()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    this.hasMoved = false;
    this.resetMergeFlags();

    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = this.slideAndMerge(this.board[i]);
    }
    this.afterMove();
  }

  moveRight() {
    this.hasMoved = false;
    this.resetMergeFlags();

    for (let i = 0; i < this.boardSize; i++) {
      const reversedRow = [...this.board[i]].reverse();
      const movedRow = this.slideAndMerge(reversedRow).reverse();

      this.board[i] = movedRow;
    }
    this.afterMove();
  }

  moveUp() {
    this.hasMoved = false;
    this.resetMergeFlags();

    for (let j = 0; j < this.boardSize; j++) {
      const column = this.board.map((row) => row[j]);
      const movedColumn = this.slideAndMerge(column);

      for (let i = 0; i < this.boardSize; i++) {
        this.board[i][j] = movedColumn[i];
      }
    }
    this.afterMove();
  }

  moveDown() {
    this.hasMoved = false;
    this.resetMergeFlags();

    for (let j = 0; j < this.boardSize; j++) {
      const column = this.board.map((row) => row[j]).reverse();
      const movedColumn = this.slideAndMerge(column).reverse();

      for (let i = 0; i < this.boardSize; i++) {
        this.board[i][j] = movedColumn[i];
      }
    }
    this.afterMove();
  }

  slideAndMerge(row) {
    const nonNull = row.filter((val) => val !== null);
    const merged = [];
    const rowMergeFlags = Array(this.boardSize).fill(false);

    for (let i = 0; i < nonNull.length; i++) {
      if (
        i + 1 < nonNull.length &&
        nonNull[i] === nonNull[i + 1] &&
        !rowMergeFlags[merged.length]
      ) {
        const mergedValue = nonNull[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        this.hasMoved = true;
        rowMergeFlags[merged.length - 1] = true;
        i++;

        if (mergedValue === 2048 && this.status === 'playing') {
          this.status = 'win';
        }
      } else {
        merged.push(nonNull[i]);
      }
    }

    while (merged.length < this.boardSize) {
      merged.push(null);
    }

    return merged;
  }

  resetMergeFlags() {
    this.hasMerged = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(false));
  }

  afterMove() {
    if (this.hasMoved) {
      this.addRandomTile();
    }

    if (this.status === 'playing' && !this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === null) {
          return true;
        }

        if (
          i + 1 < this.boardSize &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }

        if (
          j + 1 < this.boardSize &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardEmpty(board) {
    return board.every((row) => row.every((cell) => cell === null));
  }
}

module.exports = Game;
