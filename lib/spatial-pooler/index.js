'use strict';

var Column = require('./spatial-pooler-column');

var SpatialPooler = function(options) {
	// options.columns has to be a number
	this._initColumns(options.columns); // should be a circular array
	// minOverlap: number of inputs that need to be active for a column
	// in order for a column to be considered during the inhibition step
	this.minOverlap = options.minOverlap || 15;
};

SpacialPooler.prototype = {
	_initColumns: function(numColumns) {
		var i = 0;
		this.columns = [];
		for (i = 0; i < numColumns; i++) {
			this.columns.push(new Column());
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
		
	},

	_getOverlapColumns: function(input) {
		return this.columns.map(function(column) {
			var overlap = column.getOverlap(input);
			return this.minOverlap <= overlap;
		});	
	}
};

module.exports = SpacialPooler;
