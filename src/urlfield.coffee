class UrlField
  constructor: (@el) ->

  getVal: () ->
    urlVal = @el.value
    if @isOkayUrl(urlVal)
        return urlVal
    false

  isOkayUrl: (urlVal) ->
    hasWhitespace = /\s/g
    invalidEnding = /\.([a-z]{0,1}||[a-z]{5,})\/?$/
    invalidProtocol = /^(http|https|ftp)\:\/{2}/
    if urlVal.length == 0
      false
    else if hasWhitespace.test(urlVal)
      false
    else if invalidEnding.test(urlVal)
      false
    else if invalidProtocol.test(urlVal) == false
      false
    else
      true

  @addAnotherField: (container) ->
    $(container).append('<input type="text" class="urlfield" placeholder="and adding..."/>')

@UrlField = UrlField
