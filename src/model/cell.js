function Cell(name, cellId) {
  this.name = name;
  this.cellId = cellId;
}

Cell.prototype.isSellable = function() {
  return false;
};

module.exports = Cell;
