var test = require('tape');
var jsonite = require('../');
var path = require('path');
var http = require('http');
var rimraf = require('rimraf');
var registry;
var server;

test('can reset the data storage', function(t) {
  t.plan(1);
  rimraf(path.resolve(__dirname, '..', 'data'), t.ifError);
});

test('can create a registry instance', function(t) {
  t.plan(2);
  t.ok(registry = jsonite(), 'created');
  t.equal(typeof registry.router, 'function');
});

test('can start server routing to the registry', function(t) {
  t.plan(1);
  server = http.createServer(registry.router);
  server.listen(3000, function(err) {
    t.ifError(err);
  });
});

// test('run subtests', function(t) {
//   require('./deploy')(registry, t.test);
//   require('./get')(registry, t.test);
//   require('./range')(registry, t.test);
//   require('./changes')(registry, t.test);
// });

test('can stop the registry server', function(t) {
  t.plan(1);
  server.close();
  t.pass('stopped');
});
