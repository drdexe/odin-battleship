import Gameboard from "../factories/gameboard.js";
import Ship from "../factories/ship.js";

let testBoard;

beforeEach(() => {
  testBoard = new Gameboard();
});

test("Places horizontal ship correctly", () => {
  const ship = new Ship(3);
  testBoard.placeShip(ship, [0, 0], false);
  expect(testBoard.board[0][0].ship).toBe(ship);
  expect(testBoard.board[0][1].ship).toBe(ship);
  expect(testBoard.board[0][2].ship).toBe(ship);
});

test("Places vertical ship correctly", () => {
  const ship = new Ship(3);
  testBoard.placeShip(ship, [7, 9], true);
  expect(testBoard.board[7][9].ship).toBe(ship);
  expect(testBoard.board[8][9].ship).toBe(ship);
  expect(testBoard.board[9][9].ship).toBe(ship);
});

test("Throws error on out of bounds ship placement", () => {
  expect(() => testBoard.placeShip(new Ship(5), [0, 7], false)).toThrow();
});

test("Throws error on colliding ship placement", () => {
  testBoard.placeShip(new Ship(5), [5, 0], false);
  expect(() => testBoard.placeShip(new Ship(5), [2, 2], true)).toThrow();
});

test("Registers attack and hits ship", () => {
  const ship = new Ship(2);
  testBoard.placeShip(ship, [0, 0], false);
  testBoard.receiveAttack([0, 0]);
  expect(ship.hits).toBe(1);
  expect(testBoard.board[0][0].hasAttack).toBe(true);
});

test("Sinks ship on final attack", () => {
  const ship = new Ship(2);
  testBoard.placeShip(ship, [0, 0], false);
  testBoard.receiveAttack([0, 0]);
  testBoard.receiveAttack([0, 1]);
  expect(ship.sunk).toBe(true);
});

test("Throws error on invalid attack", () => {
  testBoard.placeShip(new Ship(2), [0, 0], false);
  testBoard.receiveAttack([0, 0]);
  expect(() => testBoard.receiveAttack([0, 0])).toThrow();
});

test("Detects when all ships sunk", () => {
  testBoard.placeShip(new Ship(1), [0, 0], false);
  testBoard.placeShip(new Ship(1), [0, 1], false);
  testBoard.receiveAttack([0, 0]);
  expect(testBoard.allSunk()).toBe(false);
  testBoard.receiveAttack([0, 1]);
  expect(testBoard.allSunk()).toBe(true);
});
