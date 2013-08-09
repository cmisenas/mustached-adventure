;(function(exports){
  
  var Shortener = function(){}

  Shortener.prototype.convert = function(val){
    var convertedDigits = []
    while (val < 62){
      remainder = val % 62;
      digit = val / 62;
      val = remainder;
      convertedDigits.push(intToChar(digit));
    }
    convertedDigits.push(intToChar(val));
    return convertedDigits.join('');
  }

  function intToChar(digit){
    return String.fromCharCode(97 + digit);
  }

  exports.Shortener = Shortener;

}(this));
