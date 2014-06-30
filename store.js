var debug = require('debug')('jsonite:store');
var levelup = require('levelup');
var sublevel = require('level-sublevel');
var path = require('path');
var extend = require('xtend');
var uuid = require('uuid');

module.exports = function(opts) {
  var defaultdb = path.resolve((opts || {}).cwd || process.cwd(), 'jsonite-data');
  var db = sublevel(levelup((opts || {}).db || defaultdb));
  var stores = {};

  function substore(type) {
    if (! stores[type]) {
      stores[type] = db.sublevel(type, { valueEncoding: 'json' });
    }

    return stores[type];
  }

  db.create = function(type, data, callback) {
    debug('attempting to create new ' + type);
    data = extend({ id: uuid.v4() }, data);
    substore(type).put(data.id, data, function(err) {
      callback(err, data);
    });
  };

  db.getItem = function(type, id, callback) {
    function getItem(id, callback) {
      substore(type).get(id, callback);
    }

    return id ? getItem(id, callback) : getItem;
  };

  return db;
};
