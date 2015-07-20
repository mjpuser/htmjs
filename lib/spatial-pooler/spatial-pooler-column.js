'use strict';

var Segment = require('./spatial-pooler-segment');

var Column = function(options) {
	this.boost = options.boost || 1;
	this.id = options.id; // id or index
    this.period = options.period || 1000;
	this.segment = options.segment || new Segment({
		location: id
	});
    this.activeCount = 0;
};

Column.prototype = {
	getOverlap: function(input) {
        if (!this.overlap) {
            this.overlap = this.segment.getActiveSynapses(input);
        }
		return this.overlap;
	},
    countAsActive: function() {
        if (this.period > this.activeCount) {
            this.activeCount++;
        }
    },
    countAsInactive: function() {
        if (0 < this.activeCount) {
            this.activeCount--;
        }
    },
    getDutyCycle: function(period) {

    }
};

module.exports = Column;
