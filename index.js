var debug = require('debug')('jsonite');
var levelup = require('levelup');
var bee = require('beeline');
var Joi = require('joi');

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
}

module.exports = API;
var prot = API.prototype;

/**
  ### API#provide(model, schema)

  Register a new model in the API.

**/
prot.provide = function(model, schema) {
  if (! schema) {
    return;
  }

  return this.models[model] = Joi.object().keys(schema);
};
