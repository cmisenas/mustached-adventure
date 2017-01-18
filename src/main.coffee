PROTOCAL = "http://"
DOMAIN = "mstch.link"

shortenBtn = $('#shorten')[0]

sendRequest = (urlVals) ->
  $.ajax(
    url: 'js/server.js'
    type: 'POST'
    data:
      url: JSON.stringify(urlVals)
    success: (res) ->
      resJSON = $.parseJSON(res)
      if resJSON.hashedUrl
        displayUrl(resJSON.hashedUrl)
      else if (resJSON.error)
        displayError(resJSON.error)
  )

displayUrl = (path) ->
  innerHtml = "<a href='#{PROTOCAL}#{path}'>#{DOMAIN}/#{path}</a>"
  append("shortenedUrl", innerHtml)

displayError = (error) ->
  innerHtml = "<p>#{error}</p>"
  append("error", innerHtml)

append = (containerId, content) ->
  container = $("<div id='#{containerId}'></div>")
  container.html(content)
  $('body').append(container)

allOtherFieldsFull = (currentEl) ->
  inputFields = getAllInputFields()
  for field in inputFields
    fieldVal = $.trim(field.value)
    if fieldVal.length == 0 and field != currentEl
      return false
  true

$('#urlfield-container').on('focus', 'input.urlfield', (e) ->
  if allOtherFieldsFull(e.target)
    UrlField.addAnotherField('#urlfield-container')
)

$('#urlfield-container').on('blur', 'input.urlfield', (e) ->
  inputFields = getAllInputFields()
  for field in inputFields
    fieldVal = field.value
    $(field).val($.trim(fieldVal))
)

shortenBtn.onclick = (e) ->
  urlFields = getAllUrlFields()
  e.preventDefault()
  urlVals = (urlField.getVal() for urlField in urlFields)
  if false in urlVals
    alert 'Not a good a url :('
  else
    sendRequest(urlVals)

getAllInputFieldsExceptLast = () ->
  inputFields = $('.urlfield')
  inputFields.splice(1, -1)
  inputFields

getAllInputFields = () ->
  inputFields = $('.urlfield')

getAllUrlFields = () ->
  inputFields = getAllInputFieldsExceptLast()
  urlFields = (new UrlField(inputField) for inputField in inputFields when !!inputField.value)
