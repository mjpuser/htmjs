'use strict';

var Synapse = require('./spatial-pooler-synapse');

var Segment = function(options) {
	this.columnId = options.columnId;
	this.medianSynapses = options && options.medianSynapses || 15;
	this.span = this.medianSynapses * 3;
	this.inputLength = options.inputLength;
	this.synapses = [];
	this._initSynapses(options && options.synapses);
};

Segment.prototype = {
	// optimize: move to spatial pooler
	_initSynapses: function(synapses) {
		var i;
		var id;
		var numSynapses;

		if (!synapses) {
			numSynapses = this.medianSynapses + Math.floor(Math.random() * 5) * Math.pow(-1, Math.round(Math.random()));
			for (i = 0; i < numSynapses; i++) {
				id = (this.inputLength / 2)  + (Math.floor(Math.random() * this.span / 2)) - (Math.floor(Math.random() * this.span / 2))

				this.synapses.push(new Synapse({
					id: Math.min(Math.max(0, id), this.inputLength)
				}));
			}
		}
	},

	getActiveSynapses: function(input) {
		return this.synapses.reduce(function(sum, synapse) {
			return sum + (synapse.isActive(input) ? 1 : 0);
		}, 0);
	},
	getConnectedSynapses: function(options) {
		return this.synapses.reduce(function(sum, synapse) {
			sum = sum + (synapse.isConnected() ? 1 : 0);
			if (options && options.clear) {
				synapse.active = null;
			}
			return sum;
		}, 0);
	}
};

module.exports = Segment;
