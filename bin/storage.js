(function() {
  var Storage;

  Storage = (function() {
    function Storage(mod) {
      var store;
      store = require(mod);
      this.client = store.createClient();
      this.client.setnx("index", 0);
      this.client.on("error", function(error) {
        return console.log("ERROR: " + error);
      });
    }

    Storage.prototype.set = function(key, vals, fn) {
      var addArr, index, val, _i, _len;
      if (key === 'index' || key === '') {
        fn(new Error('ERROR: Bad key'));
        return false;
      }
      this.client.incr("index");
      addArr = [];
      addArr.push(key);
      for (index = _i = 0, _len = vals.length; _i < _len; index = ++_i) {
        val = vals[index];
        addArr.push(index + 1, val);
      }
      return this.client.zadd(addArr, fn);
    };

    Storage.prototype.get = function(hash, index, fn) {
      return this.client.zrange(hash, index, index, fn);
    };

    Storage.prototype.getIndex = function(fn) {
      return this.client.get('index', (function(_this) {
        return function(error, response) {
          if (response === null) {
            _this.client.setnx("index", 0);
            response = 0;
          }
          return fn(error, parseInt(response, 10));
        };
      })(this));
    };

    Storage.prototype.sizeOf = function(key, fn) {
      return this.client.zcard(key, fn);
    };

    return Storage;

  })();

  this.Storage = Storage;

}).call(this);
