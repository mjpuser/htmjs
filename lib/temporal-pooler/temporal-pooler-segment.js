'use strict';

var time = require('../time');
var STATES = {
	active: 'active',
	inactive: 'inactive'
};


var Segment = function(options) {
	this.id = options.id;
	this.cell = options.cell; // input cell
	this.cell.segments.push(this);
	this.synapses = [];
	this.sequence = false;
};
Segment.noop = function() {};

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
			step.learningSegments.add(this);
		}
	},
	isActive: function() {
		return time.getCurrentStep().activeSegments.has(this);
	},
	markActive: function() {
		time.getCurrentStep().activeSegments.add(this);
	}
};

// number of dendrites to be active in order for segment to be active
Segment.ACTIVATION_THRESHOLD = 6;
Segment.LEARNING_THRESHOLD = 3;

module.exports = Segment;
