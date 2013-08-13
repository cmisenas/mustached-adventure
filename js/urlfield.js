;(function(exports){

  var UrlField = function(el){
    this.el = el;
  }

  UrlField.prototype.get = function(){
    var urlVal = this.el.val
    if (this.isOkayUrl(urlVal)) {
        return this.el.val;
    }
    return false;
  }

  UrlField.prototype.isOkayUrl = function(urlVal) {
    var hasWhitespace = /\s/g;
    var invalidEnding = /\.([a-z]{0,1}||[a-z]{5,})\/?$/;
    var invalidProtocol = /^(http|https|ftp)\:\/{2}/;
    if (urlVal.length === 0) {
        return false;
    } else if (hasWhitespace.test(urlVal)) {
        return false;
    } else if(invalidEnding.test(urlVal)) {
        return false;
    } else if(invalidProtocol.test(urlVal) === false) {
        return false;
    } else {
        return true;
    }
    
  }
  
  exports.UrlField = UrlField;
}(this));
