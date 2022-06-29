const titles = require("../utils/titles");

const BANK_INITIAL_CAPITAL = 40000000;

function Bank() {
  let capital = BANK_INITIAL_CAPITAL;
  let titleList = titles;

  Object.defineProperty(this, "capital", {
    // define a getter keeping property synthax eg bank.captital whereas define a function and do bank.getCapital(), bank.capital will invoke the getter implicitely
    get: function () {
      return capital;
    },
    set: function (newCapital) {
      if (typeof newCapital === "number") {
        capital = newCapital;
      } else {
        console.log("the bank capital is not correct");
      }
    },
  });

  Object.defineProperty(this, "titleList", {
    get: function () {
      return titleList;
    },
  });
}

module.exports = Bank;
