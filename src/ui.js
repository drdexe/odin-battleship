import Ship from "./factories/ship.js";
import Gameboard from "./factories/gameboard.js";
import Player from "./factories/player.js";

export default (function ui() {
  const player = new Player("human");
  const opponent = new Player("computer");

  function init() {
    createCells(document.querySelector(".opponent.board"));
    createCells(document.querySelector(".player.board"));
    createShipyard();
    initDragEvents();
    initRotateButton();
  }

  function createCells(boardDiv) {
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.col = j;
        boardDiv.appendChild(cellButton);
      }
    }
  }

  function createShipyard() {
    const shipyard = document.querySelector(".shipyard");
    Ship.LENGTHS.forEach((length) => {
      const shipDiv = document.createElement("div");
      shipDiv.classList.add("shipyard-ship");
      shipDiv.setAttribute("draggable", "true");
      shipDiv.dataset.length = length;

      for (let i = 0; i < length; i++) {
        shipDiv.appendChild(document.createElement("div"));
      }

      shipDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.dataset.length);
        e.dataTransfer.setDragImage(shipDiv, 25, 25);
      });

      shipyard.appendChild(shipDiv);
    });
  }

  function initDragEvents() {
    const playerCells = document.querySelectorAll(".player.board > .cell");
    playerCells.forEach((cellButton) => {
      cellButton.addEventListener("dragover", (e) => e.preventDefault());
      cellButton.addEventListener("drop", handleDropShip);
    });
  }

  function handleDropShip(e) {
    e.preventDefault();
    const length = +e.dataTransfer.getData("text/plain");
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.col;

    try {
      const ship = new Ship(length);
      const isVertical = document
        .querySelector(".shipyard-ship")
        .classList.contains("vertical");
      player.gameboard.placeShip(ship, [row, col], isVertical);

      const shipyard = document.querySelector(".shipyard");
      const shipDiv = Array.from(shipyard.children).find(
        (div) => +div.dataset.length === length,
      );
      if (shipDiv) shipDiv.remove();

      if (shipyard.children.length === 0) {
        shipyard.style.display = "none";
        document.querySelector(".rotate").style.display = "none";
        document.querySelector(".start").style.display = "block";
      }
    } catch (err) {
      console.log(err);
    }

    updatePlayerBoard();
  }

  function updatePlayerBoard() {
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        if (player.gameboard.board[i][j].ship !== null) {
          document
            .querySelector(
              `.player.board > .cell[data-row="${i}"][data-col="${j}"]`,
            )
            .classList.add("ship");
        }
      }
    }
  }

  function initRotateButton() {
    const rotateButton = document.querySelector(".rotate");
    const shipDivs = document.querySelectorAll(".shipyard-ship");
    rotateButton.addEventListener("click", () => {
      shipDivs.forEach((shipDiv) => {
        shipDiv.classList.toggle("vertical");
      });
    });
  }

  return { init };
})();
