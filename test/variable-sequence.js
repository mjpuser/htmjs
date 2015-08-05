var TP = require('../lib/temporal-pooler');

var inputs = [
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172],
[19,103,119,158,174],
[0,48,68,92,193],
[11,32,73,118,161,199],
[19,103,119,158,174],
[0,48,68,92,193],
[4,15,84,96,137,172]
];

var tp = new TP({
	columns: 200,
	cellsPerColumn: 6
});

var prediction = [];
inputs.forEach(function(sdr, i) {
	//var sdr = sp.getSDR(input);
	tp.setInput(sdr);
	console.log(sdr.toString(), 'should be ', prediction.toString());
	prediction = tp.predictAndLearn();
});
// inspect segment synapse count
// tp.columns[137].cells.forEach(function(cell) { cell.segments.forEach(function(seg) { console.log(seg.cell.columnId, seg.cell.id, seg.synapses.length, seg.active); }) });
module.exports = tp;
