'use strict';

var Synapse = require('./spatial-pooler-synapse');

var Segment = function(options) {
	this.medianSynapses = options && options.mediaSynapses;
	this._initSynapses(options && options.synapses);
};

Segment.prototype = {
	_initSynapses: function(synapses) {
		var i;
		var numSynapses;
		if (!synapses) {
			numSynapses = this.mediaSynapses + Math.floor(Math.random() * 10);
			for (i = 0; i < numSynapses; i++) {
				synapses.push(new Synapse());
			}
		}
		this.synapses = synapses;
	},

	getActiveSynapses: function(input) {
		return this.synapses.reduce(function(sum, synapse) {
			return sum + (synapse.isActive(input) ? 1 : 0);
		}, 0);
	},
	getConnectedSynapses: function(input) {
		return this.synapses.reduce(function(sum, synapse) {
			return sum + (synapse.isConnected(input) ? 1 : 0);
		}, 0);
	}
};

module.exports = Segment;
