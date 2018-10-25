var Cell = require("./cell");
TitleCell.prototype = Object.create(Cell.prototype);
TitleCell.prototype.constructor = TitleCell;
function TitleCell(name, cellId) {
  Cell.call(this, name, cellId);
  this.playerOwner = null;
  this.setPlayerOwner = function(owner) {
    this.playerOwner = owner;
    owner.titleList.push(this.title);
  };
}

module.exports = TitleCell;
