'use strict';
var tick = 0;
var steps = 3; // total number of time steps
module.exports = {
	getTick: function() {
		return tick;
	},
	getNextTick: function() {
		return (tick + 1) % steps;
	},
	getPreviousTick: function() {
		return (tick - 1) % steps;
	},
	increment: function() {
		tick = this.getNextTick();
	}
};
