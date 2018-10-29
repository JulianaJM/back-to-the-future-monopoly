var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");

function monopoly() {
  debugger;
  var resDice = rollDice(game.diceDisplay);
  console.log("resDice ", resDice);
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  debugger;
  move(currentPlayer, resDice);
}

function move(player, resDice) {
  var nextPos = player.pawn.currentCell + resDice;
  if (nextPos <= game.MAX_CELL - 1) {
    player.pawn.currentCell = nextPos;
  } else {
    player.pawn.currentCell = nextPos - game.MAX_CELL;
  }

  updatePlayers(player);

  //wait before move pawn
  setTimeout(function() {
    game.movePawn(player.pawn);
  }, 1500);

  console.log("player ", player);
}

function updatePlayers(player) {
  debugger;
  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      p = player;
    }
    return p;
  });

  game.players = newPlayers;
}

function cellActionDispatcher() {
  var pos = game.pawn1.currentCell;
  if (!boardArray[pos].playerOwner) {
    console.log("achat");
  }
}

var game = new MonopolyView(monopoly);
game.cellsEventListener(cellActionDispatcher);
var start = function() {
  game.startGame(game);
};
game.startGameBtn.addEventListener("click", start, false);
module.exports = monopoly;
