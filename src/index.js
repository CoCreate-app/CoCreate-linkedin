(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function(CoCreateLinkedin) {
        	return factory(CoCreateLinkedin)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateLinkedin = require("./server.js")
      module.exports = factory(CoCreateLinkedin);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateLinkedin) {
  return CoCreateLinkedin;
}));