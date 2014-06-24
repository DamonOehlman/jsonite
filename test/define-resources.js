var Joi = require('joi');

module.exports = function(api, test) {
  test('define a resource', function(t) {
    t.plan(2);

    var schema = api.provide('author', {
      name: api.types.string().required(),
      age: api.types.number().integer().required()
    });

    // validating an incorrect object fails
    Joi.validate({ name: 'Fred' }, schema, function(err, value) {
      t.ok(err, 'captured validation error');
    });

    Joi.validate({ name: 'Fred', age: 50 }, schema, function(err, value) {
      t.ifError(err, 'validation ok');
    });
  });
};
