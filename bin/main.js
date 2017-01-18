(function() {
  var DOMAIN, PROTOCOL, allOtherFieldsFull, append, displayError, displayUrl, getAllInputFields, getAllInputFieldsExceptLast, getAllUrlFields, sendRequest, shortenBtn,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PROTOCOL = "http://";

  DOMAIN = "mstch.link";

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
    innerHtml = "<a href='" + path + "'>" + DOMAIN + "/" + path + "</a>";
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
