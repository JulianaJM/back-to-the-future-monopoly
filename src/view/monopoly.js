"use strict";

var Bank = require("../model/bank");
var Pawn = require("../model/pawn");
var Player = require("../model/player");
var boardArray = require("../utils/board-game");

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
  this.isDebug = false;

  this.startGame = function() {
    this.isDebug =
      document.querySelector("input[name=debug]:checked") &&
      document.querySelector("input[name=debug]:checked").value === "on"
        ? true
        : false;

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

    var p1Display = document.getElementById("player1");
    var newP = document.createElement("p");
    var newContent = document.createTextNode(player1.name);
    newP.appendChild(newContent);
    p1Display.appendChild(newP);

    var p2Display = document.getElementById("player2");
    var newP1 = document.createElement("p");
    var newContent1 = document.createTextNode(player2.name);
    newP1.appendChild(newContent1);
    p2Display.appendChild(newP1);

    var player1Capital = document.getElementById("player1Capital");
    var player2Capital = document.getElementById("player2Capital");

    player1Capital.innerHTML = "Capital restant : " + player1.capital;
    player2Capital.innerHTML = "Capital restant : " + player2.capital;
    this.displayPlayerTurn(player1);

    document.getElementById("player-board").style.display = "block";
    document.getElementById("player-turn").style.display = "block";
    document.getElementById("monopoly-board").style.display = "block";

    document.getElementById("header-popup").style.visibility = "hidden";
    document.getElementById("header-popup").style.opacity = "0";

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

    //listener switch
    document
      .getElementById("switch1")
      .addEventListener("click", this.switch.bind(this), false);

    document
      .getElementById("switch2")
      .addEventListener("click", this.switch.bind(this), false);

    document.getElementById("switch2").disabled = true;

    document.getElementById("header").style.display = "none";
  };

  this.movePawn = function(pawn) {
    var pawnElement = document.getElementById(pawn.name);
    var newPos = document.getElementById(pawn.currentCellId);
    newPos.tabIndex = -1;
    translateToAbsolute(
      pawnElement,
      newPos.firstElementChild.offsetLeft,
      newPos.firstElementChild.offsetTop,
      "2s"
    );
    newPos.focus();

    setTimeout(function() {
      newPos.blur();
      newPos.removeAttribute("tabindex");
    }, 2000);
  };

  this.disableDice = function(disable) {
    document.getElementById("diceButton").disabled = disable;

    //disable switch for other player
    this.players.forEach(player => {
      if (player.current) {
        document.getElementById("switch" + player.id).disabled = !disable;
        player.titleList.forEach(title => {
          if (document.getElementById("btnTitle" + title.cellId)) {
            document.getElementById(
              "btnTitle" + title.cellId
            ).disabled = !disable;
          }
        });
      } else {
        document.getElementById("switch" + player.id).disabled = disable;
        player.titleList.forEach(title => {
          if (document.getElementById("btnTitle" + title.cellId)) {
            document.getElementById(
              "btnTitle" + title.cellId
            ).disabled = disable;
          }
        });
      }
    });
  };

  this.disableSwitch = function(player) {
    document.getElementById("switch" + player.id).disabled = true;
    player.titleList.forEach(title => {
      if (document.getElementById("btnTitle" + title.cellId)) {
        document.getElementById("btnTitle" + title.cellId).disabled = true;
      }
    });
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

  this.displayPlayerTurn = function(player) {
    var playerTurnDiv = document.getElementById("player-turn");
    playerTurnDiv.removeAttribute("class");
    playerTurnDiv.classList.add("turn-player" + player.id);
    document.getElementById("playerCurrent").innerHTML =
      player.name + " a vous de lancer les dés";
  };

  this.displaySpecialCard = function(chance, player, type) {
    return new Promise((resolve, reject) => {
      //wait move pawn
      setTimeout(
        function() {
          var popupTitle = document.getElementById("popupTitle");
          var typeName = type === "cdc" ? "caisse de communauté" : type;
          popupTitle.innerHTML =
            player.name + ", vous tirez une carte " + typeName;

          var chanceDom = document.getElementById(type + chance.id);
          var newChance = chanceDom.cloneNode();
          newChance.id = newChance.id + "chance";
          var cardChanceDisplay = document.getElementById("acquisition");
          if (cardChanceDisplay.firstChild) {
            cardChanceDisplay.removeChild(cardChanceDisplay.firstChild);
          }
          newChance.classList.remove("chance");
          newChance.classList.add("chanceRotate");

          cardChanceDisplay.appendChild(newChance);

          var playerCaptitalDisplay = document.getElementById("capital");
          playerCaptitalDisplay.innerHTML =
            "Votre capital : " + player.capital + "$";

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
        2000
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

  this.displayTitleBuy = function(title, player, cell) {
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
        2000
      );
    });
  };

  this.updatePlayerBoard = function(player, title, isHypothec) {
    var playerBoard = document.getElementById("player" + player.id);
    var playerCapital = document.getElementById(
      "player" + player.id + "Capital"
    );

    playerCapital.innerHTML = "Capital restant : " + player.capital;

    if (title) {
      var newDiv = document.createElement("div");
      var newContent = document.createTextNode(title.name);
      newDiv.id = "playerTitle" + title.cellId;
      newDiv.appendChild(newContent);
      newDiv.classList.add(title.color);
      playerBoard.appendChild(newDiv);
    }

    if (isHypothec) {
      player.titleList.forEach(title => {
        if (title.ishypotheced) {
          document.getElementById("playerTitle" + title.cellId).remove();
          var newDiv = document.createElement("div");
          var newContent = document.createTextNode(title.name);
          newDiv.id = "playerTitle" + title.cellId;
          newDiv.appendChild(newContent);
          newDiv.classList.add(title.color);
          var button = document.createElement("button");
          button.id = "btnTitle" + title.cellId;
          button.style.padding = "0";
          button.innerHTML = "lever l'hypothèque";
          button.onclick = function(e) {
            var regex = /[+-]?\d+(?:\.\d+)?/g;
            var id = e.target.id;
            var match = regex.exec(id);
            var selectedTitle = player.titleList.find(function(t) {
              return t.cellId === parseInt(match[0]);
            });

            player = this.bank.removeHypothec(player, selectedTitle);
            var titleHypotec = player.titleList.find(function(t) {
              return t.cellId === parseInt(match[0]);
            });
            if (!titleHypotec.ishypotheced) {
              document.getElementById(id).remove();
              alert(titleHypotec.name + " : hypothèque levée");
              this.updatePlayerBoard(player);
            } else {
              alert(
                titleHypotec.name + " : pas assez de fond pour lever hypothèque"
              );
            }
          }.bind(this);
          newDiv.appendChild(button);
          playerBoard.appendChild(newDiv);
        }
      });
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
  this.alertPayement = function(giver, receiver, amount) {
    // prevent focus actions when process payment
    document.getElementById(giver.pawn.currentCellId).blur();

    alert(giver.name + " verse la somme de " + amount + "$ à " + receiver.name);
  };

  this.alertCaseDepart = function(playerName) {
    // prevent focus actions
    document.getElementById(0).blur();
    alert(playerName + "est passé par la case départ il reçoit 20000$");
  };

  this.alertTaxCell = function(playerName, cellId, cellName, amount) {
    alert(
      playerName +
        " vous êtes sur la case " +
        cellName +
        " vous payez à la banque " +
        amount +
        "$"
    );

    // prevent focus actions
    document.getElementById(cellId).blur();
  };

  this.alertPrison = function(playerName) {
    alert(
      playerName +
        " vous allez en retenu ! Vous êtes débité de 500$ pour pouvoir jouer au prochain tour"
    );

    // prevent focus actions
    document.getElementById(10).blur();
  };

  this.alertHypothec = function(playerName) {
    alert(
      playerName +
        " certains de vos titres ont été hypothéqués afin de payer vos dettes"
    );
  };

  this.switch = function() {
    var currentPlayer = this.players.find(function(player) {
      return player.current;
    });
    var vsPlayer = this.players.find(function(player) {
      return !player.current;
    });

    //nothing to switch
    if (currentPlayer.titleList.length <= 0 || vsPlayer.titleList.length <= 0) {
      return;
    }
    document.getElementById("current").innerHTML = "";
    document.getElementById("vs").innerHTML = "";

    var titlesCurrent = currentPlayer.titleList;
    for (var i = 0; i < titlesCurrent.length; i++) {
      if (!titlesCurrent[i].ishypotheced) {
        var button = makeRadioButton(
          "titleCurrent",
          titlesCurrent[i].cellId,
          titlesCurrent[i].name
        );
        button.classList.add(titlesCurrent[i].color);

        document.getElementById("current").appendChild(button);
      }
    }

    var titlesvs = vsPlayer.titleList;
    for (var i = 0; i < titlesvs.length; i++) {
      if (!titlesvs[i].ishypotheced) {
        var button = makeRadioButton(
          "titlevs",
          titlesvs[i].cellId,
          titlesvs[i].name
        );
        button.classList.add(titlesvs[i].color);

        document.getElementById("vs").appendChild(button);
      }
    }

    var popup = document.getElementById("popupswitch");
    var popupTitle = document.getElementById("popupSwitchTitle");
    popupTitle.innerHTML = "Echanger";

    var button = document.createElement("button");
    button.innerHTML = "Demander l'échange";
    button.onclick = function() {
      this.handleSwitch();
    }.bind(this);

    document.getElementById("action").appendChild(button);

    popup.style.visibility = "visible";
    popup.style.opacity = "1";
  };

  this.handleSwitch = function() {
    var popup = document.getElementById("popupswitch");
    var playerToAsk = this.players.find(function(player) {
      return !player.current;
    });

    var currentplayer = this.players.find(function(player) {
      return player.current;
    });

    var response = confirm(playerToAsk.name + ", acceptez vous le deal ?");
    if (response) {
      console.log("échange accepté");
      var selectedTitleCurrent =
        (document.querySelector("input[name=titleCurrent]:checked") &&
          document.querySelector("input[name=titleCurrent]:checked").value) ||
        null;

      var selectedTitlevs =
        (document.querySelector("input[name=titlevs]:checked") &&
          document.querySelector("input[name=titlevs]:checked").value) ||
        null;

      var titleCurrent = this.players[currentplayer.id - 1].titleList.find(
        function(title) {
          return title.cellId === parseInt(selectedTitleCurrent);
        }
      );
      var titlevs = this.players[playerToAsk.id - 1].titleList.find(function(
        title
      ) {
        return title.cellId === parseInt(selectedTitlevs);
      });

      document.getElementById("playerTitle" + selectedTitleCurrent).remove();
      document.getElementById("playerTitle" + selectedTitlevs).remove();

      //cells player owner
      boardArray[titleCurrent.cellId].playerOwner = playerToAsk;
      boardArray[titlevs.cellId].playerOwner = currentplayer;

      var newTitleListCurrent = this.players[
        currentplayer.id - 1
      ].titleList.filter(element => {
        return element.cellId !== parseInt(selectedTitleCurrent);
      });
      newTitleListCurrent.push(titlevs);
      this.players[currentplayer.id - 1].titleList = newTitleListCurrent;

      var newTitleListVs = this.players[playerToAsk.id - 1].titleList.filter(
        element => {
          return element.cellId !== parseInt(selectedTitlevs);
        }
      );
      newTitleListVs.push(titleCurrent);
      this.players[playerToAsk.id - 1].titleList = newTitleListVs;

      document.getElementById("action").innerHTML = "";

      this.updatePlayerBoard(playerToAsk, titleCurrent);
      this.updatePlayerBoard(currentplayer, titlevs);

      popup.style.visibility = "hidden";
      popup.style.opacity = "0";

      // no  deal close popup
    } else {
      console.log("échange refusé");
      document.getElementById("current").innerHTML = "";
      document.getElementById("vs").innerHTML = "";
      document.getElementById("action").innerHTML = "";

      popup.style.visibility = "hidden";
      popup.style.opacity = "0";
    }
  };
}

function makeRadioButton(name, value, text) {
  var label = document.createElement("label");
  var radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = value;

  label.appendChild(radio);

  label.appendChild(document.createTextNode(text));
  return label;
}

function translateToAbsolute(sel, x, y, dur) {
  var newX = x - sel.offsetLeft;
  var newY = y - sel.offsetTop;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";
}

module.exports = MonopolyView;
