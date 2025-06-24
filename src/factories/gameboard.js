export default class Gameboard {
  static SIZE = 10;

  constructor() {
    this.board = [];
    for (let i = 0; i < Gameboard.SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < Gameboard.SIZE; j++) {
        this.board[i][j] = { ship: null, hasAttack: false };
      }
    }
    this.ships = [];
  }

  placeShip(ship, coords, isVertical) {
    const [row, col] = coords;

    if (
      row < 0 ||
      col < 0 ||
      row >= Gameboard.SIZE ||
      col >= Gameboard.SIZE ||
      (isVertical && row + ship.length > Gameboard.SIZE) ||
      (!isVertical && col + ship.length > Gameboard.SIZE)
    ) {
      throw new Error("Invalid placement.");
    }

    for (let i = 0; i < ship.length; i++) {
      if (
        (isVertical && this.board[row + i][col].ship !== null) ||
        (!isVertical && this.board[row][col + i].ship !== null)
      ) {
        throw new Error("Invalid placement.");
      }
    }

    for (let i = 0; i < ship.length; i++) {
      if (isVertical) {
        this.board[row + i][col].ship = ship;
      } else {
        this.board[row][col + i].ship = ship;
      }
    }

    this.ships.push(ship);
  }

  receiveAttack(coords) {
    const [row, col] = coords;

    if (
      row < 0 ||
      col < 0 ||
      row >= Gameboard.SIZE ||
      col >= Gameboard.SIZE ||
      this.board[row][col].hasAttack
    ) {
      throw new Error("Invalid attack.");
    }

    this.board[row][col].hasAttack = true;

    if (this.board[row][col].ship === null) return;

    this.board[row][col].ship.hit();
    if (this.board[row][col].ship.isSunk()) {
      this.board[row][col].ship.sunk = true;
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.sunk);
  }
}
