module.exports = function(name, model, store) {
  var debug = require('debug')('jsonite:model:' + name);
  var routes = {};

  // initialise the routes
  routes['/' + name] = {
    'GET': function(req, res) {
    },

    'POST': function(req, res) {
      debug('POST');
    }
  };

  return routes;
};
