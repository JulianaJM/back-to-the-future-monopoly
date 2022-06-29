const monopolyActions = require("./monopolyActions");

function MonopolyView(gameRuleCallback) {
  this.players = [];
  this.bank = null;
  this.diceDisplay = document.getElementById("dice-box");
  this.startGameBtn = document.getElementById("startGame");
  this.MAX_CELL = 40;

  // debug utils
  this.isDebug =
    document.querySelector("input[name=debug]:checked") &&
    document.querySelector("input[name=debug]:checked").value === "on"
      ? true
      : false;
  this.isDebugPrompt =
    document.querySelector("input[name=debugP]:checked") &&
    document.querySelector("input[name=debugP]:checked").value === "on"
      ? true
      : false;
  //debug utils

  this.cellsEventListener = function (gameLitenerCallback) {
    for (let i = 0; i < this.MAX_CELL; i++) {
      document
        .getElementById(i)
        .addEventListener("focus", gameLitenerCallback, false);
    }
  };

  this.start = function () {
    // dice button listener
    document
      .getElementById("diceButton")
      .addEventListener("click", gameRuleCallback, false);

    // init players
    this.players = monopolyActions.initPlayers(this.isDebug);

    // update bank amount
    this.bank = monopolyActions.withdrawBankInitialPlayersCapital(
      this.players[0],
      this.players[1]
    );
  };

  this.movePawn = function (pawn) {
    monopolyActions.movePawn(pawn);
  };
  this.displayBankCapital = function () {
    monopolyActions.displayBankCapital(this.bank);
  };

  this.disableDice = function (disable) {
    monopolyActions.disableDice(this.players, disable);
  };

  this.disableSwitch = function (player) {
    monopolyActions.disableSwitch(player);
  };

  this.displayPlayerTurn = function (player) {
    monopolyActions.setPlayerTurnEl(player);
  };

  this.displaySpecialCard = function (chance, player, type) {
    return monopolyActions.displaySpecialCard(chance, player, type);
  };

  this.buyTitle = function (title, player, cell) {
    return monopolyActions.buyTitle(title, player, cell);
  };

  this.updatePlayerBoard = function (
    player,
    title,
    isHypothec,
    isDepartPassed
  ) {
    monopolyActions.updatePlayerBoard(
      player,
      title,
      isHypothec,
      isDepartPassed
    );
  };

  this.gameOver = function (loser, winner) {
    monopolyActions.gameOver(loser, winner);
  };

  this.alertPayment = function (giver, receiver, amount) {
    monopolyActions.alertPayment(giver, receiver, amount);
  };

  this.alertTaxCell = function (playerName, cellId, cellName, amount) {
    monopolyActions.alertTaxCell(playerName, cellId, cellName, amount);
  };

  this.alertPrison = function (playerName) {
    monopolyActions.alertPrison(playerName);
  };
}

module.exports = MonopolyView;
