'use strict';
var util = require('util');
var Encoder = require('./encoder');
var SpatialPooler = require('../spatial-pooler');
var SpatialEncoder = function(options) {
	this.inputLength = options.inputLength || 300;
	this.sp = options.sp || new SpatialPooler({
		columnLength: options.columnLength,
		inputLength: options.inputLength,
		medianSynapses: options.medianSynapses
	});
};

util.inherits(SpatialEncoder, Encoder);

SpatialEncoder.prototype.encode = function(str) {
	var input = [];
	var i;
	var code;
	str = str || '';
	for(i = 0; i < str.length; i++) {
		code = str[i].charCodeAt(0);
		if (isNaN(code)) {
			code = '0';
		}
		input = input.concat(code.toString(2).split(''));
	}
	while (input.length < this.inputLength) {
		input.push(0);
	}

	var sdr = this.sp.getSDR(input);
	return sdr;
};

module.exports = SpatialEncoder;
