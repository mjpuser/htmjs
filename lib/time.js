'use strict';
var tick = 0;
var steps = 2; // total number of time steps
var time = [];
var dimensions = [
	'predictiveCells',
	'predictedColumns',
	'activeSegments',
	'activeColumnSet',
	'activeCells',
	'warmCells',
	'sequenceSegment',
	'learningSegments',
	'activeSynapses',
	'reassignedSynapse'
];
module.exports = {
	addDimension: function(dimension) {
		dimensions.push(dimension);
	},
	getOldestStep: function() {
		return this.getStep(time.length - 3);
	},
	getPreviousStep: function() {
		return this.getStep(time.length - 2);
	},
	getCurrentStep: function() {
		return this.getStep(time.length - 1);
	},
	getStep: function(t) {
		if (t < 0) {
			return this.getDimension();
		}
		return time[Math.max(0, Math.min(steps - 1, t || tick))];
	},
	getTick: function() {
		return tick;
	},
	getTime: function() {
		return time;
	},
	increment: function() {
		time.push(this.getDimension());
		if (time.length > steps) {
			time.shift();
		}
	},
	getDimension: function() {
		var dimension = {};
		dimensions.forEach(function(d) {
			dimension[d] = new Set();
		});
		dimension.connectedImpulses = {}; // segmentId -> count
		dimension.winningCells = {};
		dimension.activeCellList = [];
		dimension.activeColumns = [];
		return dimension;
	}
};
