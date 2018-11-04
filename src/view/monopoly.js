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
  this.popup = document.getElementById("popup1");
  this.buyBtn = document.getElementById("buyTitle");
  this.cancelBtn = document.getElementById("cancel");
  this.okBtn = document.getElementById("ok");

  this.startGame = function() {
    var pawnArray = ["pionMarty", "pionDoc", "pionDoloreane", "pionHoverboard"];
    var selectedPawnPlayer1 =
      (document.querySelector("input[name=pawn]:checked") &&
        document.querySelector("input[name=pawn]:checked").value) ||
      "pionMarty";

    var selectedPawnPlayer2 =
      (document.querySelector("input[name=pawn1]:checked") &&
        document.querySelector("input[name=pawn1]:checked").value) ||
      "pionDoc";
    var playerName1 = document.getElementById("pseudo1").value || "player1";
    var playerName2 = document.getElementById("pseudo2").value || "player2";

    this.diceDisplay = document.getElementById("dice-box");

    this.bank = new Bank();
    var player1 = new Player(playerName1, 1);
    player1.current = true;
    this.bank.capital -= player1.capital;
    var pawn1 = new Pawn(selectedPawnPlayer1);
    player1.pawn = pawn1;

    var player2 = new Player(playerName2, 2);
    this.bank.capital -= player2.capital;
    var pawn2 = null;
    //can't have same pawn pick a random
    if (selectedPawnPlayer2 === selectedPawnPlayer1) {
      var index = pawnArray.indexOf(selectedPawnPlayer1);
      if (index !== -1) {
        pawnArray.splice(index, 1);
      }
      var randomPawn = pawnArray[Math.floor(Math.random() * pawnArray.length)];
      pawn2 = new Pawn(randomPawn);
    } else {
      pawn2 = new Pawn(selectedPawnPlayer2);
      player2.pawn = pawn2;
    }

    this.players = [player1, player2];

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

    var playerInfoDisplay = document.getElementById("player-board");
    var p1Display = document.getElementById("player1");
    var p2Display = document.getElementById("player2");

    var newP = document.createElement("p");
    var newContent = document.createTextNode(player1.name);
    newP.appendChild(newContent);
    p1Display.appendChild(newP);

    var newP1 = document.createElement("p");
    var newContent1 = document.createTextNode(player2.name);
    newP1.appendChild(newContent1);
    p2Display.appendChild(newP1);

    var player1Capital = document.getElementById("player1Capital");
    var player2Capital = document.getElementById("player2Capital");

    player1Capital.innerHTML = "Capital restant : " + player1.capital;
    player2Capital.innerHTML = "Capital restant : " + player2.capital;

    playerInfoDisplay.style.display = "block";

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

  this.disableDice = function(disable) {
    document.getElementById("diceButton").disabled = disable;
  };

  this.openPopup = function() {
    this.popup.style.visibility = "visible";
    this.popup.style.opacity = "1";
  };

  this.closePopup = function() {
    this.popup.style.visibility = "hidden";
    this.popup.style.opacity = "0";
  };

  this.sendResponse = function(response) {
    this.closePopup();
    return response;
  };

  this.displayChanceCard = function(chance, player) {
    return new Promise((resolve, reject) => {
      //wait move pawn
      setTimeout(
        function() {
          var popupTitle = document.getElementById("popupTitle");
          popupTitle.innerHTML = player.name + " vous tirez une carte chance";

          var chanceDom = document.getElementById("chance" + chance.id);
          var newChance = chanceDom.cloneNode();
          newChance.id = newChance.id + "chance";
          var cardChanceDisplay = document.getElementById("acquisition");
          if (cardChanceDisplay.firstChild) {
            cardChanceDisplay.removeChild(cardChanceDisplay.firstChild);
          }
          newChance.classList.remove("chance");
          newChance.classList.add("chanceRotate");

          cardChanceDisplay.appendChild(newChance);

          this.openPopup();

          this.buyBtn.style.display = "none";
          this.cancelBtn.style.display = "none";
          this.okBtn.style.display = "block";

          this.okBtn.addEventListener(
            "click",
            function() {
              this.closePopup();
              resolve(true);
            }.bind(this),
            true
          );
        }.bind(this),
        2100
      );
    });
  };

  this.cellsEventListener = function(gameLitenerCallback) {
    for (var i = 0; i < this.MAX_CELL; i++) {
      document
        .getElementById(i)
        .addEventListener("focus", gameLitenerCallback, false);
    }
  };

  this.checkPlayerResponse = function(title, player, cell) {
    return new Promise((resolve, reject) => {
      //wait move pawn
      setTimeout(
        function() {
          var popupTitle = document.getElementById("popupTitle");
          popupTitle.innerHTML =
            player.name +
            ", souhaitez vous acquerir " +
            "pour " +
            cell.price +
            " $ :";

          var playerCaptitalDisplay = document.getElementById("capital");
          playerCaptitalDisplay.innerHTML =
            "Votre capital : " + player.capital + "$";

          var titleDisplay = document.getElementById("title" + title.cellId);
          var newTitleDisplay = titleDisplay.cloneNode();
          newTitleDisplay.id = newTitleDisplay.id + "buy?";
          var cardDisplay = document.getElementById("acquisition");
          if (cardDisplay.firstChild) {
            cardDisplay.removeChild(cardDisplay.firstChild);
          }
          cardDisplay.appendChild(newTitleDisplay);
          newTitleDisplay.classList.remove("cards");
          this.openPopup();
          this.buyBtn.style.display = "block";
          this.cancelBtn.style.display = "block";
          this.okBtn.style.display = "none";
          this.buyBtn.addEventListener(
            "click",
            function() {
              resolve(this.sendResponse(true, player, title));
            }.bind(this)
          );

          this.cancelBtn.addEventListener(
            "click",
            function() {
              resolve(this.sendResponse(false, player, title));
            }.bind(this)
          );
        }.bind(this),
        2100
      );
    });
  };

  this.updatePlayerBoard = function(player, title) {
    var playerBoard = document.getElementById("player" + player.id);
    var playerCapital = document.getElementById(
      "player" + player.id + "Capital"
    );

    playerCapital.innerHTML = "Capital restant : " + player.capital;

    if (title) {
      var newDiv = document.createElement("div");
      var newContent = document.createTextNode(title.name);
      newDiv.appendChild(newContent);
      playerBoard.appendChild(newDiv);
    }
  };

  this.gameOver = function(loser, winner) {
    this.disableDice(true);
    var popupTitle = document.getElementById("popupTitle");
    popupTitle.innerHTML = "Game over ...";
    var dialogDisplay = document.getElementById("acquisition");
    if (dialogDisplay.firstChild) {
      dialogDisplay.removeChild(dialogDisplay.firstChild);
    }
    document.getElementById("capital").innerHTML = "";
    document.getElementById("decision").innerHTML = "";

    dialogDisplay.innerHTML =
      loser.name +
      " a fait faillite ! " +
      winner.name +
      " remporte la partie !";
    this.openPopup();
  };
}

function translateToAbsolute(sel, x, y, dur) {
  var newX = x - sel.offsetLeft;
  var newY = y - sel.offsetTop;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";
}

module.exports = MonopolyView;
