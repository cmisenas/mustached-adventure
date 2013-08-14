var assert = require("assert");
var $ = require("jquery");
var Mustache = require("../js/mustache").Mustache;
var Storage = require("../js/storage").Storage;
var Shortener = require("../js/shortener").Shortener;

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
    var url = "http://google.com/";
    var url2 = "http://google2.com/";
    mustache.set(url, function(err, res){
      assert.equal(res, "0");
      mustache.set(url2, function(err, res){
        assert.equal(res, "1");
        done();
      });
    });
  });

  it("should get the right address back", function(done){
    var originalUrl = "http://google.com/";
    mustache.set(originalUrl, function(err, hashedUrl){
      mustache.get(hashedUrl, function(err, returnedUrl){
        assert.equal(originalUrl, returnedUrl);
        done();
      });
    });
  });
});


