'use strict';

var get = require('./get');

module.exports = function info(name) {
  var uri = ('https://registry.npmjs.org/' + encodeURIComponent(name)).replace('%40', '@');
  return get(uri).then(JSON.parse);
};
