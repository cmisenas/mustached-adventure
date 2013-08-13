var Storage = require("../js/storage").Storage;
var assert = require("assert");
var $ = require("jquery");
var storage; 

describe("Storage", function(){
  
  beforeEach(function(){
    storage = new Storage('redis');
  });

  it("should be able to create db", function(done){
    var k = "test key",
        v = "test val";

    storage.set(k, v);
    storage.get(k, function(err, res){
      assert.equal(res, v);
      done();
    });

  });

  it("should return null when hash or function is empty", function(done){
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
        v = "test val";
    storage.set(k, v, function(err, res){
      storage.get(k, function(err, res){
        assert.equal(res, null);
        done();
      });
    });
  });

  it("should increment index by one when setting", function(done){
    var k = "test key",
        v = "test val";
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

});
