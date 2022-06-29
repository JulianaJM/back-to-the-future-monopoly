module.exports = function Title(
  id,
  cellName,
  cellColor,
  cellRent,
  cellHypothecValue
) {
  let cellId = id;
  let name = cellName;
  let color = cellColor;
  let rent = cellRent;
  let hypothecValue = cellHypothecValue;
  let ishypotheced = false;

  Object.defineProperty(this, "cellId", {
    get: function () {
      return cellId;
    },
  });

  Object.defineProperty(this, "name", {
    get: function () {
      return name;
    },
  });
  Object.defineProperty(this, "color", {
    get: function () {
      return color;
    },
  });
  Object.defineProperty(this, "rent", {
    get: function () {
      return rent;
    },
  });
  Object.defineProperty(this, "hypothecValue", {
    get: function () {
      return hypothecValue;
    },
  });
  Object.defineProperty(this, "ishypotheced", {
    get: function () {
      return ishypotheced;
    },
    set: function (isCellHypotheced) {
      if (typeof isCellHypotheced === "boolean") {
        ishypotheced = isCellHypotheced;
      } else {
        console.log("wrong value for hypothec state");
      }
    },
  });
};
