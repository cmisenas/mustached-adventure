;(function(exports){
  
  var Shortener = function(){}

  Shortener.prototype.convert = function(val){
    var base = 62;
    var convertedDigits = [];
    if (val === 0){
        return '0'
    }
    while (val > 0){
        var remainder = val % base;
        convertedDigits.push(this.intToChar(remainder));
        val = Math.floor(val / base);
    }
    return convertedDigits.reverse().join('');
  }

  Shortener.prototype.intToChar = function(digit){
    var base = 0;
    if (digit < 10){
        return digit;
    } else if (digit < 36){
        digit -= 10;
        base = 65;
    } else {
        digit -= 36;
        base = 97;
    }
    return String.fromCharCode(base + digit);
  }

  exports.Shortener = Shortener;

}(this));
