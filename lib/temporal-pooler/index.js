'use strict';

var assert = require('assert');
var is = require('is-js');

var TemporalPooler = function(options) {
	// number of columns
	var columns = options.columns;
	assert.equal(is.number(columns) && columns > 0, 'columns must be a number > 0');

	// number of cells per column
	var cellsPerColumn = options.cellsPerColumn;
	assert.equal(is.number(cellsPerColumn) && cellsPerColumn > 0, 'cellsPerColumn must be a number > 0');
	
};

module.exports = TemporalPooler;
