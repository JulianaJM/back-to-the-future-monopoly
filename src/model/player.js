function Player(playerName, playerId) {
  const id = playerId;
  let capital = 150840;
  const name = playerName;
  let titleList = [];
  let pawn = null;
  let current = false;
  let virtual = false;

  Object.defineProperty(this, "id", {
    get: function () {
      return id;
    },
  });

  Object.defineProperty(this, "name", {
    get: function () {
      return name;
    },
  });

  Object.defineProperty(this, "capital", {
    get: function () {
      return capital;
    },
    set: function (newCapital) {
      if (typeof newCapital === "number") {
        capital = newCapital;
      } else {
        console.log("the player capital is not correct");
      }
    },
  });

  Object.defineProperty(this, "pawn", {
    get: function () {
      return pawn;
    },
    set: function (newPawn) {
      if (typeof newPawn === "object" && newPawn.constructor.name === "Pawn") {
        pawn = newPawn;
      } else {
        console.log(`the player pawn (${name}) is not correct`);
      }
    },
  });

  Object.defineProperty(this, "titleList", {
    get: function () {
      return titleList;
    },
    set: function (newTitleList) {
      if (
        typeof newTitleList === "object"
        // typeof Object.getPrototypeOf(newTitleList).constructor.name === "Array"
      ) {
        titleList = newTitleList;
      } else {
        throw new Error("the title list is not correct");
      }
    },
  });

  Object.defineProperty(this, "current", {
    get: function () {
      return current;
    },
    set: function (isCurrent) {
      if (typeof isCurrent === "boolean") {
        current = isCurrent;
      } else {
        console.log("Wrong value for current set current player");
      }
    },
  });

  Object.defineProperty(this, "virtual", {
    get: function () {
      return virtual;
    },
    set: function (newVirtualState) {
      if (typeof newCapnewVirtualStateital === "boolean") {
        virtual = newVirtualState;
      } else {
        console.log("the player virtual state is not correct");
      }
    },
  });
}

Player.prototype.payRent = function (playerToPay, amount) {
  this.capital -= amount;
  playerToPay.capital += amount;

  return playerToPay;
};

Object.defineProperty(Player.prototype, "payRent", {
  enumerable: false,
  configurable: false,
});

module.exports = Player;
