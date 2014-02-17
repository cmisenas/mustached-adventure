(function() {
  var Mustache;

  Mustache = (function() {
    function Mustache(shortener, storage) {
      this.shortener = shortener;
      this.storage = storage;
    }

    Mustache.prototype.set = function(url, fn) {
      var urlArray;
      urlArray = url.split('|');
      return this.storage.getIndex((function(_this) {
        return function(outerErr, outerRes) {
          var hashed;
          hashed = _this.shortener.convert(parseInt(outerRes, 10));
          return _this.storage.set(hashed, urlArray, function(innerErr, innerRes) {
            return fn(innerErr, hashed);
          });
        };
      })(this));
    };

    Mustache.prototype.get = function(hashedUrl, index, fn) {
      return this.storage.sizeOf(hashedUrl, (function(_this) {
        return function(outerErr, size) {
          var _ref;
          index = (_ref = index >= size) != null ? _ref : {
            0: index
          };
          return _this.storage.get(hashedUrl, index, function(innerErr, urlValue) {
            return fn(innerErr, urlValue, index + 1);
          });
        };
      })(this));
    };

    return Mustache;

  })();

  this.Mustache = Mustache;

}).call(this);
