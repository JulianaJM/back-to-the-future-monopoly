var Cell = require("./cell");
TitleCell.prototype = Object.create(Cell.prototype);
TitleCell.prototype.constructor = TitleCell;
function TitleCell(name, cellId, price) {
  Cell.call(this, name, cellId);
  this.price = price;
  this.playerOwner = null;
  this.isSellable = function() {
    return this.playerOwner ? false : true;
  };

  this.setPlayerOwner = function(player) {
    return (this.playerOwner = player);
  };
}

module.exports = TitleCell;
