(function() {
  var Mustache;

  Mustache = (function() {
    function Mustache(shortener, storage) {
      this.shortener = shortener;
      this.storage = storage;
    }

    Mustache.prototype.set = function(urlArray, fn) {
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
          index = index >= size ? 0 : index;
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
