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


var tp = new TP({
	columns: 200,
	cellsPerColumn: 20
});

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
