"use strict";

var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var chanceArray = require("./utils/chance-cards");
var MonopolyView = require("./view/monopoly");

var game = new MonopolyView(monopoly);
game.cellsEventListener(cellActionDispatcher);
game.startGameBtn.addEventListener(
  "click",
  function() {
    game.startGame(game);
  },
  false
);

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
  console.log("**********************");
  console.log("c'est au tour de ", player.name, " de jouer");
  console.log(player.name, "lance les dés et obtient ", resDice);

  updateDisplayWithMove(player);
}

function cellActionDispatcher(e) {
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  //on focus other cells without roll dice do nothing
  if (parseInt(e.target.id) !== currentPlayer.pawn.currentCellId) {
    return;
  }
  console.log("joueur courant =  ", currentPlayer.name);
  var pos = currentPlayer.pawn.currentCellId;
  var currentCell = boardArray[pos];
  var isFreeToBuy = currentCell.isSellable();
  var titleToBuy = game.bank.titleList.find(function(title) {
    return title.cellId === currentCell.cellId;
  });

  if (isFreeToBuy) {
    game
      .checkPlayerResponse(titleToBuy, currentPlayer)
      .then(function(responsePlayer) {
        if (responsePlayer) {
          doBuy(currentPlayer, currentCell, titleToBuy);
          game.updatePlayerBoard(currentPlayer, titleToBuy);
        }
      });
    updatePlayers(currentPlayer);
  } else {
    if (currentCell.playerOwner) {
      doPay(currentPlayer, currentCell, titleToBuy);
    } else if (currentCell.name === "chance") {
      var chanceCardsKeys = Object.keys(chanceArray);

      var randomChanceCard =
        chanceArray[Math.floor(Math.random() * chanceCardsKeys.length)];

      console.log("case chance ", randomChanceCard);

      game.displayChanceCard(randomChanceCard, currentPlayer);

      var actions = randomChanceCard.actions;
      if (actions.includes("RECEIVE")) {
        //TODO verif passage case depart
        game.bank.addMoney(currentPlayer, randomChanceCard.amount);
      } else if (actions.includes("PAY")) {
        game.bank.removeMoney(currentPlayer, randomChanceCard.amount);
      } else if (actions.includes("MOVE")) {
        debugger;
        currentPlayer.pawn.currentCellId = 0;
        move(currentPlayer, randomChanceCard.moveTo);
      }
    }
    updatePlayers(currentPlayer);
  }
}

function updateDisplayWithMove(player) {
  //wait before move pawn
  setTimeout(function() {
    game.movePawn(player.pawn);
  }, 2000);
}

function updatePlayers(player) {
  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      player.current = false;
      p = player;
    } else {
      p.current = true;
    }
    return p;
  });

  game.players = newPlayers;
}

function doBuy(currentPlayer, currentCell, titleToBuy) {
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

function doPay(currentPlayer, currentCell, titleToBuy) {
  //at home do nothing
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
  currentPlayer.payRent(playerToPay, titleToBuy.rent);
}

module.exports = monopoly;
