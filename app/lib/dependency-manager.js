'use strict';

var RSVP = require('rsvp');
var DepRef = require('./dep-ref');

module.exports = DependencyManager;

function DependencyManager() {
  this.deps = {};
}

DependencyManager.prototype.findPeerDependencies = function(depName) {
  var manager = this;
  var deps = this.deps;

  return new DepRef(depName).peerDependencies().then(function(data) {
    if (deps[depName]) {
      throw new Error('something went wrong, should not re-encounter the same dep: ' + depName);
    }

    deps[depName] = data;
    if (!data) { return; }

    var res = Object.keys(data).map(function(name) {
      var depName = name + '@' + data[name];

      return new DepRef(depName).peerDependencies().then(function(peers) {
        deps[depName] = {};

        var moreWork = Object.keys(peers || {}).map(function(peer) {
          deps[depName][peer] = peers[peer];

          // TODO: new Dep()....
          var nameAndDep = peer + '@' + peers[peer];
          if (deps[nameAndDep]) { return; }

          return manager.findPeerDependencies(nameAndDep);
        });

        return RSVP.Promise.all(moreWork);
      });
    });

    return RSVP.Promise.all(res);
  });
};
