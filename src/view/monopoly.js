function MonopolyView(callback) {
  this.diceButton = document
    .getElementById("diceButton")
    .addEventListener("click", callback, false);
  this.diceDisplay = document.getElementById("dice-box");

  this.pion = document.getElementById("pionMarty");

  this.movePion = function(pos) {
    this.pion.style.display = "block";
  };
}

module.exports = MonopolyView;
