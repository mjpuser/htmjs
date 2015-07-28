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
		this.synapses.forEach(function(segment) {
			synapse.pulse();
		});
	},
	markPredictive: function() {
		time.getCurrentStep().predictiveCells.add(this);
	},
	isPredictive: function(step) {
		return (step || time.getPreviousStep()).predictiveCells.has(this);
	},
	getActiveSegments: function(step) {
		step = step || time.getCurrentStep();
		return this.segments.filter(function(segment) {
			return step.activeSegments.has(segment);
		});
	},
	getActiveSegment: function(step) {
		var segments;
		step = step || time.getCurrentStep();
		segments = this.getActiveSegments(step);
		segments.sort(function(a, b) {
			if (a.sequence) {
				return 1;
			}
			else if (b.sequence) {
				return -1;
			}
			else if (a.getImpulses(step) > b.getImpulses(step)) {
				return 1;
			}
			else if (a.getImpulses(step) < b.getImpulses(step)) {
				return -1;
			}
			return 0;
		});
		return segments[0];
	}
};
module.exports = Cell;
