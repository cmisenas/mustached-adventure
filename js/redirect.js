;(function(exports){
  var Redirector = function(){
    this.url;
  }

  Redirector.prototype.set = function(urlVal){
    this.url = urlVal;
  }

  Redirector.prototype.get = function(){
    return this.url === false ? 'error.html' : this.url;
  }

  Redirector.prototype.redirectToUrl = function(urlVal) {
    window.location.href = urlVal;
  }
  
  exports.Redirector = Redirector;
}(this));