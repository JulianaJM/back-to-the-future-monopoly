export const withdrawMoney = function (bank, amount) {
  bank.capital -= amount;

  return bank;
};

export const receiveMoney = function (bank, amount) {
  bank.capital -= amount;
  return bank;
};

export const removeHypothec = function (bank, player, title) {
  const amount = title.hypothecValue * 1.1;
  if (player.capital >= parseInt(amount)) {
    player.titleList.forEach((t) => {
      if (t.cellId === title.cellId) {
        title.ishypotheced = false;
        return;
      }
    });

    bank = receiveMoney(bank, amount);
  }

  return bank;
};
