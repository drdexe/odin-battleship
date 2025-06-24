export default class Ship {
  static LENGTHS = [5, 4, 3, 3, 2];
  
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.length === this.hits;
  }
}
