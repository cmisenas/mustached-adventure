;(function(exports){
  function mustache(url, shortener, storage, fn) {
      storage.getIndex(function(err, res){
        var hashed = shortener.convert(parseInt(res, 10));
        storage.set(hashed, url, function(err, res){
          fn(err, hashed);
        });
      });
  }
  exports.mustache = mustache;
}(this));
