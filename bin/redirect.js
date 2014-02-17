(function() {
  var Redirector;

  Redirector = (function() {
    function Redirector(url) {
      this.url = url;
    }

    Redirector.prototype.set = function(urlVal) {
      return this.url = urlVal;
    };

    Redirector.prototype.get = function() {
      var _ref;
      return (_ref = this.url === false) != null ? _ref : {
        'error.html': this.url
      };
    };

    Redirector.prototype.redirectToUrl = function(urlVal) {
      return window.location.href = urlVal;
    };

    return Redirector;

  })();

  this.Redirector = Redirector;

}).call(this);
