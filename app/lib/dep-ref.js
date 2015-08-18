'use strict';
var RSVP = require('rsvp');
var parseModuleName = require('./parse-module-name');
var semver = require('semver');
var info = require('./info');
module.exports = DepRef;

function DepRef(name) {
  var mod = parseModuleName(name);

  this.name = mod.name;
  this.version = mod.version || '*';
  this.info = undefined;
  this.data = undefined;
  this.versions = undefined;
}

DepRef.prototype.peerDependencies = function() {
  return this.getInfo().then(function(dep) {
    return dep.peerDependencies;
  });
};

module.exports.extractInfo = extractInfo;;
function extractInfo(raw, version) {
  var versions = Object.keys(raw).sort(semver.compare).reverse();

  if (versions.length === 0) { return null; }
  if (versions.length > 1 && !version) {
    throw new Error('strange, more versions then expected where found');
  }

  var versionKey;
  if (version && version !== '*') {
    versionKey = version;
  } else {
    versionKey = versions[0];
  }

  return raw[semver.maxSatisfying(versions, versionKey)];
}

DepRef.prototype.getInfo = function() {
  if (this.info) { return RSVP.Promise.resolve(this.info); }

  var dep = this;
  var name;

  return info(this.name).then(function(_info) {
    var info = extractInfo(_info.versions, dep.version);
    if (!info) {
      throw new Error('unknown version: ' + name);
    }

    dep.info = info;
    return info;
  });
};

