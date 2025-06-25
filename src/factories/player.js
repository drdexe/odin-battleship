import Ship from "./ship.js";
import Gameboard from "./gameboard.js";

export default class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  placeShipsRandomly() {
    Ship.LENGTHS.forEach((length) => {
      let placed = false;
      while (!placed) {
        const ship = new Ship(length);
        const row = Math.floor(Math.random() * Gameboard.SIZE);
        const col = Math.floor(Math.random() * Gameboard.SIZE);
        const isVertical = Math.random() < 0.5;
        try {
          this.gameboard.placeShip(ship, [row, col], isVertical);
          placed = true;
        } catch {
          // Placement failed, try again
        }
      }
    });
  }

  getRandomAttackCoords() {
    const available = [];
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        if (!this.gameboard.board[i][j].hasAttack) {
          available.push([i, j]);
        }
      }
    }
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }
}
