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
	this.maxDendritesPerSegment = 30; // used for learning.  A segment to grow up to this number of dendrites

	Segment.ACTIVATION_THRESHOLD = 10; //Math.floor(3 / 4 * this.dendritesPerSegment);
	Segment.LEARNING_THRESHOLD = 8; // 
	Segment.MIN_THRESHOLD = 3; // remove segment if falls below this.

	this.dendriteSpan = options.dendriteSpan || 20;
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

		time.getCurrentStep().predictedColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference.toArray();
	},
	predictAndLearn: function() {
		// learn
		time.increment();
		this.predictAndLearnPhase1();
		this.predictAndLearnPhase2();
		this.predictAndLearnPhase3();
		this.predictAndLearnPhase4();
		return this.predict();
	},

	predictAndLearnPhase1: function() {
		var self = this;
		var previous = time.getPreviousStep();
		var current = time.getCurrentStep();
		this.input.forEach(function(id) {
			var column = self.columns[id];
			column.cells.forEach(function(cell) {
				if (previous.predictiveCells.has(cell)) {
					cell.markActive(current);
				}
			});
			if (!current.activeColumnSet.has(id)) {
				column.cells.forEach(function(cell) {
					cell.markUnpredicted(current);
				});
			}
		});
	},
	// maps column ids to activated columns that are within range.
	predictAndLearnPhase2: function() {
		var self = this;
		var current = time.getCurrentStep();
		var previous = time.getPreviousStep();
		this.inputRange = [];

		this.input.forEach(function(id) {
			var i;
			var values;
			var start = Math.max(0, id - self.dendriteSpan);
			var end = Math.min(id + self.dendriteSpan, self.columns.length);
			var column = self.columns[id];
			var activeCell = self.pick(column.getActiveCells(current));
			var newCell = self.pick(column.getCellsWithNoSegments());
			if (newCell && newCell.segments.length >= self.maxSegmentsPerCell) {
				newCell = null;
			}
			if (activeCell && activeCell.segments.length >= self.maxSegmentsPerCell) {
				activeCell = null;
			}
			if (newCell || activeCell) {
				for (i = start; i < end; i++) {
					values = self.inputRange[i] || new Set();
					if (newCell) {
						values.add(newCell);
					}
					if (activeCell) {
						values.add(activeCell);
						current.chosenCells.add(activeCell)
					}
					else if (newCell) {
						current.chosenCells.add(newCell);
					}
					self.inputRange[i] = values;
				}
			}
		});
	},
	// find cell mates
	predictAndLearnPhase3: function() {
		var previous = time.getPreviousStep();
		var self = this;
		previous.chosenCells.forEach(function(chosenCell) {
			var range = self.inputRange[chosenCell.column.id];
			if (range) {
				range.forEach(function(cell) {
					if (cell !== chosenCell) {
						cell.connect(chosenCell, Math.floor(self.maxDendritesPerSegment / range.size));
					}
				});
			}
		});
	},
	// weaken wrong guess
	predictAndLearnPhase4: function() {
		var previous = time.getPreviousStep();
		var current = time.getCurrentStep();
		var self = this;
		previous.predictiveCells.forEach(function(cell) {
			if (!current.activeCells.has(cell)) {
				cell.getActiveSegments(previous).forEach(function(seg) {
					seg.decrement(self.permanenceDec);
				});
			}
			else {
				cell.getActiveSegments(previous).forEach(function(seg) {
					seg.increment(self.permanenceInc);
				});
			}
		});
	},
	pick: function(list) {
		return list[Math.floor(Math.random() * list.length)];
	}
};

module.exports = TemporalPooler;
