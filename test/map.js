'use strict';

var COLUMN_LENGTH = 4000;
var INPUT_LENGTH = 300;
var MEDIAN_SYNAPSES = 20; // synapses per SP column
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
	medianSynapses: MEDIAN_SYNAPSES
});
var mapper = new Mapper({
	encoder: se
});
var tp = TPSerializer.load(tpFile) || new TP({
	columnLength: COLUMN_LENGTH,
	cellsPerColumn: CELLS_PER_COLUMN,
	maxSegmentsPerCell: MAX_SEGMENTS_PER_CELL,
	maxDendritesPerSegment: MAX_DENDRITES_PER_SEGMENT,
	activationThreshold: ACTIVATION_THRESHOLD,
	minThreshold: MIN_THRESHOLD,
	dendriteSpan: DENDRITE_SPAN,
	permanenceDec: PERMANENCE_DEC,
	permanenceInc: PERMANENCE_INC
});

module.exports = {
	complete: function(words) {
		var prediction = null;
		words = words || '';
		words.split(' ').forEach(function(word) {
			var sdr = mapper.input(word);
			tp.setInput(sdr);
			prediction = tp.predictAndLearn();
		});
		mapper.translate(prediction);
		time.increment(); // increment time to clear out TP
	}
};
