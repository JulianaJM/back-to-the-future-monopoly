"use strict";

var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");

function monopoly() {
  var resDice = rollDice(game.diceDisplay);
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  move(currentPlayer, resDice);
}

function move(player, resDice) {
  var nextPos = player.pawn.currentCellId + resDice;
  if (nextPos <= game.MAX_CELL - 1) {
    player.pawn.currentCellId = nextPos;
  } else {
    player.pawn.currentCellId = nextPos - game.MAX_CELL;
  }
  //wait before move pawn
  setTimeout(function() {
    game.movePawn(player.pawn);
    updatePlayers(player);
  }, 2000);
  console.log("c'est au tour de ", player.name, " de jouer");
  console.log(player.name, "lance les dés et obtient ", resDice);
}

function updatePlayers(player) {
  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      p = player;
    } else {
      p.current = true;
    }
    return p;
  });

  game.players = newPlayers;
}

function cellActionDispatcher(e) {
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  var pos = currentPlayer.pawn.currentCellId;
  var currentCell = boardArray[pos];
  var isFreeToBuy = currentCell.isSellable();
  var titleToBuy = game.bank.titleList.find(function(title) {
    return title.cellId === currentCell.cellId;
  });

  if (isFreeToBuy) {
    game.checkPlayerResponse(titleToBuy).then(function(responsePlayer) {
      if (responsePlayer) {
        currentPlayer = game.bank.sellTitle(currentPlayer, titleToBuy);
        if (
          currentPlayer.titleList.find(function(title) {
            title.id === titleToBuy.id;
          }) !== null
        ) {
          currentCell.setPlayerOwner(currentPlayer);
          console.log(currentPlayer.name, "achete ", titleToBuy.name);
        } else {
          console.log(
            currentPlayer.name,
            " n'a pas assez de capital pour ",
            currentCell.name
          );
        }
      }
    });
  } else {
    if (currentCell.playerOwner) {
      if (currentCell.playerOwner.id === currentPlayer.id) {
        console.log(currentPlayer.name, " est chez lui");
        return;
      }
      var playerToPay = game.players.find(function(player) {
        return player.current === false;
      });
      console.log(
        currentPlayer.name,
        "paye ",
        titleToBuy.rent,
        " à ",
        playerToPay.name
      );

      updatePlayers(currentPlayer.payRent(playerToPay, titleToBuy.rent));
    }
  }
  currentPlayer.current = false;

  updatePlayers(currentPlayer);
}

var game = new MonopolyView(monopoly);
game.cellsEventListener(cellActionDispatcher);
var start = function() {
  game.startGame(game);
};
game.startGameBtn.addEventListener("click", start, false);
module.exports = monopoly;
