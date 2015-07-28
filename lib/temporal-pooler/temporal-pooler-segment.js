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
	this.sequence = false;
};

Segment.prototype = {
	pulse: function() {
		var impulses = time.getCurrentStep().impulses[this.id] || 0;
		impulses = time.getCurrentStep().impulses[this.id] = impulses + 1;
		if (impulses > Segment.THRESHOLD) {
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
	getImpulses: function(step) {
		return (step || time.getCurrentStep()).impulses[this.id] || 0;
	}
};

// number of dendrites to be active in order for segment to be active
Segment.THRESHOLD = 6;

module.exports = Segment;
