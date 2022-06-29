"use strict";

const boardArray = require("./utils/board-game");
const MonopolyView = require("./view/monopoly");
const gameController = require("./monopolyController");

// init game
const game = new MonopolyView(monopoly);

game.isDebug = true;
game.isDebugPrompt = true;
function monopoly() {
  gameController.disableDice(game);

  // roll dice
  let resDice = gameController.rollTheDice(game);

  let currentPlayer = game.players.find(function (player) {
    return player.current;
  });

  if (game.isDebug && game.isDebugPrompt) {
    resDice = prompt("Please enter your case:", "7");
    gameController.move(game, currentPlayer, parseInt(resDice));
  } else {
    // calculate next move
    gameController.move(game, currentPlayer, resDice);
  }
}

const cellActionDispatcher = function (e) {
  const currentPlayer = game.players.find(function (player) {
    return player.current;
  });

  const pos = currentPlayer.pawn.currentCellId;
  const currentCell = boardArray[pos];

  console.log(
    "focus joueur =  ",
    currentPlayer.name,
    " capital restant = ",
    currentPlayer.capital,
    "cell name => ",
    currentCell.name,
    "cell owner",
    currentCell.playerOwner ? currentCell.playerOwner.name : "libre"
  );

  const isFreeToBuy = currentCell.isSellable();
  const titleToBuy = game.bank.titleList.find(function (title) {
    return title.cellId === currentCell.cellId;
  });

  if (isFreeToBuy) {
    gameController.buyTitle(game, titleToBuy, currentPlayer, currentCell);
  } else {
    gameController.handleUnAvailableCells(
      game,
      currentPlayer,
      currentCell,
      titleToBuy
    );
  }
  game.displayBankCapital(game.bank);
};

// listen cells
game.cellsEventListener(cellActionDispatcher);
// start game button listener
game.startGameBtn.addEventListener(
  "click",
  function () {
    game.start(game);
  },
  false
);
