'use strict';

var depName  = process.argv[2];
var PleasantProgress = require('pleasant-progress');
var RSVP = require('rsvp');
var npm = require('npm');
var load = RSVP.denodeify(npm.load);

var progress = new PleasantProgress();
progress.start('loading');

var info = RSVP.denodeify(npm.info);

load().then(function() {
  var deps = {};

  return new Dep(depName).peerDependencies();
}).catch(function(e) {
  console.log('OMG');
  console.error(e);
  console.error(e.stack);
}).then(function(deps) {
  debugger;
  progress.stop();
  process.exit();
});

