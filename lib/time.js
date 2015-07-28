'use strict';
var tick = 0;
var steps = 3; // total number of time steps
var time = [];
var dimensions = [
	'predictiveCells',
	'activeCells',
	'activeSegments',
	'activeColumns',
	'learningCells',
	'learningSegments'
];
module.exports = {
	addDimension: function(dimension) {
		dimensions.push(dimension);
	},
	getPreviousStep: function() {
		if (tick - 1 < 0) {
			return this.getDimension();
		}
		return this.getStep(tick - 1);
	},
	getCurrentStep: function() {
		return this.getStep(tick);
	},
	getNextStep: function() {
		return this.getStep(tick + 1);
	},
	getStep: function(t) {
		return time[Math.max(0, Math.min(steps - 1, t || tick))];
	},
	increment: function() {
		var dimension = this.getDimension();
		if (tick < steps - 1) {
			tick++;
		}
		else {
			time.shift();
		}
		time.push(dimension);
	},
	getDimension: function() {
		var dimension = {};
		dimensions.forEach(function(d) {
			dimension[d] = new Set();
		});
		dimension.impulses = {};
		return dimension;
	}
};
