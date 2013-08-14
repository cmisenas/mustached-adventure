var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring');

var mustache = require('./mustache').mustache,
    Storage = require("../js/storage").Storage,
    Shortener = require("../js/shortener").Shortener;

var storage = new Storage('redis'),
    shortener = new Shortener();

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
      var body = '';
      req.on('data', function(data){
        body += data.toString();
      });
      req.on('end', function(){
        var url = qs.parse(body).url;
        mustache(url, shortener, storage, function(err, hashedUrl){
          if (err) {
            res.writeHead(200); //TODO: Make sure this is right
            res.end('Error!');
          }
          if (hashedUrl) {
            res.writeHead(200);
            res.end(hashedUrl);
          }
        });
      });
    } else {
      var pathname = url.parse(req.url).pathname;
      if (pathname == '/') {
        serveStaticFile('index.html', 'text/html', res);
        //queries should be handled here for when users send hashed urls
        //how are we going to check for that?
      } else {
        var type = pathname.indexOf('.js') > -1 ? 'text/javascript' : pathname.indexOf('.html') > -1 ? 'text/html' : 'text/css' ;
        serveStaticFile(pathname.substring(1), type, res);
      }
    }
  }).listen(PORT);

  console.log("Server started on port", PORT);
  return app;
};
startServer();
