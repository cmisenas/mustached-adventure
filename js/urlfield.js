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
    if (hasWhitespace.test(urlVal)) {
        return false;
    } else if(invalidEnding.test(urlVal)) {
        return false;
    } else if(invalidProtocol.test(urlVal)) {
        return false;
    } else {
        return true;
    }
    
  }
  
  exports.UrlField = UrlField;
}(this));
