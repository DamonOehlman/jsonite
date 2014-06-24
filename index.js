var debug = require('debug')('jsonite');
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

  function defineResource(name, details) {
    debug('defining resource: ' + name, details);
  }

  // create the router
  register.router = bee.route();

  // associate the helper functions
  registry.resource = defineResource;

  return registry;
};
