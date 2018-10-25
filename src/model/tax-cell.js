var Cell = require("./cell");
TaxCell.prototype = Object.create(Cell.prototype);
TaxCell.prototype.constructor = TaxCell;
function TaxCell(name, rent, cellId) {
  Cell.call(this, name, cellId);
  this.rent = rent;
}

module.exports = TaxCell;
