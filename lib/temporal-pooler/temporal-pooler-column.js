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
		return this.cells.reduce(function(active, cell) {
			if (step.activeCells.has(cell)) {
				active.push(cell);
			}
			return active;
		}, []);
	}
};

module.exports = Column;
