var async = require('async');
var Joi = require('joi');
var concat = require('concat-stream');
var inflect = require('i')();

var mime = {
  json: 'application/json',
  jsonapi: 'application/vnd.api+json',
  jsonpatch: 'application/json-patch+json'
};

var responseErrors = {
  noItems: [ 412, 'No items found in body' ],
  invalidContentType: [ 412, 'Invalid request content type' ]
};

var methodTypes = {
  POST: [ mime.jsonapi ],
  PUT: [ mime.jsonapi ],
  PATCH: [ mime.jsonpatch ]
};

function abort(res, err) {
  var data = responseErrors[err.message] || [ 500, err.message ];

  res.writeHead(data[0], {
    'Content-Type': mime.jsonapi
  });
  res.end(data[1] || 'An unknown error has occurred');
}

function ok(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': mime.jsonapi
  });
  res.end(JSON.stringify(body));
}

function checkContentType(req) {
  var contentType = req.headers['content-type'];

  if ((methodTypes[req.method] || []).indexOf(contentType) < 0) {
    return new Error('invalidContentType');
  }
}

module.exports = function(name, schema, store) {
  var debug = require('debug')('jsonite:model:' + name);
  var key = inflect.pluralize(name);
  var routes = {};

  function cap(callback) {
    return function(req, res) {
      var precheckFailure = checkContentType(req);

      if (precheckFailure) {
        debug(req.method + ' precheck failure: ', precheckFailure);
        return abort(res, precheckFailure);
      }

      req.pipe(concat(function(data) {
        try {
          debug('sending data: ', data.toString());
          data = JSON.parse(data.toString());
        }
        catch (e) {
          return abort(res, e);
        }

        callback(data, req, res);
      }));
    };
  }

  function sendItems(res, statusCode) {
    return function(err, items) {
      var output = {};

      if (err) {
        return abort(res, err);
      }

      output[key] = items;
      debug(statusCode + ': sending output ', output);
      ok(res, statusCode, output);
    };
  }

  function validateAndSave(data, callback) {
    Joi.validate(data, schema, { abortEarly: false }, function(err, value) {
      if (err) {
        return callback(err);
      }

      store.create(name, data, callback);
    });
  }

  routes['/' + key + '/`ids`'] = {
    'GET': function(req, res, params) {
      var ids = (params.ids || '').split(',');

      debug('received get request', ids);
      async.map(ids, store.getItem(name), sendItems(res, 200));
    }
  };

  routes['/' + key] = {
    'POST': cap(function(data, req, res) {
      var items = data[key];
      if (! Array.isArray(items)) {
        return abort(res, new Error('noItems'));
      }

      async.map(items, validateAndSave, sendItems(res, 201));
    })
  };

  return routes;
};
