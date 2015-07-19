'use strict';

var Synapse = function(options) {
	this.id = options.id; // id of input synapse is assigned to
	// assign a initial permanence close to the threshold to allow 
	// synapses to connect or disconnect after a small number of iterations
	this.permanence = (options.permanence || Synapse.PERMANENCE_THRESHOLD) + (Math.random() / 10);
};

Synapse.prototype = {
	isConnected: function() {
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	isActive: function(input) {
		return this.isConnected() && ~input.indexOf(this.id);
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;

module.exports = Synapse;
