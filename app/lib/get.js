'use strict';

var http = require('https');
var RSVP = require('rsvp');

module.exports = function get(uri) {
  return new RSVP.Promise(function(resolve, reject)  {

    http.get(uri, function(res) {
      var payload = '';

      res.on('data', function(data) {
        payload += data;
      });

      res.on('error', reject);

      res.on('end', function() {
        resolve(payload);
      });
    })
  });
};
