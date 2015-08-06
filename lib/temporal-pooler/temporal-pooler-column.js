'use strict';

var Cell = require('./temporal-pooler-cell');
var time = require('../time');

var Column = function(options) {
	this.id = options.id;
	this.cells = [];
};

Column.prototype = {
	addCell: function(cell) {
		this.cells.push(cell);
	},
	getActiveCells: function(step) {
		return this.cells.filter(function(cell) {
			return step.activeCells.has(cell);
		});
	},
	getCellsWithNoSegments: function() {
		return this.cells.filter(function(cell) {
			return cell.segments.length === 0;
		});
	},
	getLearnedCells: function() {
		return this.cells.filter(function(cell) {
			return cell.synapses.length > 0;
		});
	},
	getNewCells: function() {
		return this.cells.filter(function(cell) {
			return cell.synapses.length === 0;
		});
	}
};

module.exports = Column;
