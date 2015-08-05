'use strict';

var assert = require('assert');
var is = require('is-js');
var Column = require('./temporal-pooler-column');
var Cell = require('./temporal-pooler-cell');
var Segment = require('./temporal-pooler-segment');
var Synapse = require('./temporal-pooler-synapse');
var time = require('../time');
var sorted = require('sorted');

var TemporalPooler = function(options) {
	// number of columns
	this.numColumns = options.columns;
	assert.ok(is.number(this.numColumns) && this.numColumns > 0, 'columns must be a number > 0');

	// number of cells per column
	var cellsPerColumn = options.cellsPerColumn;
	assert.ok(is.number(cellsPerColumn) && cellsPerColumn > 0, 'cellsPerColumn must be a number > 0');
	this.cellsPerColumn = cellsPerColumn;
	this.maxSegmentsPerCell = options.maxSegmentsPerCell || 3;
	this.maxDendritesPerSegment = 20; // used for learning.  A segment to grow up to this number of dendrites

	Segment.ACTIVATION_THRESHOLD = 10; //Math.floor(3 / 4 * this.dendritesPerSegment);
	Segment.LEARNING_THRESHOLD = 8; // 
	Segment.MIN_THRESHOLD = 3; // remove segment if falls below this.

	this.dendriteSpan = 20;
	this.permanenceDec = options.permanenceDec || 0.008;
	this.permanenceInc = options.permanenceInc || 0.05;

	this._initColumns();
};

TemporalPooler.prototype = {
	_initColumns: function() {
		var column;
		var cell;
		this.columns = [];
		for(var i = 0; i < this.numColumns; i++) {
			column = new Column({
				id: i
			});
			this.columns.push(column);
			for (var k = 0; k < this.cellsPerColumn; k++) {
				cell = new Cell({
					column: column
				});
			}
		}
	},
	setInput: function(input) {
		this.input = input;
	},
	predict: function() {
		var inference = sorted([]);

		time.increment();
		this.predictAndLearnPhase1();

		time.getCurrentStep().predictedColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference.toArray();
	},
	predictAndLearn: function() {
		var inference = sorted([]);
		var self = this;
		var currentStep = time.getCurrentStep();
		time.increment();
		this.predictAndLearnPhase1();
		this.predictAndLearnPhase2();

		time.getCurrentStep().predictedColumns.forEach(function(id) {
			inference.push(id);
		});

		return inference.toArray();
	},
	predictAndLearnPhase1: function() {
		var self = this;
		var previousStep = time.getPreviousStep();
		var cellsPerColumnRightList = [];


		this.input.forEach(function(id) {
			var cellsPerColumnRight = 0;
			var column = self.columns[id];
			var anyCellsPredicted = false;
			column.cells.forEach(function(cell) {
				if (previousStep.predictiveCells.has(cell)) {
					anyCellsPredicted = true;
					cell.markActive();
					cellsPerColumnRight++;
					cellsPerColumnRightList.push(cell.id % self.cellsPerColumn);
				}
			});
			if (!anyCellsPredicted) {
				column.cells.forEach(function(cell) {
					cell.markActive();
				});
			}
		});
		console.log(cellsPerColumnRightList.toString());
	},
	predictAndLearnPhase2: function() {
		var currentStep = time.getCurrentStep();
		var previousStep = time.getPreviousStep();
		var self = this;

		previousStep.activeCells.forEach(function(cell) {
			cell.synapses.forEach(function(synapse) {
				var isCorrect = currentStep.activeCells.has(synapse.segment.cell);
				var segments;
				var bestMatchingSegment;
				var segment;

				if (isCorrect) {
					synapse.increment(self.permanenceInc);
				}
				else {
					synapse.decrement(self.permanenceDec);
					if (!synapse.isConnected()) {
						segments = self.getActivatedColumnSegments(currentStep);
						if (segments.length) {
							segment = synapse.segment;
							if (!segment.learning && !segment.active) {
								bestMatchingSegment = self.getBestMatchingSegment(segments, currentStep);
								if (bestMatchingSegment) {
									synapse.removeFromSegment();
									bestMatchingSegment.synapses.push(synapse);
									synapse.segment = bestMatchingSegment;
									synapse.segment.learning = true;
								}
							}
						}
					}
					else if (synapse.isDying()) {
						synapse.kill();
					}
				}
			});
		});
	},
	getBestMatchingSegment: function(segments, step) {
		var bestMatchingSegment;
		var self = this;
		segments.forEach(function(segment) {
			bestMatchingSegment = bestMatchingSegment || segment;
			var bestImpulses = step.connectedImpulses[bestMatchingSegment.id];
			var theseImpulses = step.connectedImpulses[segment.id];
			if (
				((segment.learning && bestMatchingSegment.learning && theseImpulses >= bestImpulses) ||
				(!bestMatchingSegment.learning && segment.learning) ||
				(theseImpulses >= bestImpulses)) &&
				segment.synapses.length < self.maxDendrites
			) {
				bestMatchingSegment = segment;
			}
		});
		if (bestMatchingSegment.active || bestMatchingSegment.synapses.length > self.maxDendrites) {
			return null;
		}
		return bestMatchingSegment;
	},
	getActivatedColumnSegments: function(step) {
		var columnId = step.activeColumns[Math.floor(Math.random() * step.activeColumns.length)];
		var cell = step.winningCells[columnId];
		var cells;

		if (!cell) {
			cells = this.columns[columnId].getActiveCells(step);
			cell = step.winningCells[columnId] = cells[Math.floor(Math.random() * cells.length)];
		}
		return cell.segments;
	}
};

module.exports = TemporalPooler;
