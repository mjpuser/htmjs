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
		this.permanence = Math.min(1, this.permanence + inc);
	},
	decrement: function(dec) {
		this.permanence = Math.max(0, this.permanence - dec);
	},
	isDying: function() {
		return this.permanence <= Synapse.MIN_THRESHOLD;
	},
	kill: function() {
		var index = this.cell.synapses.indexOf(this);
		this.cell.synapses.splice(index, 1);
		this.removeFromSegment();
	},
	removeFromSegment: function() {
		var index = this.segment.synapses.indexOf(this);
		this.segment.synapses.splice(index, 1);
	}
};

Synapse.PERMANENCE_THRESHOLD = 0.5;
Synapse.MIN_THRESHOLD = 0.4;

module.exports = Synapse;
