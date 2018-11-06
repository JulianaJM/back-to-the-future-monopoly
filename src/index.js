"use strict";

var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var chanceArray = require("./utils/chance-cards");
var caisseCommunauteArray = require("./utils/cdc-cards");
var MonopolyView = require("./view/monopoly");
var colors = require("./utils/color-group");

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
  game.disableDice(true);
  var resDice = rollDice(game.diceDisplay);
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  //uncomment for debug mode
  // resDice = prompt("Please enter your case:", "7");
  // move(currentPlayer, parseInt(resDice));
  move(currentPlayer, resDice);
}

function move(player, resDice) {
  var nextPos = player.pawn.currentCellId + resDice;
  player.pawn.resDice = resDice; //handle cies publiques
  var isDepartPassed = false;
  if (nextPos <= game.MAX_CELL - 1) {
    player.pawn.currentCellId = nextPos;
  } else {
    player.pawn.currentCellId = nextPos - game.MAX_CELL;

    //case départ toucher 20000
    console.log(player.name, " passage par la case départ recevez 20000");
    game.bank.addMoney(player, 20000);
    isDepartPassed = true;
    game.updatePlayerBoard(player);
  }
  console.log("**********************");
  console.log("c'est au tour de ", player.name, " de jouer");
  console.log(player.name, "lance les dés et obtient ", resDice);

  updateDisplayWithMove(player, isDepartPassed);
}

function cellActionDispatcher(e) {
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  //on focus other cells, without roll dice do nothing
  if (parseInt(e.target.id) !== currentPlayer.pawn.currentCellId) {
    return;
  }
  console.log(
    "joueur courant =  ",
    currentPlayer.name,
    " capital restant = ",
    currentPlayer.capital
  );
  var pos = currentPlayer.pawn.currentCellId;
  var currentCell = boardArray[pos];
  var isFreeToBuy = currentCell.isSellable();
  var titleToBuy = game.bank.titleList.find(function(title) {
    return title.cellId === currentCell.cellId;
  });

  if (isFreeToBuy) {
    game
      .checkPlayerResponse(titleToBuy, currentPlayer, currentCell)
      .then(function(responsePlayer) {
        if (responsePlayer) {
          /* handle buy title */
          var isBuy = canBuy(currentPlayer, currentCell, titleToBuy);
          if (isBuy) {
            game.updatePlayerBoard(currentPlayer, titleToBuy);
          }
        }
        updatePlayers(currentPlayer);
      });
  } else {
    /* handle rent title */
    if (currentCell.playerOwner) {
      var amountToPay = getRentAmount(currentCell, titleToBuy);
      var playerToPay = doPay(currentPlayer, currentCell, amountToPay);

      if (currentPlayer.capital < 0) {
        game.gameOver(currentPlayer, playerToPay);
      } else {
        updatePlayers(currentPlayer);
        if (playerToPay) {
          // update board adversaire
          game.updatePlayerBoard(playerToPay);
          setTimeout(function() {
            //wait move pawn before alert
            game.alertPayement(currentPlayer, playerToPay, amountToPay);
          }, 2000);
        }
        //update board current
        game.updatePlayerBoard(currentPlayer);
      }

      /* handle chance */
    } else if (currentCell.name === "chance") {
      var chanceCardsKeys = Object.keys(chanceArray);
      var randomChanceCard =
        chanceArray[Math.floor(Math.random() * chanceCardsKeys.length)];
      console.log("case chance ", randomChanceCard);

      handleSpecialCard(currentPlayer, randomChanceCard, "chance");
    } else if (currentCell.name === "caisse de communauté") {
      var cdcCardsKeys = Object.keys(caisseCommunauteArray);
      var randomCdcCard =
        caisseCommunauteArray[Math.floor(Math.random() * cdcCardsKeys.length)];
      console.log("case caisse de communauté ", randomCdcCard);

      handleSpecialCard(currentPlayer, randomCdcCard, "cdc");

      //cells impots taxes
    } else if (currentCell.rent) {
      handleTaxCells(currentPlayer, currentCell);

      //aller en retenue
    } else if (currentCell.cellId === 30) {
      setTimeout(function() {
        currentPlayer.pawn.currentCellId = 10;
        game.movePawn(currentPlayer.pawn);
        // game.alertPrison(currentPlayer.name);
      }, 2000);
    } else {
      //TODO other cells
      updatePlayers(currentPlayer);
    }
  }
}

function handleTaxCells(currentPlayer, currentCell) {
  game.bank.removeMoney(currentPlayer, currentCell.rent);
  console.log(
    currentPlayer.name +
      "vous êtes sur la case " +
      currentCell.name +
      " vous payez à la banque " +
      currentCell.rent
  );
  setTimeout(function() {
    game.alertTaxCell(
      currentPlayer.name,
      currentCell.cellId,
      currentCell.name,
      currentCell.rent
    );
    // update player board
    game.updatePlayerBoard(currentPlayer);
    updatePlayers(currentPlayer);
  }, 2000);
}

function handleSpecialCard(currentPlayer, randomCard, type) {
  game.displaySpecialCard(randomCard, currentPlayer, type).then(function() {
    var actions = randomCard.actions;
    var isMoveAction = false;
    if (actions.includes("RECEIVE")) {
      //TODO verif passage case depart
      game.bank.addMoney(currentPlayer, randomCard.amount);
      console.log(
        currentPlayer.name,
        " reçoit la somme de ",
        randomCard.amount,
        "$"
      );
    }
    if (actions.includes("PAY")) {
      game.bank.removeMoney(currentPlayer, randomCard.amount);
      console.log(
        currentPlayer.name,
        " paye a la banque ",
        randomCard.amount,
        "$"
      );
      console.log("capital restant est maintenant de ", currentPlayer.capital);
    }
    if (actions.includes("MOVE")) {
      console.log(
        currentPlayer.name,
        " se déplace vers case numéro ",
        randomCard.moveTo
      );
      isMoveAction = true;
      if (randomCard.moveTo >= 0) {
        currentPlayer.pawn.currentCellId = 0;
      }
      move(currentPlayer, randomCard.moveTo);
    }
    // update player board
    game.updatePlayerBoard(currentPlayer);
    if (!isMoveAction) {
      //don't update wait for focus on cell handle this
      updatePlayers(currentPlayer);
    }
  });
}

function getRentAmount(currentCell, currentTitle) {
  var amountToPay = currentTitle.rent;

  /* check fusion indus ou plutonium indus */
  if (currentCell.cellId === 13 || currentCell.cellId === 28) {
    amountToPay = currentTitle.rent * currentPlayer.pawn.resDice;
    console.log(
      "vous payer ",
      currentPlayer.pawn.resDice,
      " x 400 soit : ",
      amountToPay
    );

    /* check loyer compte double */
  } else {
    var filteredTitleByColors = currentCell.playerOwner.titleList.filter(
      function(title) {
        return title.color === currentTitle.color;
      }
    );

    if (filteredTitleByColors.length === colors[currentTitle.color]) {
      console.log(
        currentCell.playerOwner.name,
        " vous êtes payer le double du loyer car vous posseder toutes les proprétés du groupe"
      );
      amountToPay = currentTitle.rent * 2;
    }
  }

  return amountToPay;
}

function updateDisplayWithMove(player, isDepartPassed) {
  game.disableSwitch(player);
  //wait before move pawn
  setTimeout(function() {
    game.movePawn(player.pawn, player.name, isDepartPassed);
  }, 2000);
}

function updatePlayers(player) {
  game.disableDice(false);

  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      player.current = false;
      p = player;
    } else {
      p.current = true;
      game.displayPlayerTurn(p);
    }
    return p;
  });

  game.players = newPlayers;
}

function canBuy(currentPlayer, currentCell, titleToBuy) {
  currentPlayer = game.bank.sellTitle(
    currentPlayer,
    titleToBuy,
    currentCell.price
  );
  var titleFound = currentPlayer.titleList.find(function(title) {
    return title.cellId === titleToBuy.cellId;
  });
  if (titleFound) {
    currentCell.setPlayerOwner(currentPlayer);
    console.log(
      currentPlayer.name,
      "achete ",
      titleToBuy.name,
      " pour ",
      currentCell.price
    );
    console.log("capital restant est maintenant de ", currentPlayer.capital);
    return true;
  } else {
    console.log(
      currentPlayer.name,
      " n'a pas assez de capital pour ",
      currentCell.name
    );

    return false;
  }
}

function doPay(currentPlayer, currentCell, amount) {
  //at home do nothing
  if (currentCell.playerOwner.id === currentPlayer.id) {
    console.log(currentPlayer.name, " est chez lui");
    return null;
  }

  var playerToPay = game.players.find(function(player) {
    return player.current === false;
  });
  console.log(currentPlayer.name, "paye ", amount, " à ", playerToPay.name);
  currentPlayer.payRent(playerToPay, amount);

  return playerToPay;
}

module.exports = monopoly;
