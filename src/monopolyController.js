const rollDice = require("./utils/roll-a-die");
const chanceArray = require("./utils/chance-cards");
const caisseCommunauteArray = require("./utils/cdc-cards");
const colors = require("./utils/color-group");
const bankService = require("./services/bankService");
const playerService = require("./services/playerService");

const updateDisplayWithMove = function (gameConfig, player, isDepartPassed) {
  gameConfig.disableSwitch(player);

  //wait before move pawn
  setTimeout(function () {
    gameConfig.movePawn(player.pawn);
  }, 2000);

  if (isDepartPassed) {
    //case départ toucher 20000
    console.log(player.name, " passage par la case départ recevez 20000");
    const amount = 20000;
    gameConfig.bank = bankService.withdrawMoney(gameConfig.bank, amount);
    player = playerService.receiveMoney(player, amount);

    gameConfig.updatePlayerBoard(player, null, false, true);
  }
};

export const move = function (gameConfig, player, resDice, specialCardDepart) {
  console.log("**********************");
  console.log(player.name, "lance les dés et obtient ", resDice);

  var nextPos = player.pawn.currentCellId + resDice;
  player.pawn.resDice = resDice;
  var isDepartPassed = false;

  if (nextPos <= gameConfig.MAX_CELL - 1) {
    player.pawn.currentCellId = nextPos;
  } else {
    // a round has been complete
    player.pawn.currentCellId = nextPos - gameConfig.MAX_CELL;
    isDepartPassed = true;
    gameConfig.updatePlayerBoard(player);
  }

  if (specialCardDepart) {
    isDepartPassed = true;
  }
  updateDisplayWithMove(gameConfig, player, isDepartPassed);
};

const checkGameOver = function (currentPlayer) {
  if (currentPlayer.capital < 0) {
    return true;
  }
  return false;
};

const handleTaxCells = function (gameConfig, currentPlayer, currentCell) {
  currentPlayer = hasEnoughtMoney(gameConfig, currentPlayer, currentCell.rent);
  gameConfig.bank = bankService.receiveMoney(gameConfig.bank, currentCell.rent);
  currentPlayer = playerService.withdrawMoney(currentPlayer, currentCell.rent);
  console.log(
    currentPlayer.name +
      "vous êtes sur la case " +
      currentCell.name +
      " vous payez à la banque " +
      currentCell.rent
  );
  setTimeout(function () {
    gameConfig.alertTaxCell(
      currentPlayer.name,
      currentCell.cellId,
      currentCell.name,
      currentCell.rent
    );
    // update player board
    gameConfig.updatePlayerBoard(currentPlayer);
    updatePlayers(gameConfig, currentPlayer);
  }, 2000);
};

const handleRent = function (gameConfig, currentPlayer, currentCell, title) {
  const amountToPay = getRentAmount(
    currentCell,
    title,
    currentPlayer.pawn.resDice
  );
  const playerToPay = payRentToPlayer(
    gameConfig,
    currentPlayer,
    currentCell,
    amountToPay
  );

  if (checkGameOver(currentPlayer)) {
    gameConfig.gameOver(currentPlayer, playerToPay);
  } else {
    if (playerToPay) {
      setTimeout(function () {
        gameConfig.alertPayment(currentPlayer, playerToPay, amountToPay);
        updatePlayers(gameConfig, currentPlayer);
        // update board adversaire
        gameConfig.updatePlayerBoard(playerToPay);
      }, 2000);
    } else {
      //le joueur se trouve sur une de ses propriétés
      updatePlayers(gameConfig, currentPlayer);
    }
    //update board current
    gameConfig.updatePlayerBoard(currentPlayer);
  }
};

const getRentAmount = function (currentCell, currentTitle, resDice) {
  var amountToPay = currentTitle.rent;
  var filteredTitleByColors = currentCell.playerOwner.titleList.filter(
    function (title) {
      return title.color === currentTitle.color;
    }
  );

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
};

const updatePlayers = function (gameConfig, player) {
  if (checkGameOver(player)) {
    var winner = gameConfig.players.find(function (p) {
      return p.id !== player.id;
    });
    gameConfig.gameOver(player, winner);
    return;
  }
  gameConfig.disableDice(false);

  var newPlayers = gameConfig.players.map(function (p) {
    if (p.id === player.id) {
      player.current = false;
      p = player;
    } else {
      p.current = true;
      console.log("**********************");
      console.log("c'est au tour de ", p.name, " de jouer");
      gameConfig.displayPlayerTurn(p);
    }
    return p;
  });

  gameConfig.players = newPlayers;
  console.log("players => ", gameConfig.players);
};

const canBuy = function (gameConfig, currentPlayer, currentCell, titleToBuy) {
  currentPlayer = playerService.buyTitle(
    currentPlayer,
    titleToBuy,
    currentCell.price
  );
  gameConfig.bank = bankService.receiveMoney(
    gameConfig.bank,
    currentCell.price
  );

  var titleFound = currentPlayer.titleList.find(function (title) {
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
};

const payRentToPlayer = function (
  gameConfig,
  currentPlayer,
  currentCell,
  amount
) {
  //at home do nothing
  if (currentCell.playerOwner.id === currentPlayer.id) {
    console.log(currentPlayer.name, " est chez lui");
    return null;
  }

  var playerToPay = gameConfig.players.find(function (player) {
    return player.current === false;
  });

  currentPlayer = hasEnoughtMoney(gameConfig, currentPlayer, amount);
  currentPlayer.payRent(playerToPay, amount);

  console.log(currentPlayer.name, "paye ", amount, " à ", playerToPay.name);

  return playerToPay;
};

const hasEnoughtMoney = function (gameConfig, currentPlayer, amount) {
  if (currentPlayer.capital < amount) {
    var amountHypotec = 0;
    var isHypothec = false;
    currentPlayer.titleList.forEach((title) => {
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
  gameConfig.updatePlayerBoard(
    currentPlayer,
    null,
    isHypothec,
    false,
    gameConfig.bank
  );

  return currentPlayer;
};

export const buyTitle = function (
  gameConfig,
  titleToBuy,
  currentPlayer,
  currentCell
) {
  gameConfig
    .buyTitle(titleToBuy, currentPlayer, currentCell)
    .then(function (responsePlayer) {
      if (responsePlayer) {
        /* handle buy title */
        const isBuy = canBuy(
          gameConfig,
          currentPlayer,
          currentCell,
          titleToBuy
        );
        if (isBuy) {
          gameConfig.updatePlayerBoard(currentPlayer, titleToBuy);
        }
      }
      updatePlayers(gameConfig, currentPlayer);
    });
};

const handleSpecialCard = function (
  gameConfig,
  currentPlayer,
  randomCard,
  type
) {
  gameConfig
    .displaySpecialCard(randomCard, currentPlayer, type)
    .then(function () {
      var actions = randomCard.actions;
      var isMoveAction = false;
      if (actions.includes("RECEIVE")) {
        const amount = randomCard.amount;
        gameConfig.bank = bankService.withdrawMoney(gameConfig.bank, amount);
        currentPlayer = playerService.receiveMoney(currentPlayer, amount);
        console.log(
          `La banque cède ${amount}, ${currentPlayer.name} reçoit la somme de ${randomCard.amount}$`
        );
      }
      if (actions.includes("PAY")) {
        currentPlayer = hasEnoughtMoney(
          gameConfig,
          currentPlayer,
          randomCard.amount
        );
        gameConfig.bank = bankService.receiveMoney(
          gameConfig.bank,
          randomCard.amount
        );
        currentPlayer = playerService.withdrawMoney(
          currentPlayer,
          randomCard.amount
        );

        console.log(
          currentPlayer.name,
          " paye a la banque ",
          randomCard.amount,
          "$"
        );
        console.log(
          "capital restant est maintenant de ",
          currentPlayer.capital
        );
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
            nextPos > gameConfig.MAX_CELL - 1 &&
            randomCard.moveTo > gameConfig.MAX_CELL
          ) {
            //passage case départ
            isDepartPassed = true;
          }
          currentPlayer.pawn.currentCellId = 0;
        }
        move(gameConfig, currentPlayer, randomCard.moveTo, isDepartPassed);
      }
      // update player board
      gameConfig.updatePlayerBoard(currentPlayer);
      if (!isMoveAction) {
        //don't update wait for focus on cell handle this
        updatePlayers(gameConfig, currentPlayer);
      }
    });
};

export const handleUnAvailableCells = function (
  gameConfig,
  currentPlayer,
  currentCell,
  title
) {
  /* handle rent title */
  if (currentCell.playerOwner && !title.ishypotheced) {
    handleRent(gameConfig, currentPlayer, currentCell, title);

    /* handle chance */
  } else if (currentCell.name === "chance") {
    const chanceCardsKeys = Object.keys(chanceArray);
    const randomChanceCard =
      chanceArray[Math.floor(Math.random() * chanceCardsKeys.length)];
    console.log("case chance ", randomChanceCard);

    handleSpecialCard(
      gameConfig,
      currentPlayer,
      randomChanceCard,
      "chance",
      currentCell.cellId
    );

    /* handle cdc */
  } else if (currentCell.name === "caisse de communauté") {
    const cdcCardsKeys = Object.keys(caisseCommunauteArray);
    const randomCdcCard =
      caisseCommunauteArray[Math.floor(Math.random() * cdcCardsKeys.length)];
    console.log("case caisse de communauté ", randomCdcCard);

    handleSpecialCard(
      gameConfig,
      currentPlayer,
      randomCdcCard,
      "cdc",
      currentCell.cellId
    );

    // cells impots taxes
  } else if (currentCell.rent) {
    handleTaxCells(gameConfig, currentPlayer, currentCell);

    // aller en retenue vous payez 500$
  } else if (currentCell.cellId === 30) {
    setTimeout(function () {
      currentPlayer.pawn.currentCellId = 10;
      gameConfig.movePawn(currentPlayer.pawn);
    }, 2000);

    setTimeout(function () {
      const amount = 500;
      gameConfig.bank = bankService.receiveMoney(gameConfig.bank, amount);
      currentPlayer = playerService.withdrawMoney(currentPlayer, amount);
      gameConfig.alertPrison(currentPlayer.name);
      gameConfig.updatePlayerBoard(currentPlayer);
    }, 2100);

    //other cells
  } else {
    updatePlayers(gameConfig, currentPlayer);
  }
};

export const disableDice = function (gameConfig) {
  gameConfig.disableDice(true);
};
export const rollTheDice = function (gameConfig) {
  return rollDice(gameConfig.diceDisplay);
};
