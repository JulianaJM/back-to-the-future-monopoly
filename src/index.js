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

  if (game.isDebug && game.isDebugPrompt) {
    resDice = prompt("Please enter your case:", "7");
    move(currentPlayer, parseInt(resDice));
  } else {
    move(currentPlayer, resDice);
  }
}

function move(player, resDice, specialCardDepart) {
  var nextPos = player.pawn.currentCellId + resDice;
  player.pawn.resDice = resDice; //handle cies publiques
  var isDepartPassed = false;
  if (nextPos <= game.MAX_CELL - 1) {
    player.pawn.currentCellId = nextPos;
  } else {
    player.pawn.currentCellId = nextPos - game.MAX_CELL;

    isDepartPassed = true;
    game.updatePlayerBoard(player);
  }
  console.log("**********************");
  console.log(player.name, "lance les dés et obtient ", resDice);
  if (specialCardDepart) {
    isDepartPassed = true;
  }
  updateDisplayWithMove(player, isDepartPassed);
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

  if (isFreeToBuy) {
    game
      .displayTitleBuy(titleToBuy, currentPlayer, currentCell)
      .then(function(responsePlayer) {
        if (responsePlayer) {
          /* handle buy title */
          var isBuy = canBuy(currentPlayer, currentCell, titleToBuy);
          if (isBuy) {
            game.updatePlayerBoard(currentPlayer, titleToBuy);
          }
        }
        updatePlayers(currentPlayer, checkGameOver);
      });
  } else {
    /* handle rent title */
    if (currentCell.playerOwner && !titleToBuy.ishypotheced) {
      var amountToPay = getRentAmount(
        currentCell,
        titleToBuy,
        currentPlayer.pawn.resDice
      );
      var playerToPay = doPay(currentPlayer, currentCell, amountToPay);

      if (checkGameOver(currentPlayer)) {
        game.gameOver(currentPlayer, playerToPay);
      } else {
        if (playerToPay) {
          setTimeout(function() {
            game.alertPayement(currentPlayer, playerToPay, amountToPay);
            updatePlayers(currentPlayer, checkGameOver);
            // update board adversaire
            game.updatePlayerBoard(playerToPay);
          }, 2000);
        } else {
          //le joueur se trouve sur une de ses propriétés
          updatePlayers(currentPlayer, checkGameOver);
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

      handleSpecialCard(
        currentPlayer,
        randomChanceCard,
        "chance",
        currentCell.cellId
      );
    } else if (currentCell.name === "caisse de communauté") {
      var cdcCardsKeys = Object.keys(caisseCommunauteArray);
      var randomCdcCard =
        caisseCommunauteArray[Math.floor(Math.random() * cdcCardsKeys.length)];
      console.log("case caisse de communauté ", randomCdcCard);

      handleSpecialCard(
        currentPlayer,
        randomCdcCard,
        "cdc",
        currentCell.cellId
      );

      //cells impots taxes
    } else if (currentCell.rent) {
      handleTaxCells(currentPlayer, currentCell);

      //aller en retenue
    } else if (currentCell.cellId === 30) {
      setTimeout(function() {
        currentPlayer.pawn.currentCellId = 10;
        game.movePawn(currentPlayer.pawn);
      }, 2000);

      setTimeout(function() {
        game.bank.removeMoney(currentPlayer, 500);
        game.alertPrison(currentPlayer.name);
        game.updatePlayerBoard(currentPlayer);
      }, 2100);
    } else {
      //other cells
      updatePlayers(currentPlayer, checkGameOver);
    }
  }
}

function checkGameOver(currentPlayer) {
  if (currentPlayer.capital < 0) {
    return true;
  }
  return false;
}

function handleTaxCells(currentPlayer, currentCell) {
  currentPlayer = hasEnoughtMoney(currentPlayer, currentCell.rent);
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
    updatePlayers(currentPlayer, checkGameOver);
  }, 2000);
}

function handleSpecialCard(currentPlayer, randomCard, type, cellId) {
  game.displaySpecialCard(randomCard, currentPlayer, type).then(function() {
    var actions = randomCard.actions;
    var isMoveAction = false;
    if (actions.includes("RECEIVE")) {
      game.bank.addMoney(currentPlayer, randomCard.amount);
      console.log(
        currentPlayer.name,
        " reçoit la somme de ",
        randomCard.amount,
        "$"
      );
    }
    if (actions.includes("PAY")) {
      currentPlayer = hasEnoughtMoney(currentPlayer, randomCard.amount);
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
      //si on ne recule pas de case on réinit le currentcell à 0
      if (randomCard.moveTo >= 0) {
        var nextPos =
          currentPlayer.pawn.currentCellId + currentPlayer.pawn.resDice;
        var isDepartPassed = false;
        if (
          randomCard.moveTo !== 10 &&
          nextPos > game.MAX_CELL - 1 &&
          randomCard.moveTo > game.MAX_CELL
        ) {
          //passage case départ
          isDepartPassed = true;
        }
        currentPlayer.pawn.currentCellId = 0;
      }
      move(currentPlayer, randomCard.moveTo, isDepartPassed);
    }
    // update player board
    game.updatePlayerBoard(currentPlayer);
    if (!isMoveAction) {
      //don't update wait for focus on cell handle this
      updatePlayers(currentPlayer, checkGameOver);
    }
  });
}

function getRentAmount(currentCell, currentTitle, resDice) {
  var amountToPay = currentTitle.rent;
  var filteredTitleByColors = currentCell.playerOwner.titleList.filter(function(
    title
  ) {
    return title.color === currentTitle.color;
  });

  /* check fusion indus ou plutonium indus */
  if (filteredTitleByColors.length === colors[currentTitle.color]) {
    if (currentCell.cellId === 13 || currentCell.cellId === 28) {
      amountToPay = currentTitle.rent * resDice;
      console.log("vous payez ", resDice, " x 400 soit : ", amountToPay);
    } else {
      /* check loyer compte double */
      console.log(
        currentCell.playerOwner.name,
        " vous êtes payé le double du loyer car vous posseder toutes les proprétés du groupe"
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
    game.movePawn(player.pawn);
  }, 2000);

  if (isDepartPassed) {
    // setTimeout(function() {
    //case départ toucher 20000
    console.log(player.name, " passage par la case départ recevez 20000");
    game.bank.addMoney(player, 20000);
    game.updatePlayerBoard(player, null, false, true);
    // game.alertCaseDepart(player.name);
    // }, 2100);
  }
}

function updatePlayers(player, checkGameOver) {
  if (checkGameOver(player)) {
    var winner = game.players.find(function(p) {
      return p.id !== player.id;
    });
    game.gameOver(player, winner);
    return;
  }
  game.disableDice(false);

  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      player.current = false;
      p = player;
    } else {
      p.current = true;
      console.log("**********************");
      console.log("c'est au tour de ", p.name, " de jouer");
      game.displayPlayerTurn(p);
    }
    return p;
  });

  game.players = newPlayers;
  console.log("players => ", game.players);
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

  currentPlayer = hasEnoughtMoney(currentPlayer, amount);
  currentPlayer.payRent(playerToPay, amount);

  console.log(currentPlayer.name, "paye ", amount, " à ", playerToPay.name);

  return playerToPay;
}

function hasEnoughtMoney(currentPlayer, amount) {
  if (currentPlayer.capital < amount) {
    var amountHypotec = 0;
    var isHypothec = false;
    currentPlayer.titleList.forEach(title => {
      if (!isHypothec && !title.ishypotheced) {
        amountHypotec += title.hypothecValue;
        title.ishypotheced = true;
        if (currentPlayer.capital + amountHypotec >= amount) {
          isHypothec = true;
          console.log(
            title.name,
            " a été hypothéqué montant = ",
            title.hypothecValue
          );
          currentPlayer.capital += amountHypotec;
        }
      }
    });
  }
  game.updatePlayerBoard(currentPlayer, null, isHypothec);

  return currentPlayer;
}

module.exports = monopoly;
