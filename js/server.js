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

/**
 * Writes static file contents to head. If file does not exists, function serves error
 * @param {string} filename - file to serve
 * @param {string} type - type of file to serve
 * @param {http.ServerResponse} response - response object generated from request
 */
var serveStaticFile = function(filename, type, response) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (data) {
      response.writeHead(200, { 'Content-Type': type });
      response.end(data);
    } else {
      serveErrorPage(response);
    }
  });
};

/**
 * Serves default error page. If default error page is not found, writes file not found
 * @param {http.ServerResponse} response
 */
var serveErrorPage = function(response) {
  fs.readFile('error.html', 'utf8', function (err, data){
    response.writeHead(404);
    if (err) {
      response.end('File Not Found!');
    } else {
      response.end(data);
    }
  });
}

var startServer = function() {
  var PORT = 80;
  var app = makeApp();
  app.listen(PORT);
  console.log("Server started on port", PORT);
  return app;
};

var makeApp = function () {
  return http.createServer( function (req, res){
    if (req.method === 'POST') {
      handlePost(req, res);
    } else if (req.method === 'GET'){
      handleGet(req, res);
    }
  });
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
        res.end(JSON.stringify({error: 'There was an error in parsing the url\n' + err}));
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
    var type = getFileType(pathname);
    if (type){
      serveStaticFile(pathname, type, res);
    } else {
      if (pathname.indexOf('.') === -1) {
        handleRedirect(req.headers, pathname, res);
      } else {
        res.writeHead(200);
        res.end();
      }
    }
  }
};

var handleRedirect = function(headers, hashUrl, res) {
  var index = 0;
  if (headers.cookie) {
    index = parseInt(extractCookie(headers.cookie, COOKIE_PREFIX + hashUrl), 10) || 0;
  }
  mustache.get(hashUrl, index, function(err, redirectUrl, newIndex){
    if (redirectUrl && redirectUrl.length > 0) {
      res.writeHead(302, {
        'Set-Cookie': COOKIE_PREFIX + hashUrl + '=' + newIndex,
        'Location': redirectUrl
      });
      res.end();
    } else {
      serveErrorPage(res);
    }
  });
};

var getFileType = function(fileName) {
  return fileName.indexOf('.js') > -1 ? 'text/javascript' 
    : fileName.indexOf('.html') > -1 ? 'text/html' 
    : fileName.indexOf('.css') > -1 ? 'text/css'
    : fileName.indexOf('.svg') > -1 ? 'image/svg+xml'
    : false;
};

var extractCookie = function(cookies, name){
  var start = cookies.indexOf(name);
  var end = cookies.indexOf(';', start);
  end = end === -1 ? cookies.length : end;
  return cookies.substring(start, end).split('=')[1];
};

module.exports.serveStaticFile = serveStaticFile;
module.exports.serveErrorPage = serveErrorPage;
module.exports.startServer = startServer;
module.exports.handlePost = handlePost;
module.exports.handleGet = handleGet;
module.exports.handleRedirect = handleRedirect;
module.exports.getFileType = getFileType;
module.exports.extractCookie = extractCookie;

startServer();
