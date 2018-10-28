var _offset = require("../utils/offset");
var Bank = require("../model/bank");
var Pawn = require("../model/pawn");
var Player = require("../model/player");

function MonopolyView(callback) {
  this.diceButton = document
    .getElementById("diceButton")
    .addEventListener("click", callback, false);
  this.diceDisplay = document.getElementById("dice-box");

  this.bank = new Bank();
  this.player = new Player("joueur1");
  this.bank.capital -= this.player.capital;
  this.pawn1 = new Pawn("Marty");
  this.player.pawn = this.pawn1;

  this.movePawn = function(pos) {
    // this.pion.style.display = "block";
    var pawn = document.getElementById("pionMarty");
    var newPos = document.getElementById(pos);
    // var parent = newPos.parentElement;
    var offset = _offset(newPos);
    translateToAbsolute(pawn, offset.left, offset.top, "1s");
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
