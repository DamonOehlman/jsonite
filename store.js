var debug = require('debug')('jsonite:store');
var levelup = require('levelup');
var sublevel = require('level-sublevel');
var path = require('path');
var extend = require('xtend');
var uuid = require('uuid');

module.exports = function(opts) {
  var defaultdb = path.resolve((opts || {}).cwd || process.cwd(), 'jsonite-data');
  var db = sublevel(levelup((opts || {}).db || defaultdb));
  var counters = db.sublevel('_counters');

  function substore(type) {
    return db.sublevel(type, { valueEncoding: 'json' });
  }

  db.create = function(type, data, callback) {
    debug('attempting to create new ' + type);
    data = extend({ id: uuid.v4() }, data);
    substore(type).put(id, data, function(err) {
      callback(err, data);
    });
  };

  db.get = function(type, id, callback) {
    substore(type).get(id, callback);
  };

  return db;
};
