;(function(exports){
  var Mustache = function(shortener, storage){
    this.shortener = shortener;
    this.storage = storage;
  };

  Mustache.prototype.set = function(url, fn) {
      var that = this;
      this.storage.getIndex(function(err, res){
        var hashed = that.shortener.convert(parseInt(res, 10));
        that.storage.set(hashed, url, function(err, res){
          fn(err, hashed);
        });
      });
  }

  Mustache.prototype.get = function(hashedUrl, fn){
    this.storage.get(hashedUrl, fn)
  }
  exports.Mustache = Mustache;
}(this));
