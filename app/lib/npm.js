var RSVP = require('rsvp');
var npm = require('npm');
var load = RSVP.denodeify(npm.load);
var info = RSVP.denodeify(npm.info);

module.exports.load = load;

