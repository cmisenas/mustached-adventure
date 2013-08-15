var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring');

var Mustache = require('./mustache').Mustache,
    Storage = require("../js/storage").Storage,
    Shortener = require("../js/shortener").Shortener;

var storage = new Storage('redis'),
    shortener = new Shortener();

var mustache = new Mustache(shortener, storage);
var COOKIE_PREFIX = '_MYSTASH_';

var serveStaticFile = function(filename, type, res) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (data) {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    } else {
      res.writeHead(400);
      res.end('404 Not Found');
    }
  });
};


var startServer = function() {
  var PORT = 8000;
  var app = http.createServer(function(req, res){
    if (req.method === 'POST') {
      handlePost(req, res);
    } else if (req.method === 'GET'){
      handleGet(req, res);
    }
  }).listen(PORT);
  console.log("Server started on port", PORT);
  return app;
};

var handlePost = function(req, res){
  var body = '';
  req.on('data', function(data){
    body += data.toString();
  });
  req.on('end', function(){
    var url = qs.parse(body).url;
    mustache.set(url, function(err, hashedUrl){
      if (err) {
        res.writeHead(200); //TODO: Make sure this is right
        res.end(JSON.stringify({error: 'There was an error in parsing the url'}));
      }
      if (hashedUrl) {
        res.writeHead(200);
        res.end(JSON.stringify({hashedUrl: hashedUrl}));
      }
    });
  });
};

var handleGet = function(req, res){
  var pathname = url.parse(req.url).pathname.substring(1);
  if (pathname == '') {
    serveStaticFile('index.html', 'text/html', res);
  } else {
    var type = pathname.indexOf('.js') > -1 ? 'text/javascript' 
      : pathname.indexOf('.html') > -1 ? 'text/html' 
      : pathname.indexOf('.css') > -1 ? 'text/css'
      : pathname.indexOf('.svg') > -1 ? 'image/svg+xml'
      : false;
    if (type){
      serveStaticFile(pathname, type, res);
    } else {

      if (pathname.indexOf('.') === -1) {
        var index;
        if (req.headers.cookie) {
          index = extractCookie(req.headers.cookie, COOKIE_PREFIX + pathname);
          index = parseInt(index, 10);
          index = (index !== index) ? 0 : index;
        } else {
          index = 0;
        }
        mustache.get(pathname, function(err, redirectUrl){
          if (redirectUrl) {
            res.writeHead(302, {
              'Set-Cookie': COOKIE_PREFIX + pathname + '=' + (index + 1),
              'Location': redirectUrl
            });
            res.end();
          } else {
            res.writeHead(404);
            res.end('Invalid Url');
          }
        });
      } else {
        res.writeHead(200);
        res.end();
      }

    }
  }
};

var extractCookie = function(cookies, name){
  var start = cookies.indexOf(name);
  var end = cookies.indexOf(';', start);
  end = end === -1 ? cookies.length : end;
  return cookies.substring(start, end).split('=')[1];
};

module.exports.extractCookie = extractCookie;

startServer();
