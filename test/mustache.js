var assert = require("assert");
var $ = require("jquery");
var Mustache = require("../src/mustache").Mustache;
var Storage = require("../src/storage").Storage;
var Shortener = require("../src/shortener").Shortener;

var storage,
    shortener,
    mustache;

describe("Mustache", function(){
  beforeEach(function(){
    storage = new Storage('redis');
    shortener = new Shortener();
    mustache = new Mustache(shortener, storage);
  });

  afterEach(function(){
    storage.client.flushdb();
  });

  it("should be able to grow a mustache", function(){
    assert(mustache);
  });

  it("should return shortened url for input url", function(done){
    var url = "http://google.com/";
    mustache.set(url, function(err, res){
      assert.equal("string", typeof res);
      done();
    });
  });

  it("should grow a sensible mustache", function(done){
    var url1 = "http://google.com/";
    var url2 = "http://google2.com/";
    mustache.set(url1, function(err1, res1){
      assert.equal(res1, "0");
      mustache.set(url2, function(err2, res2){
        assert.equal(res2, "1");
        done();
      });
    });
  });

  it("should get the right address back", function(done){
    var originalUrl = "http://google.com/";
    mustache.set(originalUrl, function(err, hashedUrl){
      mustache.get(hashedUrl, 0, function(err, returnedUrl, newIndex){
        assert.equal(originalUrl, returnedUrl);
        done();
      });
    });
  });

  it("should go back to first url if the sent index is greater than size", function(done) {
    var urls = "https://www.google.com/|https://www.hackerschool.com/|https://humbughq.com/|http://gmail.com/";
    mustache.set(urls, function(err1, hashedUrl){
      mustache.get(hashedUrl, 4, function(err2, res, newIndex){
        assert.equal(res, "https://www.google.com/");
        assert.equal(newIndex, "1");
        done();
      });
    });
  });


});


