'use strict';

var Encoder = function() {

};

Encoder.prototype = {
	// meant to be overridden.  This returns what you send it.
	// so it just assumes you have passed an sdr.
	encode: function(obj) {
		return obj;
	}
};

module.exports = Encoder;
