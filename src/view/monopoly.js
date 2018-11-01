"use strict";

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
    var selectedPawn =
      (document.querySelector("input[name=pawn]:checked") &&
        document.querySelector("input[name=pawn]:checked").value) ||
      "pionMarty";
    var playerName = document.getElementById("pseudo").value || "player1";
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

    var initialPos = document.getElementById(pawn1.currentCellId);
    var pawn1Display = document.getElementById(pawn1.name);
    var pawn2Display = document.getElementById(pawn2.name);
    document.getElementById("tools").appendChild(pawn1Display);
    document.getElementById("tools").appendChild(pawn2Display);
    document.getElementById("tools").style.display = "block";

    document.getElementById("monopoly-start").innerHTML = "";
    var board = document.getElementById("monopoly-board");

    board.style.display = "block";

    translateToAbsolute(
      pawn1Display,
      initialPos.firstElementChild.offsetLeft,
      initialPos.firstElementChild.offsetTop,
      "1s"
    );

    translateToAbsolute(
      pawn2Display,
      initialPos.firstElementChild.offsetLeft,
      initialPos.firstElementChild.offsetTop,
      "1s"
    );
  };

  this.movePawn = function(pawn) {
    var pawnElement = document.getElementById(pawn.name);
    var newPos = document.getElementById(pawn.currentCellId);
    translateToAbsolute(
      pawnElement,
      newPos.firstElementChild.offsetLeft,
      newPos.firstElementChild.offsetTop,
      "2s"
    );
    newPos.focus();

    setTimeout(function() {
      newPos.blur();
    }, 2000);
  };

  this.cellsEventListener = function(gameLitenerCallback) {
    for (var i = 0; i < this.MAX_CELL; i++) {
      document
        .getElementById(i)
        .addEventListener("focus", gameLitenerCallback, false);
    }
  };

  this.checkPlayerResponse = function(title) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        var titleDisplay = document.getElementById("title" + title.cellId);
        var newTitleDisplay = titleDisplay.cloneNode();
        newTitleDisplay.id = newTitleDisplay.id + "buy?";
        var cardDisplay = document.getElementById("acquisition");
        if (cardDisplay.firstChild) {
          cardDisplay.removeChild(cardDisplay.firstChild);
        }
        cardDisplay.appendChild(newTitleDisplay);
        newTitleDisplay.classList.remove("cards");
        document.getElementById("popup1").style.visibility = "visible";
        document.getElementById("popup1").style.opacity = "1";
        document
          .getElementById("buyTitle")
          .addEventListener("focus", function() {
            resolve(sendResponse(true));
          });

        document.getElementById("cancel").addEventListener("focus", function() {
          resolve(sendResponse(false));
        });
      }, 2100);
    });
  };
}

function sendResponse(response) {
  document.getElementById("popup1").style.visibility = "hidden";
  document.getElementById("popup1").style.opacity = "0";
  return response;
}

function translateToAbsolute(sel, x, y, dur) {
  var newX = x - sel.offsetLeft;
  var newY = y - sel.offsetTop;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";
}

module.exports = MonopolyView;
