'use strict';
var time = require('../time');
var Cell = function(options) {
	this.columnId = options.columnId;
	this.synapses = []; // forward connected segments
	this.segments = [];
	this.learnState = [];
};

Cell.noop = function() {};
Cell.prototype = {
	markActive: function() {
		this.onActive();
		this.synapses.forEach(function(segment) {
			synapse.pulse();
		});
	},
	markPredictive: function() {
		time.getCurrentStep().predictiveCells.add(this);
		time.getNextStep().activeColumns.add(this.columnId);
	},
	markLearn: function() {
		time.getCurrentStep().learningCells.add(this);
	},
	wasPredictive: function() {
		return time.getPreviousStep().predictiveCells.has(this);
	},
	isActive: function() {
		return time.getCurrentStep().activeCells.has(this);
	},
	isInactive: function() {
		return !this.isActive();
	},
	getActiveSegments: function() {
		return this.segments.filter(function(segment) {
			return segment.isActive();
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
