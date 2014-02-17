DOMAIN = "http://www.mstch.me/"
urlfield = new UrlField($('#urlfield')[0])
shortenBtn = $('#shorten')[0]

sendRequest = (urlVal) ->
  $.ajax(
    url: 'js/server.js'
    type: 'POST'
    data:
      url: urlVal
    success: (res) ->
      resJSON = $.parseJSON(res)
      if resJSON.hashedUrl
        displayUrl(resJSON.hashedUrl)
      else if (resJSON.error)
        displayError(resJSON.error)
  )

displayUrl = (path) ->
  innerHtml = '<a href="/' + path + '" >' + DOMAIN + path + '</a>'
  append("shortenedUrl", innerHtml)

displayError = (error) ->
  innerHtml = '<p>' + error + '</p>'
  append("error", innerHtml)

append = (containerId, content) ->
  container = $('<div id="' + containerId +'"></div>')
  container.html(content)
  $('body').append(container)

shortenBtn.onclick = (e) ->
  e.preventDefault()
  urlVal = urlfield.get()
  if urlVal == false
    alert 'Not a good a url :('
  else
    sendRequest(urlVal)
