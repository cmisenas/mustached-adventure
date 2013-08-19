;(function(exports) {
  
  var DOMAIN = "http://mstch.me/";
  var urlfield = new UrlField($('#urlfield')[0]);
  var shortenBtn = $('#shorten')[0];

  shortenBtn.onclick = function(e){
    e.preventDefault();
    var urlVal = urlfield.get();
    if (urlVal === false) {
      alert('Not a good a url :(');
      //throw "Bad Url";
    } else {
      sendRequest(urlVal);
    }
  };

  function sendRequest(urlVal){
    $.ajax({url: 'js/server.js',
            type: 'POST',
            data: {url: urlVal},
            success: function(res){
              var resJSON = $.parseJSON(res);
              if (resJSON.hashedUrl) {
                displayUrl(resJSON.hashedUrl);
              } else if (resJSON.error) {
                displayError(resJSON.error);
              }
            }
    });
  }

  var displayUrl = function(path){
    var innerHtml = '<a href="/' + path + '" >' + DOMAIN + path + '</a>';
    append("shortenedUrl", innerHtml);
  }

  var displayError = function(error){
    var innerHtml = '<p>' + error + '</p>';
    append("error", innerHtml);
  }

  function append(containerId, content){
    var container = $('<div id="' + containerId +'"></div>');
    container.html(content);
    $('body').append(container);
  }

}(this));
