'use strict';

var Encoder = require('./encoder');
var solr = require('solr-client');

var Mapper = function(options) {
	this.encoder = options.encoder || new Encoder();
	this.client = solr.createClient({
		core: 'dictionary'
	});
};


Mapper.prototype = {
	input: function(word) {
		var sdr = this.encoder.encode(word);

		this.client.add({
			word: word,
			sdr: sdr
		}, function(err, res) {
			if (err) {
				console.log(err);
			}
			else {
			 	console.log('res', word, sdr.join(' '), res);
			}
		});
		this.client.commit();
		return sdr;
	},
	translate: function(sdr, cb) {
		var searching = sdr.join(' ');
		cb = cb || function(err, result) {
			if (err) {
				return console.error(err);
			}
			if (result.response.numFound) {
				console.log(result.response.docs[0]);
			}
			else {
				console.log('NO CLUE', result);
			}
		};
		//console.log('searching', searching);
		if (searching == '') {
			searching = '-1';
		}
		console.log('searching', searching);
		this.client.search('q=sdr:(' + encodeURIComponent(searching) + ')', cb);
	}
};

module.exports = Mapper;
