'use strict';

var Cell = function(options) {
	// for temporal pooler, there are segments for cells
	// for spatial pooler, there are shared segments via columns
	this.segments = []; // about   Can be configurable.  Connects to other cells.
	this.id = options.id; // 
	this.sdr = [];
};

Cell.prototype = {
	setInput: function(sdr) {
		this.sdr = sdr;
	},
	isActive: function() {
		return this._isFFactive() || this._isLIactive();
	},
	_isFFactive: function() {
		return ~this.sdr.indexOf(this.id);
	},
	_isLIactive: function() {
		return this.segments.reduce(function(sum, segment) {

		}, 0);
	}
};

module.exports = Cell;
