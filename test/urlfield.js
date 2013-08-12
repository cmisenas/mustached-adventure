var urlfield = require("../js/urlfield");
var assert = require("assert");
var mocha = require("mocha");
var $ = require("jquery");

var testfield;

describe("UrlField", function(){
  setup(function(){
    testfield = $("<input type='text' id='urlfield'/>");
  });

  beforeEach(function(){
    urlField = new urlfield.UrlField(testfield);
  });

  it('should be instantiatable', function(){
    assert(urlField);
  });

  it('should have a get method', function(){
    assert.equal(typeof urlField.get, 'function');
  });

  it('should be able to get the value of url input field', function(){
    testfield.val = "http://www.myurl.com/";
    assert.equal(urlField.get(), testfield.val);
  });

  describe('good url', function(){
    it('should accept urls stating with the right protocol', function(){
        var goodUrlEnding = "://www.goodurl.com";
        var goodProtocols = ["http", "https", "ftp"];
        for (var i = 0; i < goodProtocols.length; i++) {
            testfield.val = goodProtocols[i] + goodUrlEnding;
            assert.equal(urlField.get(), testfield.val);
        }
    });
  });

  describe('bad url', function(){
    it('should not accept empty string', function(){
        testfield.val = "";
        assert.equal(urlField.get(), false);
    });
    it('should not accept string with only whitespace', function(){
        testfield.val = "   ";
        assert.equal(urlField.get(), false);
    });

    it('should not accept url with a space', function(){
        testfield.val = "http://www.bad url.com";
        assert.equal(urlField.get(), false);
    });
    it('should have a 2-4 character domain ending', function(){
        testfield.val = "http://www.badurl.c";
        assert.equal(urlField.get(), false);
        testfield.val = "http://www.badurl.coooooooom";
        assert.equal(urlField.get(), false);
    });
    it('should contain the name of a supported protocol', function(){
        testfield.val = "httpd://www.badurl.com";
        assert.equal(urlField.get(), false);
    });
  });
});
