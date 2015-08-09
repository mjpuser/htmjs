'use strict';

var SP = require('./index');
var Synapse = require('./spatial-pooler-synapse');
var Segment = require('./spatial-pooler-segment');
var Column = require('./spatial-pooler-column');
var fs = require('fs');

var Serializer = {
	hydrate: function(json) {
		var column = null;
		var columns = [];

		json.synapses.forEach(function(config) {
			if (!column || config.columnId != column.id) {
				columns.push(new Column({
					segment: new Segment({
						columnId: config.columnId,
						synapses: []
					})
				}));
			}
			var synapse = new Synapse({
				id: config.id,
				permanence: config.permanence,
				active: config.active,
				segment: column.segment
			});
			synapse.segment.synapses.push(synapse);
		});
		json.columns = columns;
		var sp = new SP(json);

		return sp;
	},
	dehydrate: function(sp) {
		var json = {
			inputLength: sp.inputLength,
			medianSynapses: sp.medianSynapses,
			minOverlap: sp.minOverlap,
			desiredLocalActivity: sp.desiredLocalActivity,
			iterationPeriod: sp.iterationPeriod,
			permanenceDec: sp.permanenceDec,
			permanenceInc: sp.permanenceInc,
			maxBoost: sp.maxBoost,
			boost: sp.boost,
			columnLength: sp.columns.length,
			synapses: sp.columns.reduce(function(ids, c) {
				return ids.concat(c.segment.synapses.map(function(s) {
					return {
						id: s.id,
						columnId: s.segment.column.id,
						permanence: s.permanence,
						active: s.active
					};
				}));
			}, [])
		};

		return json;
	},
	save: function(filename, sp) {
		fs.writeFile(filename, JSON.stringify(this.dehydrate(sp)));
	},
	load: function(filename) {
		if (!fs.existsSync(filename)) {
			return null;
		}
		var config = JSON.parse(fs.readFileSync(filename));
		return this.hydrate(config);
	}
};


module.exports = Serializer;
