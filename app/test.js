'use strict';

var expect = require('chai').expect;
var RSVP = require('rsvp');
var npm  = require('npm');
var info = RSVP.denodeify(npm.info);
var load = RSVP.denodeify(npm.load);

var DepRef = require('./lib/dep-ref');

var parseModuleName = require('./lib/parse-module-name');

describe('parse-module-name', function() {
  it('parses regular name', function() {
    expect(parseModuleName('rsvp')).to.eql({
      name: 'rsvp',
      version: null
    });
  });

  it('parses \w version', function() {
    expect(parseModuleName('rsvp@3.0.17')).to.eql({
      name: 'rsvp',
      version: '3.0.17'
    });
  });

  it('parses \w version & scoped', function() {
    expect(parseModuleName('@tilde/rsvp@3.0.17')).to.eql({
      name: '@tilde/rsvp',
      version: '3.0.17'
    });
  });

});

describe('DepRef', function() {
  before(function() {
    return load();
  });


  it('exists', function() {
    return new DepRef(info, '@stefanpenner/a').getInfo().then(function(a) {
      expect(a).to.be.a('object');
      expect(a['1.0.2']).to.be.a('object');
      expect(a['1.0.2'].name).to.eql('@stefanpenner/a');
      expect(a['1.0.2'].peerDependencies).to.eql({
        '@stefanpenner/b': '^1.0.0'
      });
      console.log(a);
    });
  });
});
