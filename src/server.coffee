config = require('../config')
http = require('http')
fs = require('fs')
url = require('url')
qs = require('querystring')

Mustache = require('./mustache').Mustache
Storage = require("../bin/storage").Storage
Shortener = require("../bin/shortener").Shortener

REDIS_PORT = config[process.env.NODE_ENV].redis.port if process.env.NODE_ENV isnt 'production'

storage = new Storage('redis', REDIS_PORT)
shortener = new Shortener()

mustache = new Mustache(shortener, storage)
COOKIE_PREFIX = '_MYSTASH_'
PORT = process.env.PORT || 8000

# Writes static file contents to head. If file does not exists, function serves error
# @param {string} filename - file to serve
# @param {string} type - type of file to serve
# @param {http.ServerResponse} response - response object generated from request
serveStaticFile = (filename, type, response) ->
  fs.readFile(filename, 'utf8', (error, data) ->
    if data
      response.writeHead(200, 'Content-Type': type)
      response.end(data)
    else
      serveErrorPage(response)
  )

# Serves default error page. If default error page is not found, writes file not found
# @param {http.ServerResponse} response
serveErrorPage = (response) ->
  fs.readFile('error.html', 'utf8', (error, data) ->
    response.writeHead(404)
    if error
      response.end('File Not Found!')
    else
      response.end(data)
  )

startServer = () ->
  app = makeApp()
  app.listen PORT
  console.log "Server started on port #{PORT}"
  app

makeApp = () ->
  http.createServer( (request, response) ->
    if request.method == 'POST'
      handlePost(request, response)
    else if (request.method == 'GET')
      handleGet(request, response)
  )

handlePost = (request, response) ->
  body = ''

  request.on('data', (data) ->
    body += data
  )

  request.on('end', ->
    urlData = qs.parse(body)
    urlArray = urlData.url = JSON.parse(urlData.url)
    mustache.set(urlArray, (error, hashedUrl) ->
      if error
        response.writeHead(400) #TODO: Make sure this is right
        console.log error
        response.end(JSON.stringify(error: "There was an error in parsing the url\n#{error}" ))
      if hashedUrl
        response.writeHead(200)
        response.end(JSON.stringify(hashedUrl: hashedUrl))
    )
  )

handleGet = (request, response) ->
  pathname = url.parse(request.url).pathname.substring(1)

  if pathname == ''
    serveStaticFile('index.html', 'text/html', response)
  else
    type = getFileType(pathname)
    if type == pathname
      if pathname.indexOf('.') == -1
        handleRedirect(request.headers, pathname, response)
      else
        response.writeHead(200)
        response.end()
    else
      serveStaticFile(pathname, type, response)

handleRedirect = (headers, hashUrl, res) ->
  index = 0
  if headers.cookie
    index = parseInt(extractCookie(headers.cookie, COOKIE_PREFIX + hashUrl), 10) or 0
  mustache.get(hashUrl, index, (err, redirectUrl, newIndex) ->
    if redirectUrl and redirectUrl.length > 0
      res.writeHead(302,
        'Set-Cookie': COOKIE_PREFIX + hashUrl + '=' + newIndex,
        'Location': redirectUrl
      )
      res.end()
    else
      serveErrorPage(res)
  )

getFileType = (fileName) ->
  fileTypes =
    '.js':    'text/javascript'
    '.html':  'text/html'
    '.css':   'text/css'
    '.svg':   'image/svg+xml'
  for extension, type of fileTypes
    return type if fileName.indexOf(extension) > -1

  fileName


extractCookie = (cookies, name) ->
  start = cookies.indexOf(name)
  end = cookies.indexOf(';', start)
  end = if end == -1 then cookies.length else end
  cookies.substring(start, end).split('=')[1]

module.exports.serveStaticFile = serveStaticFile
module.exports.serveErrorPage = serveErrorPage
module.exports.startServer = startServer
module.exports.handlePost = handlePost
module.exports.handleGet = handleGet
module.exports.handleRedirect = handleRedirect
module.exports.getFileType = getFileType
module.exports.extractCookie = extractCookie

startServer()
