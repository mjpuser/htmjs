'use strict';

var Segment = require('./spatial-pooler-segment');

var Column = function(options) {
	this.boost = 1; // dynamically determined by how often a column is active relative to its neighbors.
	this.segment = options.segment;
};

Column.prototype = {
	getOverlap: function(input) {
		return this.boost * this.segment.getActiveSynapses(input);
	}
};

module.exports = Column;
