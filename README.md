# jsonite

This is a [jsonapi](http://jsonapi.org) API server designed for prototyping
new apis.


[![NPM](https://nodei.co/npm/jsonite.png)](https://nodei.co/npm/jsonite/)

[![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://github.com/dominictarr/stability#experimental) [![Build Status](https://img.shields.io/travis/DamonOehlman/jsonite.svg?branch=master)](https://travis-ci.org/DamonOehlman/jsonite) 

## Example Usage

```js
var http = require('http');
var jsonite = require('jsonite');
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


```

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
