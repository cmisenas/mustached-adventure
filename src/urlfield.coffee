class UrlField
  constructor: (@el) ->

  UrlField.prototype.get = () ->
    urlVal = @el.value
    if @isOkayUrl(urlVal)
        return urlVal
    false

  UrlField.prototype.isOkayUrl = (urlVal) ->
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

@UrlField = UrlField
