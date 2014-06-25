var debug = require('debug')('jsonite:store');
var levelup = require('levelup');
var sublevel = require('level-sublevel');
var mapped = require('level-mapped-index');
var path = require('path');
var extend = require('xtend');

module.exports = function(opts) {
  var defaultdb = path.resolve((opts || {}).cwd || process.cwd(), 'jsonite-data');
  var db = sublevel(levelup((opts || {}).db || defaultdb));
  var counters = db.sublevel('_counters');

  function nextId(type, callback) {
    counters.get(type, function(err, value) {
      value = (parseInt(value, 10) || 0) + 1;

      counters.put(type, value, function(err) {
        callback(err, value);
      });
    });
  }

  function substore(type) {
    return db.sublevel(type, { valueEncoding: 'json' });
  }

  db.create = function(type, data, callback) {
    nextId(type, function(err, id) {
      if (err) {
        return callback(err);
      }

      // inject the id into the data
      data = extend({}, data, { id: id });
      substore(type).put(id, data, function(err) {
        callback(err, data);
      });
    });
  };

  return db;
};
