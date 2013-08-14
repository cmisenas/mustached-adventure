var assert = require("assert");
var server = require('../js/server');
var COOKIE = "wordpress_test_cookie=WP+Cookie+check; wordpress_logged_in_06aca1042eaa4240465ba7b5d4fdae52=admin%7C1376242420%7C142fc8a89921d86e219bd07585d3455b; wp-settings-1=libraryContent%3Dbrowse%26editor%3Dtinymce%26wplink%3D1; wp-settings-time-1=1376069621; mycookie=test";

describe("Server", function(){
    describe("extractCookie", function(){
        it("should return the value of the correct cookie", function(){
            var cookieKey = "wp-settings-time-1";
            var cookieVal = "1376069621";
            var extracted = server.extractCookie(COOKIE, cookieKey);
            assert.equal(extracted, cookieVal);
        });
        it("should correctly return value of last cookie", function(){
            var cookieKey = "mycookie";
            var cookieVal = "test";
            var extracted = server.extractCookie(COOKIE, cookieKey);
            assert.equal(extracted, cookieVal);
        });
    });
});
