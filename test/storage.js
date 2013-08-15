var Storage = require("../js/storage").Storage;
var assert = require("assert");
var $ = require("jquery");
var storage; 

describe("Storage", function(){

  beforeEach(function(){
    storage = new Storage('redis');
  });

  afterEach(function(){
    storage.client.flushdb();
  });

  it("should be able to create db", function(done){
    var k = "test key",
    v = ["test val"];

    storage.set(k, v, function(){
      storage.get(k, 0, function(err, res){
        assert.equal(res[0], v[0]);
        done();
      });
    });

  });

  it("should return null when hash or function is empty", function(done){
    // figure out why it does not fail
    // even when index not passed
    storage.get('', function(err, res) {
      assert.equal(res, null);
      done();
    });
  });

  it("should return number index", function(done){
    storage.getIndex(function(err, res) {
      assert.equal(true, (function(){
        return parseInt(res) >= 0; 
      }()));
      assert.equal(true, !isNaN(res));
      done();
    });
  });

  it("should not accept insertions with empty key", function(done){
    var k = "",
        v = ["test val"];
    storage.set(k, v, function(err, res){
      storage.get(k, function(err, res){
        assert.equal(res, null);
        done();
      });
    });
  });

  it("should increment index by one when setting", function(done){
    var k = "test key",
        v = ["test val"];
    var index;
    storage.getIndex(function(err, res){
      index = res;
      storage.set(k, v, function(err, res){
        storage.getIndex(function(err, res){
          assert.equal(parseInt(res, 10), parseInt(index, 10) + 1);
          done();
        });
      });
    });
  });

  it("should return the right size given a key", function(done){
    var k = "test key",
        v = ["https://www.google.com/", "https://www.hackerschool.com/", "https://humbughq.com/", "http://gmail.com/"];
    storage.set(k, v, function(err1, res1){
      storage.sizeOf(k, function(err2, res2){
        assert.equal(res2, 4);
        done();
      });
    });
  });


});
