'use strict';

var time = require('../time');
var id = 1;
var Segment = function(options) {
	this.id = options.id || id++;
	this.cell = options.cell; // input cell
	this.cell.segments.push(this);
	this.synapses = [];
};
Segment.noop = function() {};

Segment.prototype = {
	pulse: function() {
		var step = time.getCurrentStep();
		var impulses = step.connectedImpulses[this.id] || 0;
		impulses = step.connectedImpulses[this.id] = impulses + 1;
		if (impulses >= Segment.ACTIVATION_THRESHOLD) {
			this.markActive();
			this.cell.markPredictive();
		}
	},
	isActive: function() {
		return time.getCurrentStep().activeSegments.has(this);
	},
	markActive: function() {
		time.getCurrentStep().activeSegments.add(this);
	},
	kill: function() {
		var index;
		this.synapses.forEach(function(synapse) {
			synapse.kill();
		});
		index = this.cell.segments.indexOf(this);
		this.cell.segments.splice(index, 1);
	},
	isDying: function() {
		this.synapses.length <= Segment.MIN_THRESHOLD;
	},
	decrement: function(dec) {
		this.synapses.forEach(function(synapse) {
			synapse.decrement(dec);
		});
	},
	increment: function(inc) {
		this.synapses.forEach(function(synapse) {
			synapse.increment(inc);
		});
	}
};

// number of dendrites to be active in order for segment to be active
Segment.ACTIVATION_THRESHOLD = 15;
Segment.LEARNING_THRESHOLD = 8;
Segment.MIN_THRESHOLD = 3;

module.exports = Segment;
