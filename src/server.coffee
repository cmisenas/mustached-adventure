http = require('http')
fs = require('fs')
url = require('url')
qs = require('querystring')

Mustache = require('./mustache').Mustache
Storage = require("../src/storage").Storage
Shortener = require("../src/shortener").Shortener

storage = new Storage('redis')
shortener = new Shortener()

mustache = new Mustache(shortener, storage)
COOKIE_PREFIX = '_MYSTASH_'
PORT = 8000

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
    body += data.toString()
  )

  request.on('end', ->
    url = qs.parse(body).url
    mustache.set(url, (error, hashedUrl) ->
      if error
        response.writeHead(200) #TODO: Make sure this is right
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
    if type
      serveStaticFile(pathname, type, response)
    else
      if pathname.indexOf('.') == -1
        handleRedirect(request.headers, pathname, response)
      else
        response.writeHead(200)
        response.end()

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
  switch fileName
    when fileName.indexOf('.js')   > -1 then 'text/javascript'
    when fileName.indexOf('.html') > -1 then 'text/html'
    when fileName.indexOf('.css')  > -1 then 'text/css'
    when fileName.indexOf('.svg')  > -1 then 'image/svg+xml'
    else false

extractCookie = (cookies, name) ->
  start = cookies.indexOf(name)
  end = cookies.indexOf('', start)
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
