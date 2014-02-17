var Redirector = require("../src/redirect").Redirector;
var assert = require("assert");
var $ = require("jquery");
var redir;

describe("Redirecting URLs", function(){

  setup(function(){
    redir = new Redirector();
  });

  it("should be able to change the window.location.href given a right url", function(){
    var urlVal = 'http://google.com';
    redir.set(urlVal);
    assert.equal(redir.get(), urlVal);
  });

  it("should show error page given a wrong url value", function(){
    redir.set(false);
    assert.equal(redir.get(), 'error.html');
  });

});
