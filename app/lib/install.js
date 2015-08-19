'use strict';
var RSVP = require('rsvp');

module.exports = function install(packages) {
  var npm = require('npm');
  var load = RSVP.denodeify(npm.load);


  return load({
    loglevel: 'error',
    //logstream: require('through'),
    color: 'always',
    // by default, do install peoples optional deps
    'optional': false,
    'save-dev': true,
    'save-exact': true
  }).then(function() {
    var install = RSVP.denodeify(npm.commands.install);
    return install(packages);
  });
};
