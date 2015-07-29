'use strict';

var time = require('../time');

var Synapse = function(options) {
	this.segment = options.segment;
	this.segment.synapses.push(this);
	this.permanence = (options.permanence || Synapse.PERMANENCE_THRESHOLD) + (parseFloat(Math.random().toFixed(2)) * Math.pow(-1, Math.round(Math.random())));
};

Synapse.prototype = {
	isConnected: function() {
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	pulse: function() {
		var step = time.getCurrentStep();
		var impulses = step.impulses;
		if (this.isConnected()) {
			this.segment.pulse();
		}
		impulses[this.segment.id] = (impulses[this.segment.id] || 0) + 1;
		step.activeSynapses.add(this);
	},
	increment: function(inc) {
		this.permanence = Math.min(1, this.permanence + inc);
	},
	decrement: function(dec) {
		this.permanence = Math.max(0, this.permanence - dec);
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;

module.exports = Synapse;
