(function() {
  var UrlField;

  UrlField = (function() {
    function UrlField(el) {
      this.el = el;
    }

    UrlField.prototype.get = function() {
      var urlVal;
      urlVal = this.el.value;
      if (this.isOkayUrl(urlVal)) {
        return urlVal;
      }
      return false;
    };

    UrlField.prototype.isOkayUrl = function(urlVal) {
      var hasWhitespace, invalidEnding, invalidProtocol;
      hasWhitespace = /\s/g;
      invalidEnding = /\.([a-z]{0,1}||[a-z]{5,})\/?$/;
      invalidProtocol = /^(http|https|ftp)\:\/{2}/;
      if (urlVal.length === 0) {
        return false;
      } else if (hasWhitespace.test(urlVal)) {
        return false;
      } else if (invalidEnding.test(urlVal)) {
        return false;
      } else if (invalidProtocol.test(urlVal) === false) {
        return false;
      } else {
        return true;
      }
    };

    return UrlField;

  })();

  this.UrlField = UrlField;

}).call(this);
