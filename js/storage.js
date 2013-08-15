;(function(exports){

  var Storage = function(mod){
    var store = require(mod);
    this.client = store.createClient();
    this.client.setnx("index", 0);

    this.client.on("error", function(err) {
      console.log("Error: " + err);
    });
  }

  Storage.prototype.set = function(key, vals, fn) {
    if (key === 'index' || key === ''){
      fn(new Error('Error: Bad key'));
      return false;
    }
    this.client.incr("index");
    var addArr = [];
    addArr.push(key);
    for (var i = 0; i < vals.length; i++) {
      addArr.push(i + 1, vals[i]);
    }
    this.client.zadd(addArr, fn);
  }

  Storage.prototype.get = function(hash, index, fn) {
    this.client.zrange(hash, index, index, fn);
  }

  Storage.prototype.getIndex = function(fn) {
    var that = this;
    this.client.get('index', function(err, res){
      if (res === null) {
        that.client.setnx("index", 0);
        res = 0;
      }
      fn(err, parseInt(res, 10));
    });
  }

  Storage.prototype.sizeOf = function(key, fn) {
    this.client.zcard(key, fn);
  }

  exports.Storage = Storage;
}(this));
