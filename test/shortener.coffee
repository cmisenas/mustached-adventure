Shortener = require("../bin/shortener").Shortener
assert = require("assert")
$ = require("jquery")

describe("Shortener", ->
  setup(->
    @shortener = new Shortener()
  )

  it("should be creatable", ->
    assert(@shortener)
  )

  it("should return appropriate char for number", ->
    assert.equal(@shortener.intToChar(0), '0')
    assert.equal(@shortener.intToChar(10), 'A')
    assert.equal(@shortener.intToChar(36), 'a')
  )

  it("should return the right one digit values", ->
    assert.equal(@shortener.convert(0), '0')
    assert.equal(@shortener.convert(10), 'A')
    assert.equal(@shortener.convert(36), 'a')
  )

  it("should return the right two digit value", ->
    assert.equal(@shortener.convert(62), '10')
    assert.equal(@shortener.convert(63), '11')
  )

  it("should return the right three digit value", ->
    assert.equal(@shortener.convert(3844), '100')
    assert.equal(@shortener.convert(3845), '101')
  )

)
