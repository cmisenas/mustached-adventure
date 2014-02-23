class Mustache
  constructor: (@shortener, @storage) ->

  set: (urlArray, fn) ->
    @storage.getIndex( (outerErr, outerRes) =>
      hashed = @shortener.convert(parseInt(outerRes, 10))
      @storage.set(hashed, urlArray, (innerErr, innerRes) ->
        fn(innerErr, hashed)
      )
    )

  get: (hashedUrl, index, fn) ->
    @storage.sizeOf(hashedUrl, (outerErr, size) =>
      index = if index >= size then 0 else index
      @storage.get(hashedUrl, index, (innerErr, urlValue) ->
        fn(innerErr, urlValue, index + 1)
      )
    )

@Mustache = Mustache
