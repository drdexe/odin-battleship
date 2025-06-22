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
    const [x, y] = coords;

    if (
      x < 0 ||
      y < 0 ||
      x >= Gameboard.SIZE ||
      y >= Gameboard.SIZE ||
      (!isVertical && x + ship.length > Gameboard.SIZE) ||
      (isVertical && y + ship.length > Gameboard.SIZE)
    ) {
      throw new Error("Invalid placement.");
    }

    for (let i = 0; i < ship.length; i++) {
      if (
        (!isVertical && this.board[x + i][y].ship !== null) ||
        (isVertical && this.board[x][y + i].ship !== null)
      ) {
        throw new Error("Invalid placement.");
      }
    }

    for (let i = 0; i < ship.length; i++) {
      if (!isVertical) {
        this.board[x + i][y].ship = ship;
      } else {
        this.board[x][y + i].ship = ship;
      }
    }

    this.ships.push(ship);
  }

  receiveAttack(coords) {
    const [x, y] = coords;

    if (
      x < 0 ||
      y < 0 ||
      x >= Gameboard.SIZE ||
      y >= Gameboard.SIZE ||
      this.board[x][y].hasAttack
    ) {
      throw new Error("Invalid attack.");
    }

    this.board[x][y].hasAttack = true;

    if (this.board[x][y].ship === null) return;

    this.board[x][y].ship.hit();
    if (this.board[x][y].ship.isSunk()) {
      this.board[x][y].ship.sunk = true;
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.sunk);
  }
}
