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
		if (!synapses) {
			for (i = 0; i < this.medianSynapses; i++) {
				this.synapses.push(new Synapse({
					id: Math.min(Math.max(0, Math.floor(Math.random() * this.inputLength)), this.inputLength - 1),
					segment: this
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
