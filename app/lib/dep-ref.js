'use strict';
var RSVP = require('rsvp');
var parseModuleName = require('./parse-module-name');
module.exports = DepRef;

function DepRef(info, name) {
  var mod = parseModuleName(name);

  this.name = mod.name;
  this.version = mod.version || '*';
  this._info = info;
  this.info = undefined;
  this.data = undefined;
  this.versions = undefined;
}

DepRef.prototype.peerDependencies = function() {
  return this.getInfo(this.name).then(function(dep) {
    // get latest version...
    return dep[Object.keys(dep)[0]].peerDependencies;
  });
};

DepRef.prototype.getInfo = function() {
  if (this.info) { return RSVP.Promise.resolve(this.info); }

  var dep = this;

  return this._info(this.name).then(function(info) {
    dep.info = info;
    return info;
  });
};

