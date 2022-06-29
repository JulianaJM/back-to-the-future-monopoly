module.exports = function Pawn(pawnName) {
  const name = pawnName;
  let currentCellId = 0;
  let resDice = 0;

  Object.defineProperty(this, "name", {
    get: function () {
      return name;
    },
  });

  Object.defineProperty(this, "currentCellId", {
    get: function () {
      return currentCellId;
    },
    set: function (newCurrentCellId) {
      if (typeof newCurrentCellId === "number") {
        currentCellId = newCurrentCellId;
      } else {
        console.log("the pawn currentCellId is not correct");
      }
    },
  });

  Object.defineProperty(this, "resDice", {
    get: function () {
      return resDice;
    },
    set: function (newResDice) {
      if (typeof newResDice === "number") {
        resDice = newResDice;
      } else {
        console.log("the pawn resDice is not correct");
      }
    },
  });
};
