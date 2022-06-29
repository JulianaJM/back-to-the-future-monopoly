const Player = require("../model/player");
const Bank = require("../model/bank");
const Pawn = require("../model/pawn");
const boardArray = require("../utils/board-game");
const bankService = require("../services/bankService");
const playerService = require("../services/playerService");

const popup = document.getElementById("popup1");
const buyBtn = document.getElementById("buyTitle");
const cancelBtn = document.getElementById("cancel");
const okBtn = document.getElementById("ok");

function translateToAbsolute(sel, x, y, dur) {
  let newX = x - sel.offsetLeft;
  let newY = y - sel.offsetTop;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";
}

function makeRadioButton(name, value, text) {
  let label = document.createElement("label");
  let radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = value;

  label.appendChild(radio);

  label.appendChild(document.createTextNode(text));
  return label;
}

const openPopup = function () {
  popup.style.visibility = "visible";
  popup.style.opacity = "1";
};

const closePopup = function () {
  popup.style.visibility = "hidden";
  popup.style.opacity = "0";
};

const sendResponseAndClosePopup = function (response) {
  closePopup();
  return response;
};

export const buyTitle = function (title, player, cell) {
  return new Promise((resolve, reject) => {
    //wait move pawn
    setTimeout(function () {
      let popupTitleEl = document.getElementById("popupTitle");
      popupTitleEl.innerHTML =
        player.name +
        ", souhaitez vous acquerir " +
        "pour " +
        cell.price +
        " $ :";

      let playerCaptitalDisplay = document.getElementById("capital");
      playerCaptitalDisplay.innerHTML =
        "Votre capital : " + player.capital + "$";

      let titleDisplay = document.getElementById("title" + title.cellId);
      let newTitleDisplay = titleDisplay.cloneNode();
      newTitleDisplay.id = newTitleDisplay.id + "buy?";
      let cardDisplay = document.getElementById("acquisition");
      if (cardDisplay.firstChild) {
        cardDisplay.removeChild(cardDisplay.firstChild);
      }
      cardDisplay.appendChild(newTitleDisplay);
      newTitleDisplay.classList.remove("cards");

      openPopup();

      buyBtn.style.display = "block";
      cancelBtn.style.display = "block";
      okBtn.style.display = "none";

      buyBtn.addEventListener("click", function () {
        resolve(sendResponseAndClosePopup(true));
      });
      cancelBtn.addEventListener("click", function () {
        resolve(sendResponseAndClosePopup(false));
      });
    }, 2000);
  });
};

export const displayTitle = function (title, player) {
  document.getElementById("popupTitle").innerHTML = title.name;
  let playerCaptitalDisplay = document.getElementById("capital");
  playerCaptitalDisplay.innerHTML =
    "Votre capital : " +
    player.capital +
    "$ <br /> <p>Si vous possédez tous les titres du groupe le loyer compte double</p>";

  let titleDisplay = document.getElementById("title" + title.cellId);
  let newTitleDisplay = titleDisplay.cloneNode();
  newTitleDisplay.id = newTitleDisplay.id + "buy?";
  let cardDisplay = document.getElementById("acquisition");
  if (cardDisplay.firstChild) {
    cardDisplay.removeChild(cardDisplay.firstChild);
  }
  cardDisplay.appendChild(newTitleDisplay);
  newTitleDisplay.classList.remove("cards");
  openPopup();

  buyBtn.style.display = "none";
  cancelBtn.style.display = "none";

  okBtn.addEventListener(
    "click",
    function () {
      closePopup();
    },
    true
  );
  okBtn.style.display = "block";
};

export const setPlayerTurnEl = function (player) {
  let playerTurnDiv = document.getElementById("player-turn");
  playerTurnDiv.removeAttribute("class");
  playerTurnDiv.classList.add("turn-player" + player.id);
  document.getElementById("playerCurrent").innerHTML =
    player.name + ", lancer les dés";
};

const setPlayerPawnEl = function (pawnName, pawnDefault) {
  const playerPawnEl = document.querySelector(`input[name=${pawnName}]:checked`)
    ? document.querySelector(`input[name=${pawnName}]:checked`).value
    : `${pawnDefault}`;

  return playerPawnEl;
};

const buildPlayers = function (isDebug) {
  const pawnArray = ["pionMarty", "pionDoc", "pionDoloreane", "pionHoverboard"];
  // players name
  const playerName1 = document.getElementById("pseudo1").value || "Marty";
  const playerName2 = document.getElementById("pseudo2").value || "Doc";
  // players pawn
  const selectedPawnPlayer1 = setPlayerPawnEl("pawn", "pionMarty");
  const selectedPawnPlayer2 = setPlayerPawnEl("pawn1", "pionDoc");

  let player1 = new Player(playerName1, 1);
  player1.current = true;
  let pawn1 = new Pawn(selectedPawnPlayer1);
  player1.pawn = pawn1;

  let player2 = new Player(playerName2, 2);
  let pawn2 = null;

  //can't have same pawn pick a random
  if (selectedPawnPlayer2 === selectedPawnPlayer1) {
    const index = pawnArray.indexOf(selectedPawnPlayer1);

    if (index !== -1) {
      pawnArray.splice(index, 1);
    }

    let randomPawn = pawnArray[Math.floor(Math.random() * pawnArray.length)];
    pawn2 = new Pawn(randomPawn);
    player2.pawn = pawn2;
  } else {
    pawn2 = new Pawn(selectedPawnPlayer2);
    player2.pawn = pawn2;
  }

  if (isDebug) {
    player1.capital = 25000;
    player2.capital = 25000;
  }

  return [player1, player2];
};

export const displayBankCapital = function (bank) {
  document.getElementById("bank-capital").innerHTML = "";
  document.getElementById(
    "bank-capital"
  ).innerHTML = `Le capital restant de la banque est de ${bank.capital}$`;
  document.getElementById("bank-capital").style.display = "block";
};

export const withdrawBankInitialPlayersCapital = function (player1, player2) {
  const bank = new Bank();
  bank.capital -= player1.capital;
  bank.capital -= player2.capital;

  displayBankCapital(bank);

  return bank;
};

const initPawnBoardEl = function (pawn1, pawn2) {
  let pawn1El = document.getElementById(pawn1.name);
  let pawn2El = document.getElementById(pawn2.name);
  document.getElementById("tools").appendChild(pawn1El);
  document.getElementById("tools").appendChild(pawn2El);
  document.getElementById("tools").style.display = "block";
  document.getElementById("monopoly-start").innerHTML = "";
};

const initPlayerScoreEl = function (player1, player2) {
  let p1Display = document.getElementById("player1");
  let newP = document.createElement("p");
  let newContent = document.createTextNode(player1.name);
  newP.classList.add("name-playeur");
  let newPawn1 = document.getElementById(player1.pawn.name).cloneNode();
  newPawn1.id = "boardPlayer1sel";
  newPawn1.style.width = "16%";
  newP.appendChild(newPawn1);
  newP.appendChild(newContent);
  p1Display.appendChild(newP);

  let p2Display = document.getElementById("player2");
  let newP1 = document.createElement("p");
  let newContent1 = document.createTextNode(player2.name);
  newP1.classList.add("name-playeur");
  let newPawn2 = document.getElementById(player2.pawn.name).cloneNode();
  newPawn2.id = "boardPlayer2sel";
  newPawn2.style.width = "16%";
  newP1.appendChild(newPawn2);
  newP1.appendChild(newContent1);
  p2Display.appendChild(newP1);

  let player1Capital = document.getElementById("player1Capital");
  let player2Capital = document.getElementById("player2Capital");

  player1Capital.innerHTML = "Capital restant : " + player1.capital + "$";
  player2Capital.innerHTML = "Capital restant : " + player2.capital + "$";
};

const initBoard = function (initialPos, pawn1El, pawn2El) {
  document.getElementById("header").style.display = "none";

  document.getElementById("player-board").style.display = "block";
  document.getElementById("player-turn").style.display = "block";
  document.getElementById("monopoly-board").style.display = "block";

  document.getElementById("header-popup").style.visibility = "hidden";
  document.getElementById("header-popup").style.opacity = "0";

  // move pawns to start cell
  translateToAbsolute(
    pawn1El,
    initialPos.firstElementChild.offsetLeft,
    initialPos.firstElementChild.offsetTop,
    "1s"
  );
  translateToAbsolute(
    pawn2El,
    initialPos.firstElementChild.offsetLeft,
    initialPos.firstElementChild.offsetTop,
    "1s"
  );

  document.getElementById("diceButton").focus();
};

const alertCaseDepart = function (playerName) {
  document.getElementById("popupTitle").innerHTML = "case départ";
  let playerCaptitalDisplay = document.getElementById("capital");
  playerCaptitalDisplay.innerHTML = "";

  let cardDisplay = document.getElementById("acquisition");
  if (cardDisplay.firstChild) {
    cardDisplay.removeChild(cardDisplay.firstChild);
  }
  cardDisplay.innerHTML = "<p>" + playerName + ", vous recevez 20000$</p>";
  openPopup();

  buyBtn.style.display = "none";
  cancelBtn.style.display = "none";
  okBtn.addEventListener(
    "click",
    function () {
      closePopup();
    },
    true
  );
  okBtn.style.display = "block";
};

const handleHypothecClick = function (e, bank, player, title) {
  let regex = /[+-]?\d+(?:\.\d+)?/g; // find number
  let id = e.target.id;
  let match = regex.exec(id);
  let selectedTitle = player.titleList.find(function (t) {
    return t.cellId === parseInt(match[0]);
  });

  bank = bankService.removeHypothec(bank, player, selectedTitle);
  const amountHypothec = selectedTitle.hypothecValue * 1.1;
  player = playerService.withdrawMoney(player, amountHypothec);

  let titleHypotec = player.titleList.find(function (t) {
    return t.cellId === parseInt(match[0]);
  });

  if (!titleHypotec.ishypotheced) {
    document.getElementById(id).remove();
    document.getElementById("playerTitle" + title.cellId).onclick =
      function () {
        displayTitle(title, player);
      };
    alert(titleHypotec.name + " : hypothèque levée");
    updatePlayerBoard(player);
  } else {
    alert(
      titleHypotec.name +
        " : pas assez de fond pour lever l'hypothèque d'une valeur de " +
        parseInt(titleHypotec.hypothecValue * 1.1) +
        "$"
    );
  }
};

export const alertHypothec = function (playerName) {
  document.getElementById("popupTitle").innerHTML =
    "oups, " + playerName + " est sur la paille ...";
  let playerCaptitalDisplay = document.getElementById("capital");
  playerCaptitalDisplay.innerHTML = "";

  let cardDisplay = document.getElementById("acquisition");
  if (cardDisplay.firstChild) {
    cardDisplay.removeChild(cardDisplay.firstChild);
  }
  cardDisplay.innerHTML =
    "<p>Certains de vos biens ont été hypothéqués afin de rembourser vos dettes. Levez l'hypothèque une fois que vous aurez suffisament de fonds (10% d'intérêts seront prélevés)</p>";
  openPopup();

  buyBtn.style.display = "none";
  cancelBtn.style.display = "none";
  okBtn.addEventListener(
    "click",
    function () {
      closePopup();
    },
    true
  );
  okBtn.style.display = "block";
};

const updateTitleStat = function (title, player, playerBoard) {
  let newA = document.createElement("a");
  let newContent = document.createTextNode(title.name);
  newA.id = "playerTitle" + title.cellId;
  newA.onclick = function () {
    displayTitle(title, player);
  };
  newA.appendChild(newContent);
  newA.classList.add(title.color);
  let divColorTitle = document.getElementById(title.color + player.id);
  divColorTitle.appendChild(newA);
  playerBoard.appendChild(divColorTitle);
};

const updateHypothecStat = function (player, playerBoard) {
  player.titleList.forEach((title) => {
    if (title.ishypotheced) {
      document.getElementById("playerTitle" + title.cellId).remove();
      let newA = document.createElement("a");
      let newContent = document.createTextNode(title.name);
      newA.id = "playerTitle" + title.cellId;
      newA.appendChild(newContent);
      newA.classList.add(title.color);
      //btn lever hypothèque
      let button = document.createElement("button");
      button.id = "btnTitle" + title.cellId;
      button.style.padding = "0";
      button.innerHTML = "lever l'hypothèque";
      button.onclick = function (e) {
        handleHypothecClick(e, player, title);
      };
      newA.appendChild(button);
      let divColorTitle = document.getElementById(title.color + player.id);
      divColorTitle.appendChild(newA);
      playerBoard.appendChild(divColorTitle);
    }
  });
  alertHypothec(player.name);
};

export const updatePlayerBoard = function (
  player,
  title,
  isHypothec,
  isDepartPassed
) {
  let playerBoard = document.getElementById("player" + player.id);
  let playerCapital = document.getElementById("player" + player.id + "Capital");
  playerCapital.innerHTML = "Capital restant : " + player.capital + "$";

  if (title) {
    updateTitleStat(title, player, playerBoard);
  }
  if (isDepartPassed) {
    alertCaseDepart(player.name);
  }
  if (isHypothec) {
    updateHypothecStat(player, playerBoard);
  }
};

const handleSwitch = function (players) {
  let popup = document.getElementById("popupswitch");
  let playerToAsk = players.find(function (player) {
    return !player.current;
  });

  let currentplayer = players.find(function (player) {
    return player.current;
  });

  let response = confirm(playerToAsk.name + ", acceptez vous le deal ?");
  if (response) {
    let selectedTitleCurrent =
      (document.querySelector("input[name=titleCurrent]:checked") &&
        document.querySelector("input[name=titleCurrent]:checked").value) ||
      null;

    let selectedTitleVs =
      (document.querySelector("input[name=titlevs]:checked") &&
        document.querySelector("input[name=titlevs]:checked").value) ||
      null;

    if (!selectedTitleCurrent || !selectedTitleVs) {
      // nothing selected
      console.log("échange refusé, vous n'avez rien sélectionné");
      document.getElementById("current").innerHTML = "";
      document.getElementById("vs").innerHTML = "";
      document.getElementById("action").innerHTML = "";

      popup.style.visibility = "hidden";
      popup.style.opacity = "0";

      // do switch
    } else {
      console.log("échange accepté");
      let titleCurrent = players[currentplayer.id - 1].titleList.find(function (
        title
      ) {
        return title.cellId === parseInt(selectedTitleCurrent);
      });
      let titleVs = players[playerToAsk.id - 1].titleList.find(function (
        title
      ) {
        return title.cellId === parseInt(selectedTitleVs);
      });

      document.getElementById("playerTitle" + selectedTitleCurrent).remove();
      document.getElementById("playerTitle" + selectedTitleVs).remove();

      //cells player owner
      boardArray[titleCurrent.cellId].playerOwner = playerToAsk;
      boardArray[titleVs.cellId].playerOwner = currentplayer;

      let newTitleListCurrent = players[currentplayer.id - 1].titleList.filter(
        (element) => {
          return element.cellId !== parseInt(selectedTitleCurrent);
        }
      );
      players[currentplayer.id - 1].titleList = newTitleListCurrent;
      players[currentplayer.id - 1].titleList.push(titleVs);

      let newTitleListVs = players[playerToAsk.id - 1].titleList.filter(
        (element) => {
          return element.cellId !== parseInt(selectedTitleVs);
        }
      );
      players[playerToAsk.id - 1].titleList = newTitleListVs;
      players[playerToAsk.id - 1].titleList.push(titleCurrent);

      document.getElementById("action").innerHTML = "";

      // update stats
      updatePlayerBoard(playerToAsk, titleCurrent);
      updatePlayerBoard(currentplayer, titleVs);

      popup.style.visibility = "hidden";
      popup.style.opacity = "0";
    }

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

export const switchTitle = function (players) {
  let currentPlayer = players.find(function (player) {
    return player.current;
  });
  let vsPlayers = players.find(function (player) {
    return !player.current;
  });

  //nothing to switch
  if (currentPlayer.titleList.length <= 0 || vsPlayers.titleList.length <= 0) {
    return;
  }

  document.getElementById("current").innerHTML = "";
  document.getElementById("vs").innerHTML = "";

  let titlesCurrent = currentPlayer.titleList;
  for (let i = 0; i < titlesCurrent.length; i++) {
    if (!titlesCurrent[i].ishypotheced) {
      let button = makeRadioButton(
        "titleCurrent",
        titlesCurrent[i].cellId,
        titlesCurrent[i].name
      );
      button.classList.add(titlesCurrent[i].color);

      document.getElementById("current").appendChild(button);
    }
  }

  let titlesVs = vsPlayers.titleList;
  for (let i = 0; i < titlesVs.length; i++) {
    if (!titlesVs[i].ishypotheced) {
      let button = makeRadioButton(
        "titlevs",
        titlesVs[i].cellId,
        titlesVs[i].name
      );
      button.classList.add(titlesVs[i].color);

      document.getElementById("vs").appendChild(button);
    }
  }

  let popup = document.getElementById("popupswitch");
  let popupTitle = document.getElementById("popupSwitchTitle");
  popupTitle.innerHTML = currentPlayer.name + ", échanger : ";

  let button = document.createElement("button");
  button.innerHTML = "Demander l'échange";

  button.onclick = function () {
    handleSwitch(players);
  };
  document.getElementById("action").appendChild(button);

  popup.style.visibility = "visible";
  popup.style.opacity = "1";
};

export const initPlayers = function (isDebug) {
  const players = buildPlayers(isDebug);
  const player1 = players[0];
  const player2 = players[1];
  // player pawns
  const pawn1 = player1.pawn;
  const pawn2 = player2.pawn;

  // players pawn display el
  initPawnBoardEl(pawn1, pawn2);

  // players score display el
  initPlayerScoreEl(player1, player2);

  // display turn
  setPlayerTurnEl(player1);

  // display board
  initBoard(
    document.getElementById(pawn1.currentCellId),
    document.getElementById(pawn1.name),
    document.getElementById(pawn2.name)
  );

  // listener switch title cells player1
  document
    .getElementById("switch1")
    .addEventListener("click", () => switchTitle(players), false);
  document.getElementById("switch1").disabled = true;

  // listener switch title cells player2
  document
    .getElementById("switch2")
    .addEventListener("click", () => switchTitle(players), false);
  document.getElementById("switch2").disabled = true;

  return players;
};

export const movePawn = function (pawn) {
  let pawnElement = document.getElementById(pawn.name);
  let newPos = document.getElementById(pawn.currentCellId);
  newPos.tabIndex = -1;
  translateToAbsolute(
    pawnElement,
    newPos.firstElementChild.offsetLeft,
    newPos.firstElementChild.offsetTop,
    "2s"
  );
  newPos.focus();

  setTimeout(function () {
    newPos.blur();
    newPos.removeAttribute("tabindex");
  }, 2000);
};

export const disableDice = function (players, disable) {
  document.getElementById("diceButton").disabled = disable;
  if (!disable) {
    document.getElementById("diceButton").focus();
  }

  //disable switch for other player
  players.forEach((player) => {
    if (player.current) {
      document.getElementById("switch" + player.id).disabled = !disable;
      player.titleList.forEach((title) => {
        if (document.getElementById("btnTitle" + title.cellId)) {
          document.getElementById("btnTitle" + title.cellId).disabled =
            !disable;
        }
      });
    } else {
      document.getElementById("switch" + player.id).disabled = disable;
      player.titleList.forEach((title) => {
        if (document.getElementById("btnTitle" + title.cellId)) {
          document.getElementById("btnTitle" + title.cellId).disabled = disable;
        }
      });
    }
  });
};

export const disableSwitch = function (player) {
  document.getElementById("switch" + player.id).disabled = true;
  player.titleList.forEach((title) => {
    if (document.getElementById("btnTitle" + title.cellId)) {
      document.getElementById("btnTitle" + title.cellId).disabled = true;
    }
  });
};

export const displaySpecialCard = function (chance, player, type) {
  return new Promise((resolve, reject) => {
    //wait move pawn
    setTimeout(function () {
      let popupTitle = document.getElementById("popupTitle");
      let typeName = type === "cdc" ? "caisse de communauté" : type;
      popupTitle.innerHTML = player.name + ", vous tirez une carte " + typeName;

      let chanceDom = document.getElementById(type + chance.id);
      let newChance = chanceDom.cloneNode();
      newChance.id = newChance.id + "chance";
      let cardChanceDisplay = document.getElementById("acquisition");
      if (cardChanceDisplay.firstChild) {
        cardChanceDisplay.removeChild(cardChanceDisplay.firstChild);
      }
      newChance.classList.remove("chance");
      newChance.classList.add("chanceRotate");

      cardChanceDisplay.appendChild(newChance);

      let playerCaptitalDisplay = document.getElementById("capital");
      playerCaptitalDisplay.innerHTML =
        "Votre capital : " + player.capital + "$";

      openPopup();

      buyBtn.style.display = "none";
      cancelBtn.style.display = "none";
      okBtn.style.display = "block";

      okBtn.addEventListener(
        "click",
        function () {
          closePopup();
          resolve(true);
        },
        true
      );
    }, 2000);
  });
};

export const gameOver = function (loser, winner) {
  disableDice(true);
  let popupTitle = document.getElementById("popupTitle");
  popupTitle.innerHTML = "Game over ...";
  let dialogDisplay = document.getElementById("acquisition");
  if (dialogDisplay.firstChild) {
    dialogDisplay.removeChild(dialogDisplay.firstChild);
  }
  document.getElementById("capital").innerHTML = "";
  document.getElementById("decision").innerHTML = "";

  dialogDisplay.innerHTML =
    loser.name + " a fait faillite ! " + winner.name + " remporte la partie !";
  openPopup();
};

export const alertPayment = function (giver, receiver, amount) {
  // prevent focus actions when process payment
  document.getElementById(giver.pawn.currentCellId).blur();

  alert(giver.name + " verse la somme de " + amount + "$ à " + receiver.name);
};

export const alertTaxCell = function (playerName, cellId, cellName, amount) {
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

export const alertPrison = function (playerName) {
  alert(
    playerName +
      " vous allez en retenu ! Vous êtes débité de 500$ pour pouvoir jouer au prochain tour"
  );

  // prevent focus actions
  document.getElementById(10).blur();
};
