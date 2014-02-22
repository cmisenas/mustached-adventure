(function() {
  var COOKIE_PREFIX, Mustache, PORT, Shortener, Storage, config, extractCookie, fs, getFileType, handleGet, handlePost, handleRedirect, http, makeApp, mustache, qs, serveErrorPage, serveStaticFile, shortener, startServer, storage, url;

  config = require('../config');

  http = require('http');

  fs = require('fs');

  url = require('url');

  qs = require('querystring');

  Mustache = require('./mustache').Mustache;

  Storage = require("../bin/storage").Storage;

  Shortener = require("../bin/shortener").Shortener;

  storage = new Storage('redis');

  shortener = new Shortener();

  mustache = new Mustache(shortener, storage);

  COOKIE_PREFIX = '_MYSTASH_';

  PORT = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 8000 : 80;

  serveStaticFile = function(filename, type, response) {
    return fs.readFile(filename, 'utf8', function(error, data) {
      if (data) {
        response.writeHead(200, {
          'Content-Type': type
        });
        return response.end(data);
      } else {
        return serveErrorPage(response);
      }
    });
  };

  serveErrorPage = function(response) {
    return fs.readFile('error.html', 'utf8', function(error, data) {
      response.writeHead(404);
      if (error) {
        return response.end('File Not Found!');
      } else {
        return response.end(data);
      }
    });
  };

  startServer = function() {
    var app;
    app = makeApp();
    app.listen(PORT);
    console.log("Server started on port " + PORT);
    return app;
  };

  makeApp = function() {
    return http.createServer(function(request, response) {
      if (request.method === 'POST') {
        return handlePost(request, response);
      } else if (request.method === 'GET') {
        return handleGet(request, response);
      }
    });
  };

  handlePost = function(request, response) {
    var body;
    body = '';
    request.on('data', function(data) {
      return body += data.toString();
    });
    return request.on('end', function() {
      url = qs.parse(body).url;
      return mustache.set(url, function(error, hashedUrl) {
        if (error) {
          response.writeHead(200);
          response.end(JSON.stringify({
            error: "There was an error in parsing the url\n" + error
          }));
        }
        if (hashedUrl) {
          response.writeHead(200);
          return response.end(JSON.stringify({
            hashedUrl: hashedUrl
          }));
        }
      });
    });
  };

  handleGet = function(request, response) {
    var pathname, type;
    pathname = url.parse(request.url).pathname.substring(1);
    if (pathname === '') {
      return serveStaticFile('index.html', 'text/html', response);
    } else {
      type = getFileType(pathname);
      if (type) {
        return serveStaticFile(pathname, type, response);
      } else {
        if (pathname.indexOf('.') === -1) {
          return handleRedirect(request.headers, pathname, response);
        } else {
          response.writeHead(200);
          return response.end();
        }
      }
    }
  };

  handleRedirect = function(headers, hashUrl, res) {
    var index;
    index = 0;
    if (headers.cookie) {
      index = parseInt(extractCookie(headers.cookie, COOKIE_PREFIX + hashUrl), 10) || 0;
    }
    return mustache.get(hashUrl, index, function(err, redirectUrl, newIndex) {
      if (redirectUrl && redirectUrl.length > 0) {
        res.writeHead(302, {
          'Set-Cookie': COOKIE_PREFIX + hashUrl + '=' + newIndex,
          'Location': redirectUrl
        });
        return res.end();
      } else {
        return serveErrorPage(res);
      }
    });
  };

  getFileType = function(fileName) {
    var extension, fileTypes, type;
    fileTypes = {
      '.js': 'text/javascript',
      '.html': 'text/html',
      '.css': 'text/css',
      '.svg': 'image/svg+xml'
    };
    for (extension in fileTypes) {
      type = fileTypes[extension];
      if (fileName.indexOf(extension) > -1) {
        return type;
      }
    }
    return fileName;
  };

  extractCookie = function(cookies, name) {
    var end, start;
    start = cookies.indexOf(name);
    end = cookies.indexOf(';', start);
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

}).call(this);
