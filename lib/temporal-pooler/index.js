'use strict';

var assert = require('assert');
var is = require('is-js');
var Column = require('./temporal-pooler-column');
var Cell = require('./temporal-pooler-cell');
var Segment = require('./temporal-pooler-segment');
var Synapse = require('./temporal-pooler-synapse');
var time = require('../time');

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

	this.dendritesPerSegment = options.dendritesPerSegment || 20;
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
					cell: cell,
					onActive: function() {
						self.activeSegments[time.getTick()].add(this);
					}
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
		var activeColumns;
		var inference = [];

		time.increment();

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
	},
	predictAndLearn: function() {
		time.increment();

		// get current active columns (these were predicted)
		activeColumns = this.activeColumns[time.getTick()] || new Set();
		this.activeColumns[time.getTick()] = activeColumns;

		this.input.forEach(function(id) {
			var column = this.columns[id];
			var predictedCells = column.getActiveCells();
			predictedCells.forEach(function(cell) {
				var segment = cell.getActiveSegment(time.getPreviousTick());
				if (segment.sequence) {
					cell.learn();
				}
			});
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

		this.learnCells[time.getPreviousTick()].forEach(function(cell) {
			cell.unlearn(time.getPreviousTick());
		});
		return inference;
	}
};

module.exports = TemporalPooler;
