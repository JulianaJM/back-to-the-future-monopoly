module.exports = function Title(cellId, name, color, rent, hypothecValue) {
  this.cellId = cellId;
  this.name = name;
  this.color = color;
  this.rent = rent;
  this.hypothecValue = hypothecValue;
  this.ishypotheced = false;
};
