module.exports = function Cell(name, cellId) {
  this.name = name;
  this.cellId = cellId;
  this.isSellable = function(cell) {
    return false;
  };
};
