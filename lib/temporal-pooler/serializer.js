'use strict';

var Synapse = require('./temporal-pooler-synapse');
var TP = require('./index');
var Serializer = {
	/**
	 * Output should be a json object that can be read by the hydrate method
	 * to instantiate the temporal pooler.
	 * [
	 *   {
	 *   		id: 123,
	 *   		cells: [
	 *   			id: 44,
	 *   			synapses: [
	 *   		  	{ id: 1, segmentId: 4, permanence: 1 }, ...
	 *   		  ],
	 *   		  segmentIds: [
	 *   		  	4, 2, ...
	 *   		  ]
	 *   		]
	 *   }
	 * ]
	 * @param  {[type]} tp [description]
	 * @return {[type]}    [description]
	 */
	dehydrate: function(tp) {
		return {
			columns: tp.columns.map(function(col) {
				return {
					id: col.id,
					cells: col.cells.map(function(cell) {
						return {
							id: cell.id,
							synapses: cell.synapses.map(function(syn) {
								return {
									id: syn.id,
									cellId: cell.id,
									segmentId: syn.segment.id,
									permanence: syn.permanence
								}
							}),
							segmentIds: cell.segments.map(function(seg) {
								return seg.id;
							})
						};
					})
				};
			}),
			permanenceDec: tp.permanenceDec,
			permanenceInc: tp.permanenceInc,
			maxDendrites: tp.maxDendrites,
			activationThreshold: tp.activationThreshold,
			cellsPerColumn: tp.cellsPerColumn,
			segmentsPerCell: tp.segmentsPerCell
		};
	},
	hydrate: function(config) {
		var tp = new TP({
			columns: config.columns.length,
			cellsPerColumn: config.cellsPerColumn,
			permanenceDec: config.permanenceDec,
			permanenceInc: config.permanenceInc,
			maxDendrites: config.maxDendrites,
			activationThreshold: config.activationThreshold,
			segmentsPerCell: config.segmentsPerCell
		});
		tp.cells.forEach(function(cell) {
			cell.synapses.length = 0;
			cell.segments.forEach(function(seg) {
				seg.synapses.length = 0;
			});
		});
		tp.cells.forEach(function(cell) {
			config.columns[cell.columnId].cells.filter(function(c) {
				return c.id === cell.id;
			})[0].synapses.forEach(function(syn) {
				var segment = tp.cells[Math.floor((syn.segmentId - 1) / config.segmentsPerCell)].segments[syn.segmentId % config.segmentsPerCell];
				cell.synapses.push(new Synapse({
					id: syn.id,
					cell: tp.cells[syn.cellId],
					segment: segment,
					permanence: syn.permanence
				}));
			});
		});
		return tp;
	}
};



module.exports = Serializer;
