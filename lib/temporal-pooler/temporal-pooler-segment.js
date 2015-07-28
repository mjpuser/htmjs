'use strict';

var time = require('../time');
var STATES = {
	active: 'active',
	inactive: 'inactive'
};

Segment.noop = function() {};

var Segment = function(options) {
	this.cell = options.cell; // input cell
	this.impulses = []; // time dimension field
	this.states = []; // time dimension
	this.onActive = options.onActive || Segment.noop;
	cell.segments.push(this);
	this.sequence = false;
};

Segment.prototype = {
	pulse: function() {
		var impulses = this.impulses[time.getTick()] = this.impulses[time.getTick()] || 0;
		impulses++;
		if (impulses > Segment.THRESHOLD) {
			this.cell.markPredictive();
			this.states[time.getTick()] = STATES.active;
			this.onActive();
		}
	},
	isActive: function(tick) {
		return this.states[tick || time.getTick()] == STATES.active;
	},
	markActive: function(tick) {
		this.states[tick || time.getTick()] = STATES.active;
	},
	markInactive: function(tick) {
		this.states[tick || time.getTick()] = STATES.inactive;
	},
	getImpulses: function(tick) {
		return this.impulses[tick || time.getTick()];
	}
};

// number of dendrites to be active in order for segment to be active
Segment.THRESHOLD = 6;

module.exports = Segment;
