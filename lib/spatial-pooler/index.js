'use strict';

var Column = require('./spatial-pooler-column');
var sorted = require('sorted');

var SpatialPooler = function(options) {
	// options.columns has to be a number
	this.columns = null;
	this._initColumns(options.columns); // could be a circular array

	// inhibition params
	// minOverlap: number of inputs that need to be active for a column
	// in order for a column to be considered during the inhibition step
	this.minOverlap = options.minOverlap || 15;
	this.desiredLocalActivity = options.desiredLocalActivity || 2;
	this.inhibitionRadius = 10; // computed: receptive / local = 3?

	// learning params
	this.iterationPeriod = 1000; // period of the duty cycle
	this.permanenceDec = options.permanenceDec || 0.008;
	this.permanenceInc = options.permanenceInc || 0.05;
	this.maxBoost = 10;

	this.boost = options.boost || 1;
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
		var overlaps = this._getOverlapColumns(input);
		var winners = this._inhibit(overlaps, input);
		this._learn(winners, input);
	},

	_getOverlapColumns: function(input) {
		var self = this;
		return this.columns.reduce(function(winners, column) {
			var overlap;
			column.overlap = null;
			overlap = column.getOverlap(input);
			if (self.minOverlap <= overlap) {
				column.countAsActive(); // used for duty cycle
				winners.push({
					overlap: overlap * column.boost,
					id: column.id
				});
			}
			else {
				column.countAsInactive();
			}
			return winners;
		}, []);
	},

	_inhibit: function(overlaps) {
		var exclude = [];
		var radius = this.inhibitionRadius;
		var inhibitors = [];
		var rangeWinners = sorted([], Column.overlapComparator);;
		var range = radius * 2;
		var offset = 0;
		for (var i = 0; i < overlaps.length; i++) {
			// if overlap is outside of range, update offset, and try again
			if (overlaps[i].id > offset * range) {
				inhibitors = inhibitors.concat(rangeWinners.slice(0, this.desiredLocalActivity));
				offset++;
				i--;
				rangeWinners = sorted([], Column.overlapComparator);
				continue;
			}
			rangeWinners.push(overlaps[i]);
			if (rangeWinners.length > this.desiredLocalActivity) {
				rangeWinners.pop();
			}
		}
		return inhibitors;
	},

	getNeighborIndexes: function(index) {
		var indexes = [];
		var radius = this.inhibitionRadius;
		for (var i = index - radius; i < index + radius + 1; i++) {
			indexes.push(i);
		}
		return indexes;
	},

	_learn: function(winners, input) {
		var self = this;

		// update permanence values of synapses
		winners.forEach(function(winner) {
			this.columns[winner.id].segment.synapses.forEach(function(synapse) {
				synapse.learn(this.permanenceInc, this.permanenceDec);
				synapse.active = null;
			}, this);
		}, this);

		// update boosts
		winners.forEach(function(column) {
			var minDutyCycle;
			var maxDutyCycle = this.getNeighborIndexes(column.id).reduce(function(max, id) {
				var cycle = self.columns[id].getDutyCycle();
				return max < cycle ? cycle : max;
			}, 0);
			minDutyCycle = 0.01 * maxDutyCycle;
			// update boost
			c.boost = ((1 - self.maxBoost) / minDutyCycle * column.getDutyCycle()) + self.maxBoost;
			if (c.getDutyCycle() < minDutyCycle) {
				// update permanence
				column.segment.synapses.forEach(function(synapse) {
					synapse.increasePermanence();
				});
			}
		}, this);

		this.updateInhibitionRadius(input);
	},

	updateInhibitionRadius: function(input) {
		var radius = this.columns.reduce(function(sum, column) {
			return sum + column.segment.getConnectedSynapses(input);
		}, 0) / input.length / 2;

		this.inhibitionRadius = Math.round(Math.max(1, radius));
	}
};

module.exports = SpacialPooler;
