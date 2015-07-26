'use strict';

var assert = require('assert');
var is = require('is-js');
var Column = require('./temporal-pooler-column');
var Cell = require('./temporal-pooler-cell');
var Segment = require('./temporal-pooler-segment');
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

	this.predictedCells = [];
	this.activeCells = [];
	this.dendritesPerSegment = options.dendritesPerSegment || 20;
	Segment.THRESHOLD = 2; //Math.floor(3 / 4 * this.dendritesPerSegment);
	this.activeColumns = [];
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
					columnId: column.id,
					onPredict: function() {
						self.activeColumns[time.getTick()].add(this.columnId);
					}
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
				this.cells[cellId].segments.push(segment);
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
		this.activeColumns[time.getPreviousTick()] = new Set();
		activeColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference;
	},
	predictAndLearn: function() {

	}
};

module.exports = TemporalPooler;
