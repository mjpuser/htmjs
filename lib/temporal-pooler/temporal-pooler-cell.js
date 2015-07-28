'use strict';
var time = require('../time');
var STATES = {
	active: 'active',
	inactive: 'inactive',
	learn: 'learn'
};
var Cell = function(options) {
	this.columnId = options.columnId;
	this.states = []; // indexed by tick (circular index so it doesn't grow crazy)
	this.synapses = []; // forward connected segments
	this.onPredict = options.onPredict || Cell.noop;
	this.segments = [];
	this.learnState = [];
	this.onLearn = options.onLearn || Cell.noop;
};

Cell.noop = function() {};
Cell.prototype = {
	markActive: function() {
		this.states[time.getTick()] = STATES.active;
		this.synapses.forEach(function(segment) {
			synapse.pulse();
		});
	},
	markInactive: function() {
		this.states[time.getTick()] = STATES.inactive;
	},
	markPredictive: function() {
		this.states[time.getNextTick()] = STATES.active;
		this.onPredict();
	},
	markLearn: function() {
		this.states[time.getTick()] = STATES.learn;
	},
	isPredictive: function() {
		return this.states[time.getNextTick()] === STATES.active;
	},
	isActive: function(tick) {
		return this.states[tick || time.getTick()] === STATES.active;
	},
	isInactive: function(tick) {
		return this.states[tick || time.getTick()] === STATES.inactive;
	},
	getActiveSegments: function(tick) {
		return this.segments.filter(function(segment) {
			return segment.isActive(tick);
		});
	},
	isLearn: function(tick) {
		return this.learnStates[tick || time.getTick()];
	},
	unlearn: function(tick) {
		return this.learnStates[tick] = false;
	},
	learn: function(tick) {
		this.learnStates[tick || time.getTick()] = true;
		this.onLearn();
	},
	getActiveSegment: function(tick) {
		var segments;
		tick = tick || time.getTick();
		segments = this.getActiveSegments(tick);
		segments.sort(function(a, b) {
			if (a.sequence) {
				return 1;
			}
			else if (b.sequence) {
				return -1;
			}
			else if (a.getImpulse(tick) > b.getImpulse(tick)) {
				return 1;
			}
			else if (a.getImpulse(tick) < b.getImpulse(tick)) {
				return -1;
			}
			return 0;
		});
		return segments[0];
	}
};
module.exports = Cell;
