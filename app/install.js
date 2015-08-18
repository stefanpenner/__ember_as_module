'use strict';

var depName  = process.argv[2];
var PleasantProgress = require('pleasant-progress');
var RSVP = require('rsvp');
var DepRef = require('./lib/dep-ref');
var progress = new PleasantProgress();
var info = require('./lib/info');

progress.start('loading');

var deps = {};

new DepRef(depName).peerDependencies().then(function(data) {
  deps[depName] = data;

  var res = Object.keys(data).map(function(name) {
    return new DepRef(name + '@' + data[name]).peerDependencies().then(function(peers) {
      Object.keys(peers || {}).forEach(function(peer) {
        deps[peer.name + '@' + peer.version] = peer;
      });
    });
  });

  return RSVP.Promise.all(res);
}).finally(function() {
  progress.stop();
}).then(function() {
  console.log(deps);
}).catch(function(e) {
  console.log('OMG FAILURE');
  console.error(e.message);
  console.error(e.stack);
});

