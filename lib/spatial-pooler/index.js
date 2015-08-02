'use strict';

var Column = require('./spatial-pooler-column');
var sorted = require('sorted');

var SpatialPooler = function(options) {
	// options.columns has to be a number
	this.columns = null;
	this.inputs = options.inputs || 10;
	this.medianSynapses = options.medianSynapses || 15;
	this._initColumns(options.columns); // could be a circular array

	// inhibition params
	// minOverlap: number of inputs that need to be active for a column
	// in order for a column to be considered during the inhibition step
	this.minOverlap = options.minOverlap || 15;
	this.desiredLocalActivity = options.desiredLocalActivity || 2;
	this.inhibitionRadius = this.medianSynapses / this.desiredLocalActivity;

	// learning params
	this.iterationPeriod = options.iterationPeriod || 1000; // period of the duty cycle
	this.permanenceDec = options.permanenceDec || 0.008;
	this.permanenceInc = options.permanenceInc || 0.05;
	this.maxBoost = 10;

	this.boost = options.boost || 1;
};

SpatialPooler.prototype = {
	_initColumns: function(numColumns) {
		var i = 0;
		this.columns = [];
		for (i = 0; i < numColumns; i++) {
			this.columns.push(new Column({
				id: i,
				period: this.iterationPeriod,
				inputLength: this.inputs,
				medianSynapses: this.medianSynapses
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
	getSDR: function(input, learn) {
		var overlaps = this._getOverlapColumns(input);
		var winners = this._inhibit(overlaps, input);
		this._learn(winners, input);
		return winners.map(function(w) {
			return w.id;
		});
	},

	_getOverlapColumns: function(input) {
		var self = this;
		return this.columns.reduce(function(winners, column) {
			var overlap;
			column.overlap = null;
			overlap = column.getOverlap(input);
			if (self.minOverlap <= overlap) {
				column.markActive(); // used for duty cycle
				winners.push({
					overlap: overlap * column.boost,
					id: column.id
				});
			}
			else {
				column.markInactive();
			}
			return winners;
		}, []);
	},

	_inhibit: function(overlaps) {
		var exclude = [];
		var radius = this.inhibitionRadius;
		var inhibitors = sorted([], Column.comparator);
		var rangeWinners = sorted([], Column.overlapComparator);;
		var range = radius * 2;
		var offset = 0;
		for (var i = 0; i < overlaps.length; i++) {
			// if overlap is outside of range, update offset, and try again
			if (overlaps[i].id > offset * range) {
				inhibitors = inhibitors.concat.apply(inhibitors, rangeWinners.slice(0, this.desiredLocalActivity).toArray());
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
		inhibitors = inhibitors.concat.apply(inhibitors, rangeWinners.slice(0, this.desiredLocalActivity).toArray());
		return inhibitors.toArray();
	},

	getNeighborIndexes: function(index) {
		var indexes = [];
		var radius = this.inhibitionRadius;
		var start = Math.floor(Math.max(0, index - radius));
		var end = Math.floor(Math.min(index + radius + 1, this.columns.length - 1));
		for (var i = start; i < end; i++) {
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
			}, this);
		}, this);

		// update boosts
		winners.forEach(function(winner) {
			var minDutyCycle;
			var column = self.columns[winner.id];
			var maxDutyCycle = this.getNeighborIndexes(winner.id).reduce(function(max, id) {
				var cycle = self.columns[id].getDutyCycle();
				return max < cycle ? cycle : max;
			}, 0);
			minDutyCycle = 0.01 * maxDutyCycle;
			// update boost
			column.boost = ((1 - self.maxBoost) / minDutyCycle * column.getDutyCycle()) + self.maxBoost;
			column.boost = Math.min(self.boost, 1);
			if (column.getDutyCycle() < minDutyCycle) {
				// update permanence
				column.segment.synapses.forEach(function(synapse) {
					synapse.increasePermanence();
				});
			}
		}, this);

		this.updateInhibitionRadius(input);
	},

	updateInhibitionRadius: function(input) {
		var totalConnected = this.columns.reduce(function(sum, column) {
			return sum + column.segment.getConnectedSynapses({ clear: true });
		}, 0);
		var radius = totalConnected / this.columns.length;
		this.inhibitionRadius = Math.round(Math.max(1, radius));
	}
};

module.exports = SpatialPooler;
