'use strict';
var tick = 0;
var steps = 3; // total number of time steps
var time = [];
var dimensions = [
	'predictiveCells',
	'predictedColumns',
	'activeSegments',
	'activeColumns',
	'activeCells',
	'sequenceSegment',
	'learningSegments',
	'activeSynapses'
];
module.exports = {
	addDimension: function(dimension) {
		dimensions.push(dimension);
	},
	getPreviousStep: function() {
		return this.getStep(tick - 1);
	},
	getCurrentStep: function() {
		return this.getStep(tick);
	},
	getNextStep: function() {
		return this.getStep(tick + 1);
	},
	getStep: function(t) {
		return time[Math.max(0, Math.min(steps - 1, t || tick))] || this.getDimension();
	},
	increment: function() {
		if (tick < steps - 2) {
			tick++;
			time.push(this.getDimension());
		}
		else if (time.length > steps) {
			time.shift();
		}
		time.push(this.getDimension());
	},
	getDimension: function() {
		var dimension = {};
		dimensions.forEach(function(d) {
			dimension[d] = new Set();
		});
		dimension.connectedImpulses = {}; // segmentId -> count
		dimension.activeCellList = [];
		return dimension;
	}
};
