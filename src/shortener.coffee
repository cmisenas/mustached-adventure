class Shortener
  convert: (val) ->
    base = 62
    convertedDigits = []
    if val == 0
      return '0'
    while val > 0
      remainder = val % base
      convertedDigits.push(@intToChar(remainder))
      val = Math.floor(val / base)
    convertedDigits.reverse().join('')

  intToChar: (digit) ->
    base = 0
    if digit < 10
      return digit
    else if digit < 36
      digit -= 10
      base = 65
    else
      digit -= 36
      base = 97
    String.fromCharCode(base + digit)

@Shortener = Shortener
