var debug = require('debug')('jsonite');
var bee = require('beeline');
var Joi = require('joi');
var store = require('./store');

/**
  # jsonite

  This is a [jsonapi](http://jsonapi.org) API server designed for prototyping
  new apis.

  ## Example Usage

  <<< examples/simple.js

  ## Prior Art

  The following are other systems that provide similar functionality to jsonite:

  - [fortune](https://github.com/daliwali/fortune)

  ## References

  ### jsonite(opts) => API

  Create a new `API` object that we are able to initialize.

**/

function API(opts) {
  if (! (this instanceof API)) {
    return new API(opts);
  }

  // use joi to assert types
  this.types = Joi;

  // create the router
  this.router = bee.route();

  // initialise the model definitions
  this.models = {};

  // initialise the store
  this.store = store(opts);
}

module.exports = API;
var prot = API.prototype;

/**
  ### API#provide(name, schema)

  Register a new model in the API.

**/
prot.provide = function(name, schema) {
  var model;
  if (! schema) {
    return;
  }

  // create the model
  model = this.models[name] = Joi.object().keys(schema);

  // create the handlers for the route
  return model;
};
