'use strict';

var assert = require('assert');
var is = require('is-js');
var Column = require('./temporal-pooler-column');
var Cell = require('./temporal-pooler-cell');
var Segment = require('./temporal-pooler-segment');
var Synapse = require('./temporal-pooler-synapse');
var time = require('../time');
var sorted = require('sorted');

var TemporalPooler = function(options) {
	// number of columns
	this.numColumns = options.columns;
	assert.ok(is.number(this.numColumns) && this.numColumns > 0, 'columns must be a number > 0');

	// number of cells per column
	var cellsPerColumn = options.cellsPerColumn;
	assert.ok(is.number(cellsPerColumn) && cellsPerColumn > 0, 'cellsPerColumn must be a number > 0');
	this.cellsPerColumn = cellsPerColumn;
	this.cells = [];
	this.segmentsPerCell = options.segmentsPerCell || 3;
	this.maxDendrites = 20; // used for learning.  A segment to grow up to this number of dendrites

	this.dendritesPerSegment = options.dendritesPerSegment || 50;
	Segment.ACTIVATION_THRESHOLD = 5; //Math.floor(3 / 4 * this.dendritesPerSegment);
	//Segment.LEARNING_THRESHOLD = 4; // 
	//Segment.MIN_THRESHOLD = 10; // remove segment if falls below this.

	this.permanenceDec = options.permanenceDec || 0.008;
	this.permanenceInc = options.permanenceInc || 0.05;

	// range of connected synapses 
	this.connectionRange = options.connectionRange || 10;

	this._initColumns();
};

TemporalPooler.prototype = {
	_initColumns: function() {
		var column;
		var cell;
		var segments = [];
		var self = this;
		this.columns = [];
		for(var i = 0; i < this.numColumns; i++) {
			column = new Column({
				id: i
			});
			this.columns.push(column);
			for (var k = 0; k < this.cellsPerColumn; k++) {
				cell = new Cell({
					id: this.cells.length,
					columnId: column.id
				});
				column.addCell(cell);
				this.cells.push(cell);
			}
		}
		// create segments
		this.cells.forEach(function(cell) {
			var i;
			for (i = 0; i < this.segmentsPerCell; i++) {
				segments.push(new Segment({
					id: '' + cell.id + i,
					cell: cell
				}));
			}
		}, this);

		// assign input cells (represents dendrites)
		segments.forEach(function(segment) {
			var cellId;
			for (var i = 0; i < this.dendritesPerSegment; i++) {
				cellId = Math.max(0, Math.min(this.cells.length - 1, segment.cell.id + Math.floor(Math.random() * this.connectionRange) - Math.round((this.connectionRange / 2))));
				if (cellId == segment.cell.id) {
					i--;
					continue;
				}
				this.cells[cellId].synapses.push(new Synapse({
					segment: segment,
					cell: this.cells[cellId]
				}));
			}
		}, this);
	},
	setInput: function(input) {
		this.input = input;
	},
	predict: function() {
		var previousStep;
		var currentStep;
		var inference = sorted([]);

		time.increment();
		previousStep = time.getPreviousStep();
		currentStep = time.getCurrentStep();

		this.input.forEach(function(id) {
			var column = this.columns[id];
			var bottomUpPredicted = false;
			column.cells.forEach(function(cell) {
				var segment;
				if (previousStep.predictiveCells.has(cell)) {
					cell.markActive(currentStep);
				}
			});
			if (!bottomUpPredicted) {
				column.cells.forEach(function(cell) {
					cell.markActive(currentStep);
				});
			}
		}, this);

		currentStep.predictedColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference.toArray();
	},
	predictAndLearn: function() {
		var inference = sorted([]);

		time.increment();
		this.predictAndLearnPhase1();
		this.predictAndLearnPhase2();

		time.getCurrentStep().predictedColumns.forEach(function(id) {
			inference.push(id);
		});
		return inference.toArray();
	},
	predictAndLearnPhase1: function() {
		var self = this;
		var previousStep = time.getPreviousStep();

		this.input.forEach(function(id) {
			var column = self.columns[id];
			var anyCellsPredicted = false;
			column.cells.forEach(function(cell) {
				if (previousStep.predictiveCells.has(cell)) {
					anyCellsPredicted = true;
					cell.markActive();
				}
			});
			if (!anyCellsPredicted) {
				column.cells.forEach(function(cell) {
					cell.markActive();
				});
			}
		});
	},
	predictAndLearnPhase2: function() {
		var currentStep = time.getCurrentStep();
		var previousStep = time.getPreviousStep();
		var self = this;
		var reassigned = 0;

		previousStep.activeSynapses.forEach(function(synapse) {
			var isCorrect = previousStep.predictiveCells.has(synapse.segment.cell);
			var cell;
			var segment;
			var segmentIndex;
			if (isCorrect) {
				synapse.increment(self.permanenceInc);
			}
			else {
				cell = currentStep.activeCellList[Math.floor(Math.random() * currentStep.activeCellList.length)];
				console.log('cell', cell.id, previousStep.reassignedSynapse.has(synapse));
				if (cell && !previousStep.reassignedSynapse.has(synapse)) {
					var candidateSegment = synapse.segment;
					synapse.removeFromSegment();
					segment = self.getBestMatchingSegment(cell.segments, currentStep);
					segment.synapses.push(synapse);
					if (candidateSegment.isDying()) {
						segmentIndex = self.segments.indexOf(candidateSegment);
						self.segments.splice(segmentIndex, 1);
						candidateSegment.kill();
					}
					reassigned++;
					currentStep.reassignedSynapse.add(synapse);
					synapse.increment(self.permanenceInc);
				}
				else {
					synapse.decrement(self.permanenceDec);
				}
			}
			if (synapse.isDying()) {
				synapse.kill();
			}
		});
/*
		console.log('reassiend dude', currentStep.reassignedSynapse.size);
		console.log('current activeCells', currentStep.activeCellList.length);
		console.log('previously active', previousStep.activeCellList.length);
		console.log('are', currentStep == previousStep);
 	 	 console.log('reassigned', reassigned);
 	 	 */
	},
	getBestMatchingCell: function(column, step) {
		var bestMatchingSegment = null;
		var bestMatchingCell = null;
		var segments = [];
		column.cells.forEach(function(cell) {
			segments = segments.concat(cell.segments);
		});
		bestMatchingSegment = this.getBestMatchingSegment(segments, step);
		if (bestMatchingSegment) {
			bestMatchingCell = bestMatchingSegment.cell;
		}
		else {
			column.cells.forEach(function(cell) {
				bestMatchingCell = bestMatchingCell || cell;
				if (cell.segments.length < bestMatchingCell.segments.length) {
					bestMatchingCell = cell;
				}
			});
		}
		return bestMatchingCell;
	},
	getBestMatchingSegment: function(segments, step) {
		var bestMatchingSegment;
		segments.forEach(function(segment) {
			bestMatchingSegment = bestMatchingSegment || segment;
			if (step.connectedImpulses[segment.id] > step.connectedImpulses[bestMatchingSegment.id]) {
				bestMatchingSegment = segment;
			}
		});
		return bestMatchingSegment;
	},
	getSegmentUpdate: function(segment, step, newSynapses) {
		var segmentUpdate = new SegmentUpdate();
		var activeSynapses;
		var newSynapse;
		var totalLearningCells = step.learningCells.length;
		newSynapses = newSynapses || false;

		if (segment) {
			activeSynapses = segment.synapses.filter(function(synapse) {
				return step.activeSynapses.has(synapse);
			});
			while (newSynapses && this.maxDendrites - activeSynapses.length > 0 && totalLearningCells > 1) {
				var learningCell = step.learningCells[Math.floor(Math.random() * totalLearningCells)];
				if (learningCell.id != segment.cell.id) {
					newSynapse = new Synapse({
						segment: segment
					});
					activeSynapses.push(newSynapse);
					this.cells[learningCell.id].synapses.push(newSynapse);
				}
			}
		}

		segmentUpdate.activeSynapses = activeSynapses;
		segmentUpdate.segment = segment;
		return segmentUpdate;
	},
	adaptSegments: function(segmentList, positiveReinforcement) {
		var self = this;
		if (segmentList) {
			segmentList.forEach(function(segmentUpdate) {
				if (segmentUpdate.segment) {
					segmentUpdate.segment.sequence = segmentUpdate.sequence;
				}
				if (positiveReinforcement) {
					segmentUpdate.activeSynapses.forEach(function(synapse) {
						synapse.increment(self.permanenceInc);
					});
				}
				else {
					segmentUpdate.activeSynapses.forEach(function(synapse) {
						var index;
						synapse.decrement(self.permanenceDec);
						if (synapse.permanence <= Synapse.MIN_THRESHOLD) {
							index = synapse.segment.synapses.indexOf(synapse);
							synapse.segment.synapses.splice(index, 1);
						}
					});
				}
			});
		}
	}
};

module.exports = TemporalPooler;
