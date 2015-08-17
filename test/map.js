'use strict';

var COLUMN_LENGTH = 4000;
var INPUT_LENGTH = 300;
var MEDIAN_SYNAPSES = 150; // synapses per SP column
var CELLS_PER_COLUMN = 20;
var MAX_SEGMENTS_PER_CELL = 17;
var MAX_DENDRITES_PER_SEGMENT = 34;
var ACTIVATION_THRESHOLD = 2;
var MIN_THRESHOLD = 4;
var DENDRITE_SPAN = 93;
var PERMANENCE_DEC = 0.893;
var PERMANENCE_INC = 0.398;

var Mapper = require('../lib/encoders/mapper');
var SpatialEncoder = require('../lib/encoders/spatial-encoder');
var SPSerializer = require('../lib/spatial-pooler/serializer');
var TPSerializer = require('../lib/temporal-pooler/serializer');
var SP = require('../lib/spatial-pooler');
var TP = require('../lib/temporal-pooler');
var spFile = __dirname + '/sp.json';
var tpFile = __dirname + '/tp.json';
var time = require('../lib/time');

var sp = SPSerializer.load(spFile);
var se = new SpatialEncoder({
	sp: sp,
	inputLength: INPUT_LENGTH,
	columnLength: COLUMN_LENGTH,
	medianSynapses: MEDIAN_SYNAPSES,
	minOverlap: 10
});
var mapper = new Mapper({
	encoder: se
});
var tp = TPSerializer.load(tpFile) || new TP(/*{
	columnLength: COLUMN_LENGTH,
	cellsPerColumn: CELLS_PER_COLUMN,
	maxSegmentsPerCell: MAX_SEGMENTS_PER_CELL,
	maxDendritesPerSegment: MAX_DENDRITES_PER_SEGMENT,
	activationThreshold: ACTIVATION_THRESHOLD,
	minThreshold: MIN_THRESHOLD,
	dendriteSpan: DENDRITE_SPAN,
	permanenceDec: PERMANENCE_DEC,
	permanenceInc: PERMANENCE_INC
},*/ { columnLength: 4000,
     cellsPerColumn: 47,
     maxSegmentsPerCell: 18,
     maxDendritesPerSegment: 23,
     activationThreshold: 4,
     minThreshold: 11,
     dendriteSpan: 91,
     permanenceDec: 0.413,
     permanenceInc: 0.784,
     score: 100 });

module.exports = {
	learn: function(words) {
		var prediction = null;
		words = words || '';
		words.split(' ').forEach(function(word) {
			var sdr = mapper.input(word);
			tp.setInput(sdr);
			prediction = tp.predictAndLearn();
		});
		var p = mapper.translate(prediction);
		time.increment(); // increment time to clear out TP

		return p;
	},
	predict: function(words, steps) {
		steps = steps || 1;
		return new Promise(function(resolve, reject) {
			var prediction = null;
			var phrase = [];
			words = words || '';
			words.split(' ').forEach(function(word) {
				var sdr = mapper.input(word);
				tp.setInput(sdr);
				prediction = tp.predict();
			});
			mapper.translate(prediction).then(function resolver(res) {
				var sdr = mapper.input(res.word);
				phrase.push(res.word);
				tp.setInput(sdr);
				var prediction = tp.predict();
				if (--steps > 0) {
					return mapper.translate(prediction).then(resolver);
				}
				else {
					time.increment();
					resolve(phrase);
				}
			}).catch(reject);
		});
	}
};
