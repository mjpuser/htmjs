'use strict';

var Cell = require('./temporal-pooler-cell');
var time = require('../time');

var Column = function(options) {
	this.id = options.id;
	this.cells = [];
};

Column.prototype = {
	_initCells: function(numCells) {
		this.cells = [];
	},
	setInput: function(input) {
		this.input = input;
	},
	// optimize: binary search since input is sorted
	hasFeedForwardInput: function() {
		return this.input.indexOf(this.id);
	},
	addCell: function(cell) {
		this.cells.push(cell);
	},
	getPredictiveCells: function(step) {
		return this.cells.filter(function(cell) {
			return cell.isPredictive(step);
		});
	}
}

module.exports = Column;
