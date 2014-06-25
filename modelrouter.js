var Joi = require('joi');
var concat = require('concat-stream');

var mime = {
  json: 'application/json',
  jsonapi: 'application/vnd.api+json',
  jsonpatch: 'application/json-patch+json'
};

var responseErrors = {
  invalidContentType: [ 412, 'Invalid request content type' ]
};

var methodTypes = {
  POST: [ mime.json, mime.jsonapi ],
  PUT: [ mime.json, mime.jsonapi ],
  PATCH: [ mime.jsonpatch ]
};

function abort(res, err) {
  var data = responseErrors[err.message] || [ 500, err.message ];

  res.writeHead(data[0], {
    'Content-Type': mime.json
  });
  res.end(data[1] || 'An unknown error has occurred');
}

function ok(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': mime.json
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
  var routes = {};

  function cap(callback) {
    return function(req, res) {
      var precheckFailure = checkContentType(req);

      debug(req.method + ' precheck failure: ', precheckFailure);
      if (precheckFailure) {
        return abort(res, precheckFailure);
      }

      req.pipe(concat(function(data) {
        try {
          data = JSON.parse(data.toString());
        }
        catch (e) {
          return abort(res, e);
        }

        callback(data, req, res);
      }));
    };
  }

  // initialise the routes
  routes['/' + name] = {
    'GET': function(req, res) {
    },

    'POST': cap(function(data, req, res) {
      Joi.validate(data, schema, { abortEarly: false }, function(err, value) {
        if (err) {
          return abort(res, err);
        }

        store.create(name, data, function(err, output) {
          if (err) {
            return abort(res, err);
          }

          ok(res, 201, output);
        });
      });
    })
  };

  return routes;
};
