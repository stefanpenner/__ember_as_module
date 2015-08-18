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

  describe('extractInfo', function() {
    it('works with nothing found', function() {
      expect(DepRef.extractInfo({})).to.be.null;
    });

    it('works with nothing found', function() {
      var result = {};
      expect(DepRef.extractInfo({
        '1.0.0': result
      })).to.equal(result);
    });

    it('works with splat version (chooses greatest version)', function() {
      var result = {};
      expect(DepRef.extractInfo({
        '0.9.0': 1,
        '1.0.0': 2,
        '1.0.1': result
      }, '*')).to.equal(result);
    });

    it('works with explicit version', function() {
      var result = {};
      expect(DepRef.extractInfo({
        '0.9.0': 1,
        '1.0.0': 2,
        '1.0.1': result
      }, '1.0.1')).to.equal(result);
    });
  });

  describe('getInfo', function() {
    it('works WITHOUT version', function() {
      return new DepRef('@stefanpenner/a').getInfo().then(function(a) {
        expect(a).to.be.a('object');
        expect(a.version).to.eql('1.0.2');
        expect(a.name).to.eql('@stefanpenner/a');
        expect(a.peerDependencies).to.eql({
          '@stefanpenner/b': '^1.0.0'
        });
      });
    });

    it('works WITH version', function() {
      return new DepRef('@stefanpenner/a@1.0.0').getInfo().then(function(a) {
        expect(a).to.be.a('object');

        expect(a).to.be.a('object');
        expect(a.version).to.eql('1.0.0');
        expect(a.name).to.eql('@stefanpenner/a');
        expect(a.peerDependencies).to.eql({
          '@stefanpenner/b': '^1.0.0'
        });
      });
    });

    it('works WITH range version', function() {
      return new DepRef('@stefanpenner/a@^1.0.0').getInfo().then(function(a) {
        expect(a).to.be.a('object');

        expect(a).to.be.a('object');
        expect(a.version).to.eql('1.0.2');
        expect(a.name).to.eql('@stefanpenner/a');
        expect(a.peerDependencies).to.eql({
          '@stefanpenner/b': '^1.0.0'
        });
      });
    });
  });
});
