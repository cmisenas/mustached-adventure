;(function(exports){
  var Mustache = function(shortener, storage){
    this.shortener = shortener;
    this.storage = storage;
  };

  Mustache.prototype.set = function(url, fn) {
    var that = this;
    var urlArray = url.split('|');
    this.storage.getIndex(function(err, res){
      var hashed = that.shortener.convert(parseInt(res, 10));
      that.storage.set(hashed, urlArray, function(err, res){
        fn(err, hashed);
      });
    });
  }

  Mustache.prototype.get = function(hashedUrl, index, fn){
    var that = this;
    this.storage.sizeOf(hashedUrl, function(err1, size){
      index = index >= size ? 0 : index;
      that.storage.get(hashedUrl, index, function(err2, urlValue){
        fn(err2, urlValue, index + 1);
      });
    });
  }

  exports.Mustache = Mustache;
}(this));
