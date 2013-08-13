;(function(exports){

  var Storage = function(mod){
    var store = require(mod);
    this.client = store.createClient();
    this.client.setnx("index", 0);

    this.client.on("error", function(err) {
      console.log("Error: " + err);
    });
  }

  Storage.prototype.set = function(key, val, fn) {
    if (key === 'index' || key === ''){
      fn(new Error('Error: Bad key'));
      return false;
    }
    this.client.incr("index");
    this.client.set(key, val, fn);
  }

  Storage.prototype.get = function(hash, fn) {
    this.client.get(hash, fn);
  }

  Storage.prototype.getIndex = function(fn) {
    this.client.get('index', function(err, res){
      fn(err, parseInt(res, 10));
    });
  }

  exports.Storage = Storage;
}(this));
