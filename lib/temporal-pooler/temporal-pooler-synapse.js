'use strict';

var time = require('../time');

var Synapse = function(options) {
	this.segment = options.segment;
	this.segment.synapses.push(this);
	this.cell = options.cell;
	this.permanence = (options.permanence || Synapse.PERMANENCE_THRESHOLD);
};

Synapse.prototype = {
	isConnected: function() {
		return this.permanence >= Synapse.PERMANENCE_THRESHOLD;
	},
	pulse: function() {
		if (this.isConnected()) {
			this.segment.pulse();
		}
		time.getCurrentStep().activeSynapses.add(this);
	},
	increment: function(inc) {
		this.tempPermanence = Math.min(1, this.permanence + inc);
	},
	decrement: function(dec) {
		this.tempPermanence = Math.max(0, this.permanence - dec);
	},
	reinforce: function(previousStep, currentStep) {
		var index;
		if (this.tempPermanence) {
			this.permanence = Math.max(0, Math.min(1, this.tempPermanence));
		}
		//console.log('perm', this.permanence);
		if (this.permanence < Synapse.MIN_THRESHOLD) {
			console.log('removing----------------------------------')
			index = this.segment.synapses.indexOf(this);
			this.segment.synapses.splice(index, 1);
			index = this.cell.synapses.indexOf(this);
			this.cell.synapses.splice(index, 1);
		}
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;
Synapse.MIN_THRESHOLD = 0.001;

module.exports = Synapse;
