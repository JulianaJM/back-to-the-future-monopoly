export const receiveMoney = function (player, amount) {
  player.capital += amount;
  return player;
};

export const withdrawMoney = function (player, amount) {
  player.capital -= amount;
  return player;
};

export const buyTitle = function (player, title, cellPrice) {
  if (player.capital > 0 && player.capital >= cellPrice) {
    player = withdrawMoney(player, cellPrice);
    player.titleList.push(title);
  }
  return player;
};
