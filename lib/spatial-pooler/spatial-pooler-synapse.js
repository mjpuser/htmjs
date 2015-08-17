'use strict';
var Synapse = function(options) {
	this.id = options.id; // id of input synapse is assigned to
	// assign a initial permanence close to the threshold to allow 
	// synapses to connect or disconnect after a small number of iterations
	// 
	this.permanence = Math.max(0, Math.min(1, options.permanence || (Synapse.PERMANENCE_THRESHOLD + (Math.random() - 0.25))));
	this.segment = options.segment;
};

Synapse.prototype = {
	isConnected: function() {
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	isActive: function(input, step) {
		return this.isConnected() && input[this.id] == 1;
	},
	learn: function(input, inc, dec) {
		if (this.isActive(input)) {
			this.permanence = Math.min(1, this.permanence + inc);
		}
		else {
			this.permanence = Math.max(0, this.permanence - dec);
		}
	},
	increasePermanence: function(inc) {
		this.permanence += inc;
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;

module.exports = Synapse;
