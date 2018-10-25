var titles = require("../utils/titles");
module.exports = function Bank() {
  this.capital = 40000000;
  this.titleList = titles;
  this.addMoney = function(player, amount) {
    this.capital -= amount;
    player.capital += amount;
  };
  this.removeMoney = function(player, amount) {
    this.capital -= amount;
    player.capital -= amount;
  };
  this.sellTitle = function(player, title) {
    this.removeMoney(player, title.rent);
    player.titleList.push(title);
    title.titleCase.player = player;
  };
  this.taxeCollection = function(player, amount) {
    this.removeMoney(player, amount);
    this.capital += amount;
  };
};
