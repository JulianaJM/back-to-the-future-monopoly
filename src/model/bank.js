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

  this.removeHypothec = function(player, title) {
    var amount = title.hypothecValue * 1.1;
    if (player.capital >= parseInt(amount)) {
      player.titleList.forEach(t => {
        if (t.cellId === title.cellId) {
          title.ishypotheced = false;
          return;
        }
      });

      this.removeMoney(player, amount);
    }

    return player;
  };
};
