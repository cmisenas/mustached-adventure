Storage = require("../bin/storage").Storage
assert = require("assert")
config = require('../config')

describe("Storage", ->

  beforeEach( ->
    @storage = new Storage('redis', config.test.redis.port)
  )

  afterEach( ->
    @storage.client.flushdb()
  )

  it("should be able to create db", (done) ->
    k = "test key"
    v = ["test val"]

    @storage.set(k, v, (outerErr, outerRes) =>
      @storage.get(k, 0, (innerErr, innerRes) =>
        assert.equal(innerRes[0], v[0])
        done()
      )
    )
  )

  it("should return null when hash or function is empty", (done) ->
    # figure out why it does not fail
    # even when index not passed
    @storage.get('', (err, res) ->
      assert.equal(res, null)
      done()
    )
  )

  it("should return number index", (done) ->
    @storage.getIndex((err, res) ->
      assert.equal(true, ( ->
        parseInt(res) >= 0;
      )())
      assert.equal(true, !isNaN(res))
      done()
    )
  )

  it("should not accept insertions with empty key", (done) ->
    k = ""
    v = ["test val"]
    @storage.set(k, v, (err, res) =>
      @storage.get(k, (err, res) =>
        assert.equal(res, null)
        done()
      )
    )
  )

  it("should increment index by one when setting", (done) ->
    k = "test key"
    v = ["test val"]
    @storage.getIndex((err, res) =>
      index = res
      @storage.set(k, v, (err, res) =>
        @storage.getIndex((err, res) =>
          assert.equal(parseInt(res, 10), parseInt(index, 10) + 1)
          done()
        )
      )
    )
  )

  it("should return the right size given a key", (done) ->
    k = "test key"
    v = ["https://www.google.com/", "https://www.hackerschool.com/", "https://humbughq.com/", "http://gmail.com/"]
    @storage.set(k, v, (err1, res1) =>
      @storage.sizeOf(k, (err2, res2) =>
        assert.equal(res2, 4)
        done()
      )
    )
  )

)
