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
	}
};

module.exports = Column;
