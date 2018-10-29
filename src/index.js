var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");

function monopoly() {
  var resDice = rollDice(game.diceDisplay);
  console.log("resDice ", resDice);
  move(game.player, resDice);
}

function move(player, resDice) {
  var pawn = player.pawn;
  var nextPos = pawn.currentCell + resDice;
  if (nextPos <= game.MAX_CELL - 1) {
    pawn.currentCell = nextPos;
  } else {
    pawn.currentCell = nextPos - game.MAX_CELL;
  }
  player.pawn = pawn;
  //wait before move pawn
  setTimeout(function() {
    game.movePawn(pawn.currentCell);
  }, 1500);

  console.log("player ", player);
}

function cellActionDispatcher() {
  var pos = game.pawn1.currentCell;
  if (!boardArray[pos].playerOwner) {
    console.log("achat");
  }
}

var game = new MonopolyView(monopoly);
game.cellsEventListener(cellActionDispatcher);

module.exports = monopoly;
