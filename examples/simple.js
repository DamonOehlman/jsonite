var http = require('http');
var jsonite = require('..');
var api = jsonite();
var server = http.createServer(api.router);

api.provide('author', {
  name: api.types.string().required(),
  books: api.ref('*book')
});

api.provide('book', {
  title: api.types.string().required(),
  authors: api.ref('*author')
});

server.listen(3000);

