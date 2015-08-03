'use strict';
var time = require('../time');
var Cell = function(options) {
	this.id = options.id;
	this.columnId = options.columnId;
	this.synapses = []; // forward connected segments
	this.segments = [];
};

Cell.noop = function() {};

Cell.prototype = {
	markActive: function() {
		var currentStep = time.getCurrentStep();
		this.synapses.forEach(function(synapse) {
			synapse.pulse();
		});
		if (!currentStep.activeCells.has(this)) {
			currentStep.activeCellList.push(this);
			currentStep.activeCells.add(this);

			if (!currentStep.activeColumnSet.has(this.columnId)) {
				currentStep.activeColumns.push(this.columnId);
				currentStep.activeColumnSet.add(this.columnId);
			}
		}
	},
	markPredictive: function() {
		time.getCurrentStep().predictiveCells.add(this);
		time.getCurrentStep().predictedColumns.add(this.columnId);
	},
	isPredictive: function(step) {
		return (step || time.getPreviousStep()).predictiveCells.has(this);
	},
	markAsLearning: function(step) {
		step.learningCells.push(this);
	},
	getActiveSegments: function(step) {
		step = step || time.getCurrentStep();
		return this.segments.filter(function(segment) {
			return step.activeSegments.has(segment);
		});
	}
};

module.exports = Cell;
