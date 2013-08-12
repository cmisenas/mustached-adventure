;(function(exports){
  var UrlField = function(el){
    this.el = el;
    this.urlval = this.el.val;
  }
  UrlField.prototype.get = function(){
  }
  exports.UrlField = UrlField;
}(this));
