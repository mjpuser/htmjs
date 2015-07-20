'use strict';

var Column = require('./spatial-pooler-column');

var SpatialPooler = function(options) {
	// options.columns has to be a number
	this.columns = null;
	this._initColumns(options.columns); // could be a circular array
	// minOverlap: number of inputs that need to be active for a column
	// in order for a column to be considered during the inhibition step
	this.minOverlap = options.minOverlap || 15;
	this.desiredLocalActivity = options.desiredLocalActivity || 10;
};

SpacialPooler.prototype = {
	_initColumns: function(numColumns) {
		var i = 0;
		this.columns = [];
		for (i = 0; i < numColumns; i++) {
			this.columns.push(new Column({
				id: i
			}));
		}
	},

	/**
	 * Conceptually assign inputs to columns.  Internally, set synapse id.
	 * @param  {Array} inputs Array of ids
	 * @return {void}
	 */
	assignInputsToColumns: function(inputSize) {
		// each column as a segment
		// each segment has many synapses
		// each synapse holds the id of the input they are associated with
		this.columns.forEach(function(column) {
			column.segment.synapses.forEach(function(synapse) {
				synapse.id = Math.floor(Math.random() * inputSize);
			});
		});
	},

	/**
	 * Returns an sdr for an input
	 * @param  {Array} input - array of 
	 * @return {Array} input      [description]
	 */
	getSDR: function(input) {
		var columns = this._getOverlapColumns(input);
		var winners = this._inhibit(columns, input);
	},

	_getOverlapColumns: function(input) {
		return this.columns.reduce(function(winners, column) {
			var overlap = column.getOverlap(input);
			if (this.minOverlap <= overlap) {
				winners.push({
					overlap: overlap,
					columnId: column.id
				});
			}
			return winners;
		}, []);
	},

	_inhibit: function(overlaps) {
		var exclude = [];
		var radius = this.inhibitionRadius;
		overlaps.sort(function(a, b) {
			return b.overlap - a.overlap;
		});
		overlaps.length = this.desiredLocalActivity;
		return overlaps.reduce(function(winners, overlap) {
			var i;

			if (!~exclude.indexOf(overlap.id)) {
				winners.push(overlap);
				for (i = overlap.id - radius; i < overlap.id + radius + 1; i++) {
					exclude.push(i);
				}
			}

			return winners;
		}, []);
	}
};

module.exports = SpacialPooler;
