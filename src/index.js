var rollDice = require("./utils/roll-a-die");
var boardArray = require("./utils/board-game");
var MonopolyView = require("./view/monopoly");
var TitleCell = require("./model/title-cell");

function monopoly() {
  var resDice = rollDice(game.diceDisplay);
  console.log("resDice ", resDice);
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  move(currentPlayer, resDice);
}

function move(player, resDice) {
  var nextPos = player.pawn.currentCell + resDice;
  if (nextPos <= game.MAX_CELL - 1) {
    player.pawn.currentCell = nextPos;
  } else {
    player.pawn.currentCell = nextPos - game.MAX_CELL;
  }

  //wait before move pawn
  setTimeout(function() {
    game.movePawn(player.pawn);
    updatePlayers(player);
  }, 1500);

  console.log("player ", player);
}

function updatePlayers(player) {
  var newPlayers = game.players.map(function(p) {
    if (p.id === player.id) {
      p = player;
    } else {
      p.current = true;
    }
    return p;
  });

  game.players = newPlayers;
}

function cellActionDispatcher(e) {
  // var idPawn = e.currentTarget.id;
  // debugger;
  var currentPlayer = game.players.find(function(player) {
    return player.current;
  });
  var pos = currentPlayer.pawn.currentCell;
  var currentCell = boardArray[pos];
  currentCell.isSellable(currentCell);
  currentPlayer.current = false;
  updatePlayers(currentPlayer);
}

var game = new MonopolyView(monopoly);
game.cellsEventListener(cellActionDispatcher);
var start = function() {
  game.startGame(game);
};
game.startGameBtn.addEventListener("click", start, false);
module.exports = monopoly;
