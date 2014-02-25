UrlField = require("../bin/urlfield").UrlField
assert = require("assert")
$ = require("jquery")

describe("UrlField", ->

  setup(->
    @testfield = $("<input type='text' id='@urlfield'/>")
  )

  beforeEach(->
    @urlfield = new UrlField(@testfield)
  )

  it('should be instantiatable', ->
    assert(@urlfield)
  )

  it('should have a get method', ->
    assert.equal(typeof @urlfield.getVal, 'function')
  )

  it('should be able to get the value of url input field', ->
    @testfield.value = "http://www.myurl.com/"
    assert.equal(@urlfield.getVal(), @testfield.value)
  )

  describe('good url', ->
    it('should accept urls stating with the right protocol', ->
      goodUrlEnding = "://www.goodurl.com"
      goodProtocols = ["http", "https", "ftp"]
      for goodProtocol, index in goodProtocols
        @testfield.value = goodProtocol + goodUrlEnding
        assert.equal(@urlfield.getVal(), @testfield.value)
    )
  )

  describe('bad url', ->
    it('should not accept empty string', ->
      @testfield.value = ""
      assert.equal(@urlfield.getVal(), false)
    )

    it('should not accept string with only whitespace', ->
      @testfield.value = "   "
      assert.equal(@urlfield.getVal(), false)
    )

    it('should not accept url with a space', ->
      @testfield.value = "http://www.bad url.com"
      assert.equal(@urlfield.getVal(), false)
    )

    it('should have a 2-4 character domain ending', ->
      @testfield.value = "http://www.badurl.c"
      assert.equal(@urlfield.getVal(), false)
      @testfield.value = "http://www.badurl.coooooooom"
      assert.equal(@urlfield.getVal(), false)
    )

    it('should contain the name of a supported protocol', ->
      @testfield.value = "httpd://www.badurl.com"
      assert.equal(@urlfield.getVal(), false)
    )
  )

)
