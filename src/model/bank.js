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
  this.sellTitle = function(player, title, cellPrice) {
    if (player.capital > 0 && player.capital >= cellPrice) {
      this.removeMoney(player, cellPrice);
      player.titleList.push(title);
    }
    return player;
  };
  this.taxeCollection = function(player, amount) {
    this.removeMoney(player, amount);
    this.capital += amount;
  };
};
