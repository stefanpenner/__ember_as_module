'use strict';
module.exports = Dep;

function Dep(name, pkg) {
  this.name = name;
  this.pkg = pkg;
}
