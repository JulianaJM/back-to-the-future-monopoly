const Cell = require("./cell");
const extend = require("./utils/extend");
// TitleCell.prototype = Object.create(Cell.prototype); // inheritance Cell prototype
// TitleCell.prototype.constructor = TitleCell; // target the right constructor function
extend(TitleCell, Cell);

function TitleCell(name, cellId, cellPrice) {
  Cell.call(this, name, cellId); // call the parent contructor with the child context
  let price = cellPrice;
  let playerOwner = null;

  Object.defineProperty(this, "price", {
    get: function () {
      return price;
    },
  });
  Object.defineProperty(this, "playerOwner", {
    get: function () {
      return playerOwner;
    },
    set: function (owner) {
      if (typeof owner === "object" && owner.constructor.name === "Player") {
        playerOwner = owner;
      } else {
        console.log("TitleCell owner is not correct");
      }
    },
  });
}

// polymorphism
TitleCell.prototype.isSellable = function () {
  return this.playerOwner ? false : true;
};
TitleCell.prototype.setPlayerOwner = function (player) {
  return (this.playerOwner = player);
};

Object.defineProperty(TitleCell.prototype, "isSellable", {
  enumerable: false,
  configurable: false,
});
Object.defineProperty(TitleCell.prototype, "setPlayerOwner", {
  enumerable: false,
  configurable: false,
});

module.exports = TitleCell;
