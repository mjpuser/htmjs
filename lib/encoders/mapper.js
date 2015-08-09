'use strict';

var Encoder = require('./encoder');
var solr = require('solr-client');

var Mapper = function(options) {
	this.encoder = options.encoder || new Encoder();
	this.dbPath = options.dbPath || './mapper-db';
	this.db = level(this.dbPath);
	this.index = inverted(this.db);
};


Mapper.prototype = {
	input: function(str) {
		var sdr = this.encoder.encode(str);
		//console.log('indexing', sdr.toString(), str);
		this.index.put(sdr.join(' '), str, function(err) {
			if (err) {
				console.log(err);
			}
		});
		return sdr;
	},
	translate: function(sdr, cb) {
		cb = cb || function(err, result) {
			console.log(err, result);
		};
		var searching = sdr.join(' ');
		this.index.search(searching, cb);
		console.log('searching', searching);
	}
};

module.exports = Mapper;
