'use strict';

var Synapse = function(options) {
	this.id = options.id; // id of input synapse is assigned to
	// assign a initial permanence close to the threshold to allow 
	// synapses to connect or disconnect after a small number of iterations
	this.permanence = (options.permanence || Synapse.PERMANENCE_THRESHOLD) + (Math.random() / 10);
	this.active = null;
};

Synapse.prototype = {
	isConnected: function() {
		//console.log(this.id, 'permanence', this.permanence, 'threshold', Synapse.PERMANENCE_THRESHOLD);
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	isActive: function(input) {
		if (this.active === null) {
			this.active = this.isConnected() && input[this.id] === 1;
		}
		return this.active;
	},
	learn: function(inc, dec) {
		if (this.active) {
			this.permanence = Math.min(1, this.permanence + inc);
		}
		else {
			this.permanence = Math.max(0, this.permanence - dec);
		}
	},
	increasePermanence: function() {
		this.permanence += 0.1 * Synapse.PERMANENCE_THRESHOLD;
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;

module.exports = Synapse;
