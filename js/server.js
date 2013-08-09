var http = require('http'),
    fs = require('fs'),
    io = require('socket.io'),
    url = require('url');

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
    var pathname = url.parse(req.url).pathname;
    if (pathname == '/') {
      serveStaticFile('index.html', 'text/html', res);
    } else {
      var type = pathname.indexOf('.js') > -1 ? 'text/javascript' : 'text/css' ;
      serveStaticFile(pathname.substring(1), type, res);
    }
  }).listen(PORT);

  console.log("Server started on port", PORT);
  return app;
};

function initSocketIO(app){
  var socket = io.listen(app);
  socket.configure(function(){
    socket.set('transports', ['websocket']);
    socket.set('log level', 2);
  });

  return socket;
}

var socket = initSocketIO(startServer());
