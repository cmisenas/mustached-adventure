assert = require("assert")
$ = require("jquery")
Mustache = require("../bin/mustache").Mustache
Storage = require("../bin/storage").Storage
Shortener = require("../bin/shortener").Shortener

describe("Mustache", ->
  beforeEach(->
    @storage = new Storage('redis')
    @shortener = new Shortener()
    @mustache = new Mustache(@shortener, @storage)
  )

  afterEach(->
    @storage.client.flushdb()
  )

  it("should be able to grow a mustache", ->
    assert(@mustache)
  )

  it("should return shortened url for input url", (done) ->
    url = "http://google.com/"
    @mustache.set(url, (err, res) ->
      assert.equal("string", typeof res)
      done()
    )
  )

  it("should grow a sensible mustache", (done) ->
    url1 = "http://google.com/"
    url2 = "http://google2.com/"
    @mustache.set(url1, (err1, res1) =>
      assert.equal(res1, "0")
      @mustache.set(url2, (err2, res2) =>
        assert.equal(res2, "1")
        done()
      )
    )
  )

  it("should get the right address back", (done) ->
    originalUrl = "http://google.com/"
    @mustache.set(originalUrl, (err, hashedUrl) =>
      @mustache.get(hashedUrl, 0, (err, returnedUrl, newIndex) ->
        assert.equal(originalUrl, returnedUrl)
        done()
      )
    )
  )

  it("should go back to first url if the sent index is greater than size", (done) ->
    urls = "https://www.google.com/|https://www.hackerschool.com/|https://humbughq.com/|http://gmail.com/"
    @mustache.set(urls, (err1, hashedUrl) =>
      @mustache.get(hashedUrl, 4, (err2, res, newIndex) ->
        assert.equal(res, "https://www.google.com/")
        assert.equal(newIndex, "1")
        done()
      )
    )
  )

)


