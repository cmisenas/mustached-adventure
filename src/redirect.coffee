class Redirector
  constructor: (@url) ->

  set: (urlVal) ->
    @url = urlVal

  get: ->
    @url == false ? 'error.html' : @url

  redirectToUrl: (urlVal) ->
    window.location.href = urlVal

@Redirector = Redirector
