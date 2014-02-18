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

(function() {
  var DOMAIN, append, displayError, displayUrl, sendRequest, shortenBtn, urlfield;

  DOMAIN = "http://www.mstch.me/";

  urlfield = new UrlField($('#urlfield')[0]);

  shortenBtn = $('#shorten')[0];

  sendRequest = function(urlVal) {
    return $.ajax({
      url: 'js/server.js',
      type: 'POST',
      data: {
        url: urlVal
      },
      success: function(res) {
        var resJSON;
        resJSON = $.parseJSON(res);
        if (resJSON.hashedUrl) {
          return displayUrl(resJSON.hashedUrl);
        } else if (resJSON.error) {
          return displayError(resJSON.error);
        }
      }
    });
  };

  displayUrl = function(path) {
    var innerHtml;
    innerHtml = '<a href="/' + path + '" >' + DOMAIN + path + '</a>';
    return append("shortenedUrl", innerHtml);
  };

  displayError = function(error) {
    var innerHtml;
    innerHtml = '<p>' + error + '</p>';
    return append("error", innerHtml);
  };

  append = function(containerId, content) {
    var container;
    container = $('<div id="' + containerId(+'"></div>'));
    container.html(content);
    return $('body').append(container);
  };

  shortenBtn.onclick = function(e) {
    var urlVal;
    e.preventDefault();
    urlVal = urlfield.get();
    if (urlVal === false) {
      return alert('Not a good a url :(');
    } else {
      return sendRequest(urlVal);
    }
  };

}).call(this);
