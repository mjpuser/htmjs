'use strict';

var Segment = require('./spatial-pooler-segment');

var Column = function(options) {
	this.boost = options.boost || 1;
	this.id = options.id; // id or index
	this.period = options.period || 1000;
	this.segment = options.segment || new Segment({
		columnId: this.id,
		medianSynapses: options.medianSynapses,
		inputLength: options.inputLength
	});
	this.activeCount = 0;
	this.count = 0;
	this.boost = 1;
};

Column.comparator = function(a, b) {
	if (a.id > b.id) {
		return 1;
	}
	else if (a.id < b.id) {
		return -1;
	}
	return 0;
};
Column.overlapComparator = function(a, b) {
	if (a.overlap > b.overlap) {
		return -1;
	}
	else if (a.overlap < b.overlap) {
		return 1;
	}
	return 0;
};

Column.prototype = {
	getOverlap: function(input) {
		if (!this.overlap) {
			this.overlap = this.segment.getActiveSynapses(input);
		}
		return this.overlap;
	},
	markActive: function() {
		if (this.period > this.activeCount) {
			this.activeCount++;
		}
		this._count();
	},
	markInactive: function() {
		if (0 < this.activeCount && this.count === this.period) {
			this.activeCount--;
		}
		this._count();
	},
	_count: function() {
		if (this.count < this.period) {
			this.count++;
		}
	},
	getDutyCycle: function(period) {
		return this.activeCount / this.period;
	}
};

module.exports = Column;
