;(function(exports) {
  
  var urlfield = new UrlField($('#urlfield')[0]);
  console.log(urlfield);

  var shortenBtn = $('#shorten')[0];
  var redirect = new Redirector();

  shortenBtn.onclick = function(e){
    e.preventDefault();
    var urlVal = urlfield.get();
    if (urlVal === false) {
      throw "Bad Url";
    }

    //send request
    $.ajax({url: 'js/server.js',
            type: 'POST',
            data: {url: urlVal},
            success: function(res){
              console.log(res);
              displayUrl(res);
            }
    });
  };

  var displayUrl = function(url){
    var urlContainer = $('<div id="shortenedUrl"></div>');
    urlContainer.html('<a href="http://mustached.com/' + url + '">http://mustached.com/' + url + '</a>');
    $('body').append(urlContainer);
  }

}(this));
