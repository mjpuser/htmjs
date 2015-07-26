'use strict';
var time = require('../time');
var STATES = {
	active: 'active',
	inactive: 'inactive'
};
var Cell = function(options) {
	this.columnId = options.columnId;
	this.states = []; // indexed by tick (circular index so it doesn't grow crazy)
	this.segments = []; // forward connected segments
	this.onPredict = options.onPredict || Cell.noop;
};

Cell.noop = function() {};

Cell.prototype = {
	markActive: function() {
		this.states[time.getTick()] = STATES.active;
		this.segments.forEach(function(segment) {
			segment.pulse();
		});
	},
	markInactive: function() {
		this.states[time.getTick()] = STATES.inactive;
	},
	markPredictive: function() {
		this.states[time.getNextTick()] = STATES.active;
		this.onPredict();
	},
	isPredictive: function() {
		return this.states[time.getNextTick()] === STATES.active;
	},
	isActive: function() {
		return this.states[time.getTick()] === STATES.active;
	},
	isInactive: function() {
		return this.states[time.getTick()] === STATES.inactive;
	}
};
module.exports = Cell;
