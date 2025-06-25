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
    initStartButton();
    initOpponentCells();
  }

  function createCells(boardDiv) {
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.col = j;
        cellButton.disabled = true;
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

      updatePlayerShips();
    } catch (err) {
      console.log(err);
    }
  }

  function updatePlayerShips() {
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        const cell = player.gameboard.board[i][j];
        const cellButton = document.querySelector(
          `.player.board > .cell[data-row="${i}"][data-col="${j}"]`,
        );
        if (cell.ship !== null) {
          cellButton.classList.add("ship");
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

  function initStartButton() {
    const startButton = document.querySelector(".start");
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      document.querySelectorAll(".board").forEach((board) => {
        board
          .querySelectorAll(".cell")
          .forEach((cell) => (cell.disabled = false));
      });
      opponent.placeShipsRandomly();
    });
  }

  function initOpponentCells() {
    const board = document.querySelector(".opponent.board");
    board.addEventListener("click", (e) => {
      const row = +e.target.dataset.row;
      const col = +e.target.dataset.col;

      try {
        opponent.gameboard.receiveAttack([row, col]);
        player.gameboard.receiveAttack(player.getRandomAttackCoords());
        updateBoards();
      } catch (err) {
        console.log(err);
      }
    });
  }

  function updateBoards() {
    for (let i = 0; i < Gameboard.SIZE; i++) {
      for (let j = 0; j < Gameboard.SIZE; j++) {
        const playerCell = player.gameboard.board[i][j];
        const opponentCell = opponent.gameboard.board[i][j];
        const playerCellButton = document.querySelector(
          `.player.board > .cell[data-row="${i}"][data-col="${j}"]`,
        );
        const opponentCellButton = document.querySelector(
          `.opponent.board > .cell[data-row="${i}"][data-col="${j}"]`,
        );
        if (playerCell.ship !== null && playerCell.hasAttack) {
          playerCellButton.classList.add("hit");
          playerCellButton.disabled = true;
        } else if (playerCell.hasAttack) {
          playerCellButton.classList.add("miss");
          playerCellButton.disabled = true;
        }
        if (opponentCell.ship !== null && opponentCell.hasAttack) {
          opponentCellButton.classList.add("hit");
          opponentCellButton.disabled = true;
        } else if (opponentCell.hasAttack) {
          opponentCellButton.classList.add("miss");
          opponentCellButton.disabled = true;
        }
      }
    }
  }

  return { init };
})();
