'use strict';
var time = require('../time');
var Segment = require('./temporal-pooler-segment');
var Synapse = require('./temporal-pooler-synapse');
var id = 0;
var Cell = function(options) {
	this.id = options.id || id++;
	this.column = options.column;
	this.column.cells.push(this);
	this.synapses = []; // forward connected segments
	this.segments = [];
};

Cell.noop = function() {};

Cell.prototype = {
	markActive: function(step) {
		this.synapses.forEach(function(synapse) {
			synapse.pulse();
		});
		step.activeCells.add(this);
		if (!step.activeColumnSet.has(this.column.id)) {
			step.activeColumns.push(this.column.id);
			step.activeColumnSet.add(this.column.id);
		}
	},
	markPredictive: function() {
		time.getCurrentStep().predictiveCells.add(this);
		time.getCurrentStep().predictedColumns.add(this.column.id);
	},
	markUnpredicted: function(step) {
		// weaker pulse from unpredicted inputs
		this.synapses.forEach(function(synapse) {
			if (Math.round(Math.random())) {
				synapse.pulse();
			}
		});
		step.unpredictedCells.add(this);
		if (!step.activeColumnSet.has(this.column.id)) {
			step.activeColumns.push(this.column.id);
			step.activeColumnSet.add(this.column.id);
		}
	},
	getActiveSegments: function(step) {
		step = step || time.getCurrentStep();
		return this.segments.filter(function(segment) {
			return step.activeSegments.has(segment);
		});
	},
	connect: function(cell, numSynapses) {
		var segment = new Segment({
			cell: this
		});
		numSynapses = numSynapses || 20;
		for (var i = 0; i < numSynapses; i++) {
			new Synapse({
				cell: cell,
				segment: segment
			});
		}
	}
};

module.exports = Cell;
