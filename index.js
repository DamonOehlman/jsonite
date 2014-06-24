var debug = require('debug')('jsonite');
var EventEmitter = require('events').EventEmitter;
var levelup = require('levelup');
var bee = require('beeline');

/**
  # jsonite

  This is a [jsonapi](http://jsonapi.org) API server designed for prototyping
  new apis.

  ## Example Usage

  <<< examples/simple.js

**/

module.exports = function(opts) {
  var registry = new EventEmitter();
  var resources = {};
  var router = registry.router = bee.route();

  function defineResource(name, details) {
    debug('defining resource: ' + name, details);
  }

  // associate the helper functions
  registry.resource = defineResource;

  return registry;
};
