(function() {
  var UrlField;

  UrlField = (function() {
    function UrlField(el) {
      this.el = el;
    }

    UrlField.prototype.getVal = function() {
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

    UrlField.addAnotherField = function(container) {
      return $(container).append('<input type="text" class="urlfield" placeholder="and adding..."/>');
    };

    return UrlField;

  })();

  this.UrlField = UrlField;

}).call(this);

(function() {
  var DOMAIN, allOtherFieldsFull, append, displayError, displayUrl, getAllInputFields, getAllInputFieldsExceptLast, getAllUrlFields, sendRequest, shortenBtn,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  DOMAIN = "http://mstch.link";

  if (process.env.WEB_URL != null) {
    DOMAIN = process.env.WEB_URL;
  }

  shortenBtn = $('#shorten')[0];

  sendRequest = function(urlVals) {
    return $.ajax({
      url: 'js/server.js',
      type: 'POST',
      data: {
        url: JSON.stringify(urlVals)
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
    innerHtml = "<a href='" + path + "'>" + DOMAIN + " " + path + "</a>";
    return append("shortenedUrl", innerHtml);
  };

  displayError = function(error) {
    var innerHtml;
    innerHtml = "<p>" + error + "</p>";
    return append("error", innerHtml);
  };

  append = function(containerId, content) {
    var container;
    container = $("<div id='" + containerId + "'></div>");
    container.html(content);
    return $('body').append(container);
  };

  allOtherFieldsFull = function(currentEl) {
    var field, fieldVal, inputFields, _i, _len;
    inputFields = getAllInputFields();
    for (_i = 0, _len = inputFields.length; _i < _len; _i++) {
      field = inputFields[_i];
      fieldVal = $.trim(field.value);
      if (fieldVal.length === 0 && field !== currentEl) {
        return false;
      }
    }
    return true;
  };

  $('#urlfield-container').on('focus', 'input.urlfield', function(e) {
    if (allOtherFieldsFull(e.target)) {
      return UrlField.addAnotherField('#urlfield-container');
    }
  });

  $('#urlfield-container').on('blur', 'input.urlfield', function(e) {
    var field, fieldVal, inputFields, _i, _len, _results;
    inputFields = getAllInputFields();
    _results = [];
    for (_i = 0, _len = inputFields.length; _i < _len; _i++) {
      field = inputFields[_i];
      fieldVal = field.value;
      _results.push($(field).val($.trim(fieldVal)));
    }
    return _results;
  });

  shortenBtn.onclick = function(e) {
    var urlField, urlFields, urlVals;
    urlFields = getAllUrlFields();
    e.preventDefault();
    urlVals = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = urlFields.length; _i < _len; _i++) {
        urlField = urlFields[_i];
        _results.push(urlField.getVal());
      }
      return _results;
    })();
    if (__indexOf.call(urlVals, false) >= 0) {
      return alert('Not a good a url :(');
    } else {
      return sendRequest(urlVals);
    }
  };

  getAllInputFieldsExceptLast = function() {
    var inputFields;
    inputFields = $('.urlfield');
    inputFields.splice(1, -1);
    return inputFields;
  };

  getAllInputFields = function() {
    var inputFields;
    return inputFields = $('.urlfield');
  };

  getAllUrlFields = function() {
    var inputField, inputFields, urlFields;
    inputFields = getAllInputFieldsExceptLast();
    return urlFields = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = inputFields.length; _i < _len; _i++) {
        inputField = inputFields[_i];
        if (!!inputField.value) {
          _results.push(new UrlField(inputField));
        }
      }
      return _results;
    })();
  };

}).call(this);
