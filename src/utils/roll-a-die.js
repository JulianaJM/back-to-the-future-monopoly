var rollADie = require("roll-a-die");
var rollDice = function(element) {
  var res = 0;
  rollADie({
    element,
    numberOfDice: 2,
    callback: function(response) {
      res = response[0] + response[1];
    }
  });
  return res;
};

module.exports = rollDice;
