'use strict';

var Segment = require('./spatial-pooler-segment');

var Column = function(options) {
	this.boost = options.boost || 1;
	this.id = options.id; // id or index
	this.segment = options.segment || new Segment({
		location: id
	});
};

Column.prototype = {
	getOverlap: function(input) {
		return this.segment.getActiveSynapses(input);
	}
};

module.exports = Column;
