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
    $.ajax({url: 'js/mustache.js',
            data: {url: urlVal},
            success: function(err, res){
              console.log(res);
            }
    });
  };

}(this));
