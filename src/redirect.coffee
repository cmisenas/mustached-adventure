class Redirector
  constructor: (@url) ->

  set: (urlVal) ->
    @url = urlVal

  get: ->
    if @url == false then 'error.html' else @url

  redirectToUrl: (urlVal) ->
    window.location.href = urlVal

@Redirector = Redirector
