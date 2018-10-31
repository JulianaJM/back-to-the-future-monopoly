var Cell = require("./cell");
TitleCell.prototype = Object.create(Cell.prototype);
TitleCell.prototype.constructor = TitleCell;
function TitleCell(name, cellId) {
  Cell.call(this, name, cellId);
  this.playerOwner = null;
  this.isSellable = function(cell) {
    return cell.playerOwner ? true : false;
  };
}

module.exports = TitleCell;
