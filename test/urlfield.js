var urlfield = require("../js/urlfield");
var assert = require("assert");
var mocha = require("mocha");
var $ = require("jquery");

var testfield;

describe("UrlField", function(){
  setup(function(){
    testfield = $("<input type='text' id='urlfield'/>");
  });

  it('should be instantiatable', function(){
    var urlField = new urlfield.UrlField(testfield);
    assert(urlField);
  });

  it('should have a get method', function(){
    var urlField = new urlfield.UrlField(testfield);
    assert.equal(typeof urlField.get, 'function');
  });

  it('should be able to get the value of url input field', function(){
  });

  it('should be able to return false when url input field value is invalid', function(){
  });

});
