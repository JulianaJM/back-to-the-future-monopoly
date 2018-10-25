module.exports = function Dice() {
  this.shuffle = function() {
    return Math.floor(Math.random() * 6) + 1;
  };
};
