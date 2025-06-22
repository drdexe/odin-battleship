import Ship from "../factories/ship.js";

test("Ship is created with correct length", () => {
  const ship = new Ship(3);
  expect(ship.length).toBe(3);
  expect(ship.hits).toBe(0);
  expect(ship.isSunk()).toBe(false);
});

test("Ship registers hits correctly", () => {
  const ship = new Ship(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
