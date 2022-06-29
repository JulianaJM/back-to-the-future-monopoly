const Cell = require("./cell");
const extend = require("./utils/extend");

// TaxCell.prototype = Object.create(Cell.prototype);
// TaxCell.prototype.constructor = TaxCell;
extend(TaxCell, Cell);

function TaxCell(name, cellId, cellRent) {
  Cell.call(this, name, cellId); // call the parent contructor with the child context
  let rent = cellRent;

  Object.defineProperty(this, "rent", {
    get: function () {
      return rent;
    },
  });
}

// TaxCell.prototype.isSellable = function () {
//   return false;
// }; this function will be found in the parent prototype no need to redefine since it's the same behavior

module.exports = TaxCell;
