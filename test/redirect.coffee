Redirector = require("../bin/redirect").Redirector
assert = require("assert")

describe("Redirecting URLs", ->
  setup(->
    @redir = new Redirector()
  )

  it("should be able to change the window.location.href given a right url", ->
    urlVal = 'http://google.com'
    @redir.set(urlVal)
    assert.equal(@redir.get(), urlVal)
  )

  it("should show error page given a wrong url value", ->
    @redir.set(false)
    assert.equal(@redir.get(), 'error.html')
  )

)
