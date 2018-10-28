var rollADie = require("roll-a-die");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");

function monopoly() {
  var nextPos = rollDice(game.diceDisplay);
  console.log("nextPos ", nextPos);
  move(game.player, nextPos);
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
  player.pawn = pawn;
  game.movePawn(pawn.currentCell);
  if (!boardArray[pos].playerOwner) {
  }

  console.log("player ", player);
}

var game = new MonopolyView(monopoly);

module.exports = monopoly;
