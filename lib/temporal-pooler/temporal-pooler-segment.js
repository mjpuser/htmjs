'use strict';

var time = require('../time');
var STATES = {
	active: 'active',
	inactive: 'inactive'
};

Segment.noop = function() {};

var Segment = function(options) {
	this.id = options.id;
	this.cell = options.cell; // input cell
	cell.segments.push(this);
	this.synapses = [];
};

Segment.prototype = {
	pulse: function() {
		var step = time.getCurrentStep();
		var impulses = step.connectedImpulses[this.id] || 0;
		impulses = step.connectedImpulses[this.id] = impulses + 1;
		if (impulses > Segment.ACTIVATION_THRESHOLD) {
			this.markActive();
			this.cell.markPredictive();
		}
		else if (impulses > Segment.LEARNING_THRESHOLD) {
			this.learningSegments.add(this);
		}
	},
	isActive: function() {
		return time.getCurrentStep().activeSegments.has(this);
	},
	markActive: function() {
		time.getCurrentStep().activeSegments.add(this);
	},
	getImpulses: function(step) {
		return (step || time.getCurrentStep()).impulses[this.id] || 0;
	}
};

// number of dendrites to be active in order for segment to be active
Segment.ACTIVATION_THRESHOLD = 6;
Segment.LEARNING_THRESHOLD = 3;

module.exports = Segment;
