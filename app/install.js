'use strict';

var depName  = process.argv[2];
var PleasantProgress = require('pleasant-progress');
var DependencyManager = require('./lib/dependency-manager');
var progress = new PleasantProgress();

if (!depName) { throw TypeError("usage: install <name>"); }

progress.start('loading');
var manager = new DependencyManager();

manager.findPeerDependencies(depName).
  finally(function() {
    progress.stop();
  }).then(function() {
    console.log(Object.keys(manager.deps));
  }).catch(function(e) {
    console.log('OMG FAILURE');
    console.error(e.message);
    console.error(e.stack);
  });

