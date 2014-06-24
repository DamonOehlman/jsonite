var http = require('http');
var jsonite = require('..');
var api = jsonite();
var server = http.createServer(api.router);

api.provide('author', {
  name: String,
  books: api.many('book')
});

api.provide('book', {
  title: String,
  authors: api.many('author')
});

server.listen(3000);

