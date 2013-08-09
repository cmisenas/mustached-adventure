var urlfield = require("../js/urlfield");
var assert = require("assert");

describe('test mocha', function(){
  it('it should run mocha tests when we call mocha', function(){
    assert.equal(1, 1);
  })
})

describe('User Interface', function(){
  describe('UrlField', function(){
    it('should be instantiatable', function(){
      var urlField = new urlfield.UrlField();
      assert(urlField);
    })
    it('should have a get method', function(){
      var urlField = new urlfield.UrlField();
      assert.equal(urlField.get, 'function (){\n  }');
    })
  })
})
