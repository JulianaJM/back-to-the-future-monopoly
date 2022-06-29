function Cell(cellName, cellIdVal) {
  const name = cellName;
  const cellId = cellIdVal;

  Object.defineProperty(this, "name", {
    get: function () {
      return name;
    },
  });

  Object.defineProperty(this, "cellId", {
    get: function () {
      return cellId;
    },
  });
}

Cell.prototype.isSellable = function () {
  return false;
};

Object.defineProperty(Cell.prototype, "isSellable", {
  enumerable: false,
  configurable: false,
});

module.exports = Cell;
