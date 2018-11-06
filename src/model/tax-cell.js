var Cell = require("./cell");
TaxCell.prototype = Object.create(Cell.prototype);
TaxCell.prototype.constructor = TaxCell;
function TaxCell(name, cellId, rent) {
  Cell.call(this, name, cellId);
  this.rent = rent;
  this.isSellable = function() {
    return false;
  };
}

module.exports = TaxCell;
