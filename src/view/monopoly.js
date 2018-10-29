var _offset = require("../utils/offset");
var Bank = require("../model/bank");
var Pawn = require("../model/pawn");
var Player = require("../model/player");

function MonopolyView(gameRuleCallback) {
  this.MAX_CELL = 40;
  this.players = [];
  this.bank = null;
  this.diceDisplay = null;
  this.startGameBtn = document.getElementById("startGame");

  this.startGame = function() {
    var pawnArray = ["pionMarty", "pionDoc", "pionDoloreane", "pionHoverboard"];
    var selectedPawn = document.querySelector("input[name=pawn]:checked").value;
    var playerName = document.getElementById("pseudo").value;
    this.diceDisplay = document.getElementById("dice-box");

    this.bank = new Bank();
    var player = new Player(playerName, 1);
    player.current = true;
    this.bank.capital -= player.capital;
    var pawn1 = new Pawn(selectedPawn);
    player.pawn = pawn1;

    var virtualPlayer = new Player("MrRobot1337", 2);
    this.bank.capital -= virtualPlayer.capital;
    var index = pawnArray.indexOf(selectedPawn);
    if (index !== -1) {
      pawnArray.splice(index, 1);
    }
    var randomPawn = pawnArray[Math.floor(Math.random() * pawnArray.length)];
    var pawn2 = new Pawn(randomPawn);
    virtualPlayer.pawn = pawn2;
    virtualPlayer.virtual = true;

    this.players = [player, virtualPlayer];

    document
      .getElementById("diceButton")
      .addEventListener("click", gameRuleCallback, false);

    var board = document.getElementById("monopoly-board");
    board.style.display = "block";
    document.getElementById("monopoly-start").style.display = "none";

    var initialPos = document.getElementById(pawn1.currentCell);
    var pawn1Display = document.getElementById(pawn1.name);
    var pawn2Display = document.getElementById(pawn2.name);

    initialPos.appendChild(pawn1Display);
    initialPos.appendChild(pawn2Display);
  };

  this.movePawn = function(pawn) {
    var pawnElement = document.getElementById(pawn.name);
    var pawnParent = pawnElement.parentElement;
    pawnParent.removeChild(pawnElement);
    var newPos = document.getElementById(pawn.currentCell);
    newPos.appendChild(pawnElement);
    newPos.focus();
    // var offset = _offset(newPos);
    // translateToAbsolute(pawn, offset.left, offset.top, "1s");
  };

  this.cellsEventListener = function(gameLitenerCallback) {
    for (var i = 0; i < this.MAX_CELL - 1; i++) {
      document
        .getElementById(i)
        .addEventListener("focus", gameLitenerCallback, false);
    }
  };
}

function translateToAbsolute(sel, x, y, dur) {
  var offset = _offset(sel);
  var newX = -offset.left + x;
  var newY = -offset.top + y;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";

  /*var offset = _offset(sel);
  var newX = 0;
  var newY = 0;
  if (parent.className === "board-bottom") {
    newX = -offset.left + x;
    newY = -offset.top + y;
  } else if (parent.className === "board-left") {
    newX = -x;
    newY = -offset.top + y;
  } else if (parent.className === "board-top") {
    var offset2 = _offset(parent);
    newX = offset.left - x;
    newY = -(offset.top + y + offset2.top);
  }
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";*/
}

module.exports = MonopolyView;
