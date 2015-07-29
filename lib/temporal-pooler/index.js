'use strict';

var assert = require('assert');
var is = require('is-js');
var Column = require('./temporal-pooler-column');
var Cell = require('./temporal-pooler-cell');
var Segment = require('./temporal-pooler-segment');
var Synapse = require('./temporal-pooler-synapse');
var SegmentUpdate = require('./segment-update');
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
	this.segmentsPerCell = options.segmentsPerCell || 1;
	this.maxDendrites = 20; // used for learning.  A segment to grow up to this number of dendrites

	this.dendritesPerSegment = options.dendritesPerSegment || 10;
	Segment.THRESHOLD = 2; //Math.floor(3 / 4 * this.dendritesPerSegment);
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
					id: '' + cell.id + i;
					cell: cell
				}));
			}
		}, this);

		// assign input cells (represents dendrites)
		segments.forEach(function(segment) {
			var cellId;
			for (var i = 0; i < this.dendritesPerSegment; i++) {
				cellId = Math.floor(Math.random() * this.cells.length);
				if (cellId == segment.cell.id) {
					i--;
					continue;
				}
				this.cells[cellId].synapses.push(new Synapse({
					segment: segment
				}));
			}
		}, this);
	},
	setInput: function(input) {
		this.input = input;
	},
	predict: function() {
		time.increment();
/*
		// get current active columns (these were predicted)
		activeColumns = this.activeColumns[time.getTick()] || new Set();
		this.activeColumns[time.getTick()] = activeColumns;

		this.input.forEach(function(id) {
			var column = this.columns[id];
			var predictedCells = column.getActiveCells();
			if (!predictedCells.length) {
				column.cells.forEach(function(cell) {
					cell.markActive();
				});
				activeColumns.add(id);
			}
		}, this);
		activeColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference;
		*/
	},
	predictAndLearn: function() {
		var segmentUpdateList;

		time.increment();
		
		segmentUpdateList = this.predictAndLearnPhase1();
		this.predictAndLearnPhase2(segmentUpdateList);

		return inference;
	},
	predictAndLearnPhase1: function() {
		this.input.forEach(function(id) {
			var column = this.columns[id];
			var previousStep = time.getPreviousStep();
			var currentStep = time.getCurrentStep();
			var predictiveCells = column.getPredictiveCells(previousStep);
			var bottomUpPredicted = false;
			var chosen = false;
			var bestMatchingCell;
			var bestMatchingSegment;
			var segmentUpdateList = [];
			var segmentUpdate;

			predictedCells.forEach(function(cell) {
				var segment = cell.getActiveSegment(previousStep);
				if (segment.sequence) {
					bottomUpPredicted = true;
					currentStep.activeSegments.add(segment);
					if (previousStep.learningSegments.has(segment)) {
						chosen = true;
						currentStep.learningCells.push(cell);
					}
				}
			});

			if (!bottomUpPredicted) {
				column.cells.forEach(function(cell) {
					currentStep.activeCells.push(cell);
				});
			}
			if (!chosen) {
				bestMatchingCell = this.getBestMatchingCell(column, previousStep);
				currentStep.learningCells.add(bestMatchingCell);
				bestMatchingSegment = this.getBestMatchingSegment(cell.segments, previousStep);
				segmentUpdate = this.getSegmentUpdate(bestMatchingSegment, previousStep, true);
				segmentUpdate.sequenceSegment = true;
				segmentUpdateList.push(segmentUpdate);
			}
		}, this);
	},
	predictAndLearnPhase2: function(segmentUpdateList) {
		time.activeSegments.forEach(function(segment) {
			var currentStep = time.getCurrentStep();
			var previousStep = time.getPreviousStep();
			var activeUpdate;
			var predictiveSegment;
			var predictiveUpdate;
			currentStep.predictiveCells.add(segment.cell);
			activeUpdate = this.getSegmentUpdate(segment, currentStep, false);
			predictiveSegment = this.getBestMatchingSegment(segment.cell.segments, previousStep);
			predictiveUpdate = this.getSegmentUpdate(predictiveSegment, previousStep, true);
			segmentUpdateList.push(activeUpdate);
			segmentUpdateList.push(predictiveUpdate);
		}, this);
	},
	getBestMatchingCell: function(column, step) {
		var bestMatchingSegment = null;
		var bestMatchingCell = null;
		var segments = [];
		column.cells.forEach(function(cell) {
			segments = segments.concat(cell.segments);
		});
		bestMatchingSegment = this.getBestMatchingSegment(segments, step);
		if (bestMatchingSegment) {
			bestMatchingCell = bestMatchingSegment.cell;
		}
		else {
			column.cells.forEach(function(cell) {
				bestMatchingCell = bestMatchingCell || cell;
				if (cell.segments.length < bestMatchingCell.segments.length) {
					bestMatchingCell = cell;
				}
			});
		}
		return bestMatchingCell;
	},
	getBestMatchingSegment: function(segments, step) {
		var bestMatchingSegment;
		segments.forEach(function(segment) {
			bestMatchingSegment = bestMatchingSegment || segment;
			if (step.impulses[segment.id] > step.impulses[bestMatchingSegment.id]) {
				bestMatchingSegment = segment;
			}
		});

		if (!step.learningSegment.has(bestMatchingSegment)) {
			return null;
		}
		return bestMatchingSegment;
	},
	getSegmentUpdate: function(segment, step, newSynapses) {
		var segmentUpdate = new SegmentUpdate();
		var activeSynapses;
		var totalLearningCells = step.learningCells.length;
		newSynapses = newSynapses || false;

		activeSynapses = segment.synapses.filter(function(synapse) {
			return step.activeSynapses.has(synapse);
		});

		while (newSynapses && this.maxDendrites - activeSynapses.length > 0 && totalLearningCells > 1) {
			var learningCell = step.learningCells[Math.floor(Math.random() * totalLearningCells)];
			if (learningCell.id != segment.cell.id) {
				activeSynapses.push(learningCell);
			}
		}
		segmentUpdate.activeSynapses = activeSynapses;
		segmentUpdate.segmentIndex = segment.id;
		return segmentUpdate;
	}
};

module.exports = TemporalPooler;
