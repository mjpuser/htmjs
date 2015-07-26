'use strict';

var time = require('../time');

var Segment = function(options) {
	this.cell = options.cell; // input cell
	this.impulses = 0;
	this.tick = time.getTick();
	this.synapses = []; // might
};

Segment.prototype = {
	pulse: function() {
		if (this.tick != time.getTick()) {
			this.tick = time.getTick();
			this.impulses = 0;
		}
		this.impulses++;
		if (this.impulses > Segment.THRESHOLD) {
			this.cell.markPredictive();
		}
	}
};

// number of dendrites to be active in order for segment to be active
Segment.THRESHOLD = 6;

module.exports = Segment;
