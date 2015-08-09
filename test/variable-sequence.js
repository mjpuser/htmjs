var TP = require('../lib/temporal-pooler');

var inputMap = {
	a: [19,32,48,68,82,103,119,138,149,158,174,193],
	b: [0,14,19,33,48,68,82,92,108,114,138,149,158,171,193],
	c: [0,11,21,40,52,70,73,89,111,118,140,143,161,178,195,199]
}

var inputs = [
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b,
	inputMap.a,
	inputMap.b,
	inputMap.b,
	inputMap.c,
	inputMap.b,
	inputMap.b
];

/*
var tp = new TP({ columns: 200,
     cellsPerColumn: 70,
     maxSegmentsPerCell: 13,
     maxDendritesPerSegment: 29,
     activationThreshold: 5,
     minThreshold: 7,
     dendriteSpan: 20,
     permanenceDec: 0.759,
     permanenceInc: 0.176,
     score: 66.08 });
*/
/*
// abbcbbabbc
var tp = new TP({ columns: 200,
     cellsPerColumn: 34,
     maxSegmentsPerCell: 9,
     maxDendritesPerSegment: 10,
     activationThreshold: 14,
     minThreshold: 8,
     dendriteSpan: 97,
     permanenceDec: 0.188,
     permanenceInc: 0.098,
     score: 100 });
*/
/*
var tp = new TP({ columns: 200,
     cellsPerColumn: 39,
     maxSegmentsPerCell: 3,
     maxDendritesPerSegment: 35,
     activationThreshold: 11,
     minThreshold: 4,
     dendriteSpan: 7,
     permanenceDec: 0.855,
     permanenceInc: 0.446,
     score: 96.08333333333333 });*/
/*
var tp = new TP({ columns: 200,
     cellsPerColumn: 43,
     maxSegmentsPerCell: 5,
     maxDendritesPerSegment: 41,
     activationThreshold: 3,
     minThreshold: 5,
     dendriteSpan: 44,
     permanenceDec: 0.342,
     permanenceInc: 0.785,
     score: 95.16666666666667 });
*/
/*
// abbbbabbbb
var tp = new TP( { columns: 200,
     cellsPerColumn: 53,
     maxSegmentsPerCell: 2,
     maxDendritesPerSegment: 35,
     activationThreshold: 15,
     minThreshold: 8,
     dendriteSpan: 10,
     permanenceDec: 0.7,
     permanenceInc: 0.1,
     score: 98.25 });
*/

// new stuff
var tp = new TP({ columns: 200,
     cellsPerColumn: 20,
     maxSegmentsPerCell: 17,
     maxDendritesPerSegment: 34,
     activationThreshold: 2,
     minThreshold: 4,
     dendriteSpan: 93,
     permanenceDec: 0.893,
     permanenceInc: 0.398,
     score: 100 });



var prediction = [];
inputs.forEach(function(sdr, i) {
	//var sdr = sp.getSDR(input);
	tp.setInput(sdr);
	var input = sdr == inputMap.a ? 'a' : sdr == inputMap.b ? 'b' : 'c';
	var totalCorrect = prediction.reduce(function(sum, val) {
		return sum + (~sdr.indexOf(val) ? 1 : 0);
	}, 0);
	var totalExtra = Math.max(0, prediction.length - totalCorrect);
	console.log(sdr.toString(), input, 'should be ', prediction.toString());
	console.log('correct', Math.round(totalCorrect / prediction.length * 100), 'captured', Math.round(totalCorrect / sdr.length * 100), '\n');
	prediction = tp.predictAndLearn();
});
// inspect segment synapse count
// tp.columns[137].cells.forEach(function(cell) { cell.segments.forEach(function(seg) { console.log(seg.cell.columnId, seg.cell.id, seg.synapses.length, seg.active); }) });
module.exports = tp;
