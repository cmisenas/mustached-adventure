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
      if (this.url === false) {
        return 'error.html';
      } else {
        return this.url;
      }
    };

    Redirector.prototype.redirectToUrl = function(urlVal) {
      return window.location.href = urlVal;
    };

    return Redirector;

  })();

  this.Redirector = Redirector;

}).call(this);
