module.exports = function Player(name, id) {
  this.id = id;
  this.capital = 150840;
  this.name = name;
  this.titleList = [];
  this.pawn = null;
  this.current = false;
  this.virtual = false;

  this.payRent = function(playerToPay, amount) {
    this.capital -= amount;
    playerToPay.capital += amount;

    return playerToPay;
  };
};
