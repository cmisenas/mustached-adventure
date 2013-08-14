var assert = require("assert");
var $ = require("jquery");
var mustache = require("../js/mustache").mustache;
var Storage = require("../js/storage").Storage;
var Shortener = require("../js/shortener").Shortener;

var storage,
    shortener;

describe("Mustache", function(){
  beforeEach(function(){
    storage = new Storage('redis');
    shortener = new Shortener();
  });
  afterEach(function(){
    storage.client.flushdb();
  });
  it("should be able to grow a mustache", function(){
    assert(mustache);
  });
  it("should return shortened url for input url", function(done){
    var url = "http://google.com/";
    mustache(url, shortener, storage, function(err, res){
      assert.equal("string", typeof res);
      done();
    });
  });
  it("should grow a sensible mustache", function(done){
    var url = "http://google.com/";
    var url2 = "http://google2.com/";
    mustache(url, shortener, storage, function(err, res){
      assert.equal(res, "0");
      mustache(url2, shortener, storage, function(err, res){
        assert.equal(res, "1");
        done();
      });
    });
  });
});


