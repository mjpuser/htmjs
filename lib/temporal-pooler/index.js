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
	this.cells = [];
	this.segmentsPerCell = options.segmentsPerCell || 3;
	this.maxDendrites = 25; // used for learning.  A segment to grow up to this number of dendrites

	this.dendritesPerSegment = options.dendritesPerSegment || 20;
	Segment.ACTIVATION_THRESHOLD = 15; //Math.floor(3 / 4 * this.dendritesPerSegment);
	//Segment.LEARNING_THRESHOLD = 4; // 
	//Segment.MIN_THRESHOLD = 10; // remove segment if falls below this.

	this.permanenceDec = options.permanenceDec || 0.008;
	this.permanenceInc = options.permanenceInc || 0.05;

	this._initColumns();
};

TemporalPooler.prototype = {
	_initColumns: function() {
		var column;
		var cell;
		var segments = [];
		var self = this;
		this.columns = [];
		for(var i = 0; i < this.numColumns; i++) {
			column = new Column({
				id: i
			});
			this.columns.push(column);
			for (var k = 0; k < this.cellsPerColumn; k++) {
				cell = new Cell({
					id: this.cells.length,
					columnId: column.id
				});
				column.addCell(cell);
				this.cells.push(cell);
			}
		}
		// create segments
		this.cells.forEach(function(cell) {
			var i;
			for (i = 0; i < this.segmentsPerCell; i++) {
				segments.push(new Segment({
					id: '' + cell.id + i,
					cell: cell
				}));
			}
		}, this);

		// assign input cells (represents dendrites)
		segments.forEach(function(segment) {
			var cellId;
			for (var i = 0; i < this.dendritesPerSegment; i++) {
				cellId = Math.max(Math.floor(Math.random() * this.cells.length));
				if (cellId == segment.cell.id) {
					i--;
					continue;
				}
				this.cells[cellId].synapses.push(new Synapse({
					segment: segment,
					cell: this.cells[cellId]
				}));
			}
		}, this);
	},
	setInput: function(input) {
		this.input = input;
	},
	predict: function() {
		var previousStep;
		var currentStep;
		var inference = sorted([]);

		time.increment();
		previousStep = time.getPreviousStep();
		currentStep = time.getCurrentStep();

		this.input.forEach(function(id) {
			var column = this.columns[id];
			var bottomUpPredicted = false;
			column.cells.forEach(function(cell) {
				var segment;
				if (previousStep.predictiveCells.has(cell)) {
					cell.markActive(currentStep);
				}
			});
			if (!bottomUpPredicted) {
				column.cells.forEach(function(cell) {
					cell.markActive(currentStep);
				});
			}
		}, this);

		currentStep.predictedColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference.toArray();
	},
	predictAndLearn: function() {
		var inference = sorted([]);

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

		this.input.forEach(function(id) {
			var column = self.columns[id];
			var anyCellsPredicted = false;
			column.cells.forEach(function(cell) {
				if (previousStep.predictiveCells.has(cell)) {
					anyCellsPredicted = true;
					cell.markActive();
				}
			});
			if (!anyCellsPredicted) {
				column.cells.forEach(function(cell) {
					cell.markActive();
				});
			}
		});
	},
	predictAndLearnPhase2: function() {
		var currentStep = time.getCurrentStep();
		var previousStep = time.getPreviousStep();
		var self = this;
		var reassigned = 0;

		previousStep.activeSynapses.forEach(function(synapse) {
			var isCorrect = currentStep.activeCells.has(synapse.segment.cell);
			var predictedCell;
			var activeCell;
			var bestMatchingSegment;

			if (isCorrect) {
				synapse.increment(self.permanenceInc);
			}
			else {
				synapse.decrement(self.permanenceDec);
				if (!synapse.isConnected()) {
					predictedCell = currentStep.activeCellList[Math.floor(Math.random() * currentStep.activeCellList.length)];
					if (predictedCell) {
						synapse.removeFromSegment();
						bestMatchingSegment = self.getBestMatchingSegment(predictedCell.segments, currentStep);
						bestMatchingSegment.synapses.push(synapse);
						synapse.segment = bestMatchingSegment;
					}
				}
			}
		});
	},
	getBestMatchingSegment: function(segments, step) {
		var bestMatchingSegment;
		segments.forEach(function(segment) {
			bestMatchingSegment = bestMatchingSegment || segment;
			if (step.connectedImpulses[segment.id] > step.connectedImpulses[bestMatchingSegment.id]) {
				bestMatchingSegment = segment;
			}
		});
		return bestMatchingSegment;
	}
};

module.exports = TemporalPooler;
