import Player from "../factories/player.js";
import Ship from "../factories/ship.js";
import Gameboard from "../factories/gameboard.js";

test("placeShipsRandomly places all ships without overlap and within bounds", () => {
  const player = new Player("computer");
  player.placeShipsRandomly();
  expect(player.gameboard.ships.length).toBe(Ship.LENGTHS.length);
  const occupied = new Set();
  player.gameboard.ships.forEach((ship) => {
    let found = false;
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        if (player.gameboard.board[i][j].ship === ship) {
          found = true;
          const key = `${i},${j}`;
          expect(occupied.has(key)).toBe(false);
          occupied.add(key);
        }
      }
    }
    expect(found).toBe(true);
  });
});

test("getRandomAttackCoords returns only un-attacked cells", () => {
  const player = new Player("human");
  for (let i = 0; i < Gameboard.SIZE; i++) {
    for (let j = 0; j < Gameboard.SIZE; j++) {
      player.gameboard.board[i][j].hasAttack = true;
    }
  }
  player.gameboard.board[5][5].hasAttack = false;
  const coords = player.getRandomAttackCoords();
  expect(coords).toEqual([5, 5]);
});

test("getRandomAttackCoords returns null if all cells attacked", () => {
  const player = new Player("human");
  for (let i = 0; i < Gameboard.SIZE; i++) {
    for (let j = 0; j < Gameboard.SIZE; j++) {
      player.gameboard.board[i][j].hasAttack = true;
    }
  }
  expect(player.getRandomAttackCoords()).toBeNull();
});
