var Joi = require('joi');

module.exports = function(api, test) {
  test('define a person', function(t) {
    t.plan(2);

    var schema = api.provide('person', {
      name: api.types.string().required()
    });

    // validating an incorrect object fails
    Joi.validate({}, schema, function(err, value) {
      t.ok(err, 'captured validation error');
    });

    Joi.validate({ name: 'Dave Lister' }, schema, function(err, value) {
      t.ifError(err, 'validation ok');
    });
  });

  test('define a post', function(t) {
    t.plan(2);

    var schema = api.provide('post', {
      title: api.types.string().required()
    });

    // validating an incorrect object fails
    Joi.validate({}, schema, function(err, value) {
      t.ok(err, 'captured validation error');
    });

    Joi.validate({ title: 'A test title' }, schema, function(err, value) {
      t.ifError(err, 'validation ok');
    });
  });
};
