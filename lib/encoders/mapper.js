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
	input: function(word, add) {
		var sdr = this.encoder.encode(word);

		this.client.add({
			word: word,
			sdr: sdr
		}, function(err, res) {
			if (err) {
				console.log(err);
			}
			else {
			 	//console.log('res', word, sdr.join(' '), res);
			}
		});
		this.client.commit();
		return sdr;
	},
	translate: function(sdr, cb) {
		var self = this;
		return new Promise(function (resolve, reject) {
			var searching = sdr.join(' ');
			cb = cb || function(err, result) {
				if (err) {
					return reject(err);
				}
				if (result.response.numFound) {
					resolve(result.response.docs[0]);
				}
				else {
					resolve({ word: '?', sdr: [ -1 ]});
				}
			};
			if (searching == '') {
				searching = '-1';
			}
			self.client.search('q=sdr:(' + encodeURIComponent(searching) + ')', cb);
		});
	}
};

module.exports = Mapper;
