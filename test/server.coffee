assert = require("assert")
server = require('../bin/server')
COOKIE = "wordpress_test_cookie=WP+Cookie+check; wordpress_logged_in_06aca1042eaa4240465ba7b5d4fdae52=admin%7C1376242420%7C142fc8a89921d86e219bd07585d3455b; wp-settings-1=libraryContent%3Dbrowse%26editor%3Dtinymce%26wplink%3D1; wp-settings-time-1=1376069621; mycookie=test"

describe("Server", ->
  describe("extractCookie", ->
    it("should return the value of the correct cookie", ->
      cookieKey = "wp-settings-time-1"
      cookieVal = "1376069621"
      extracted = server.extractCookie(COOKIE, cookieKey)
      assert.equal(extracted, cookieVal)
    )
    it("should correctly return value of last cookie", ->
      cookieKey = "mycookie"
      cookieVal = "test"
      extracted = server.extractCookie(COOKIE, cookieKey)
      assert.equal(extracted, cookieVal)
    )
  )
)
