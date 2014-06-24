var test = require('tape');
var jsonite = require('../');
var path = require('path');
var http = require('http');
var rimraf = require('rimraf');
var api;
var server;

test('can reset the data storage', function(t) {
  t.plan(1);
  rimraf(path.resolve(__dirname, '..', 'data'), t.ifError);
});

test('can create an api instance', function(t) {
  t.plan(2);
  t.ok(api = jsonite(), 'created');
  t.equal(typeof api.router, 'function');
});

test('can start server routing to the registry', function(t) {
  t.plan(1);
  server = http.createServer(api.router);
  server.listen(3000, function(err) {
    t.ifError(err);
  });
});

test('run subtests', function(t) {
  require('./define-resources')(api, t.test);
});

test('can stop the registry server', function(t) {
  t.plan(1);
  server.close();
  t.pass('stopped');
});
