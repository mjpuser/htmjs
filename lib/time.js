'use strict';
var tick = 0;
var total = 2;
module.exports = {
	getTick: function() {
		return tick;
	},
	getNextTick: function() {
		return (tick + 1) % total;
	},
	getPreviousTick: function() {
		return (tick - 1) % total;
	},
	increment: function() {
		tick = this.getNextTick();
	}
};
