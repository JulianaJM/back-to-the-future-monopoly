var Dice = require("./model/dice");
var Bank = require("./model/bank");
var Pawn = require("./model/pawn");
var Player = require("./model/player");
var boardArray = require("./utils/board-game");

function monopoly() {
  var bank = new Bank();
  var player = new Player("joueur1");
  bank.capital -= player.capital;

  var pawn1 = new Pawn("Marty");
  player.pawn = pawn1;
  var nextPos = rollDice();
  console.log("nextPos ", nextPos);
  move(player, nextPos);

  var nextPos1 = rollDice();
  console.log("nextPos1 ", nextPos1);
  move(player, nextPos1);
}

var rollDice = function() {
  var diceOne = new Dice();
  var diceTwo = new Dice();
  return diceOne.shuffle() + diceTwo.shuffle();
};

function move(player, pos) {
  var pawn = player.pawn;
  pawn.currentCell = pawn.currentCell + pos;
  if (!boardArray[pos].playerOwner) {
  }

  console.log("player ", player);
}

monopoly();
