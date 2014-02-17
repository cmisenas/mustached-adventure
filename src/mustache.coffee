class Mustache
  constructor: (@shortener, @storage) ->

  set: (url, fn) ->
    urlArray = url.split('|')
    @storage.getIndex( (outerErr, outerRes) =>
      hashed = @shortener.convert(parseInt(outerRes, 10))
      @storage.set(hashed, urlArray, (innerErr, innerRes) ->
        fn(innerErr, hashed)
      )
    )

  get: (hashedUrl, index, fn) ->
    @storage.sizeOf(hashedUrl, (outerErr, size) =>
      index = index >= size ? 0 : index
      @storage.get(hashedUrl, index, (innerErr, urlValue) ->
        fn(innerErr, urlValue, index + 1)
      )
    )

@Mustache = Mustache
