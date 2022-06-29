module.exports = function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype); // inheritance Parent prototype
  Child.prototype.constructor = Child; // target the right constructor function aka not the parent one
};
