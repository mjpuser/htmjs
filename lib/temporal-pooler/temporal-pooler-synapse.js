'use strict';

var Synapse = function(options) {
	this.segment = options.segment;
	this.permanence = (options.permanence || Synapse.PERMANENCE_THRESHOLD) + (Math.random() / 10);
};

Synapse.prototype = {
	isConnected: function() {
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	pulse: function() {
		this.segment.pulse();
	}

};

module.exports = Synapse;
