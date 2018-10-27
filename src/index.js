var rollADie = require("roll-a-die");
var Bank = require("./model/bank");
var Pawn = require("./model/pawn");
var Player = require("./model/player");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");

function monopoly() {
  var bank = new Bank();
  var player = new Player("joueur1");
  bank.capital -= player.capital;

  var pawn1 = new Pawn("Marty");
  player.pawn = pawn1;
  var nextPos = rollDice(game.diceDisplay);
  console.log("nextPos ", nextPos);
  move(player, nextPos);
}

var rollDice = function(element) {
  var res = 0;
  rollADie({
    element,
    numberOfDice: 2,
    callback: function(response) {
      res = response[0] + response[1];
    }
  });
  return res;
};

function move(player, pos) {
  var pawn = player.pawn;
  pawn.currentCell = pawn.currentCell + pos;
  game.movePion();
  if (!boardArray[pos].playerOwner) {
  }

  console.log("player ", player);
}

var game = new MonopolyView(monopoly);

module.exports = monopoly;
